import { toQueryString } from "../../config/utils";
import { path } from "../../config/_entrypoint";
import SubmissionError from "../../errors/SubmissionError";
import TokenExpiredError from "../../errors/TokenExpiredError";

const defaultConfig = {
  pagination: {
    grabAll: false,
    enabled: false,
    itemsPerPage: 30,
    withMetadata: false,
  },
};

export const withPagination = config => {
  return {
    pagination: Object.assign({}, defaultConfig.pagination, {
      enabled: true,
      ...config,
    }),
  };
};

let requestFailedHandler = [];
export const addRequestFailedHandler = handler => {
  requestFailedHandler.push(handler);
};

/**
 * @param url
 * @param method
 * @param id
 * @param query
 * @param body
 * @param requestConfig
 * @returns {Promise<any | never>}
 */
export const request = async (
  url,
  { method, id, query, body, ...requestConfig } = {
    method: "GET",
    id: null,
    query: null,
    body: null,
  }
) => {
  requestConfig = Object.assign({}, defaultConfig, requestConfig);

  const options = {
    method: method,
    headers: {
      Accept: "application/ld+json",
      "Content-Type": "application/json",
    },
    mode: "cors",
  };

  if (body) options.body = JSON.stringify(body);

  if (requestConfig.pagination.enabled && url.indexOf("itemsPerPage") === -1) {
    query = query || {};
    query.itemsPerPage = requestConfig.pagination.itemsPerPage;
  }

  return fetch(
    url + (id ? "/" + id : "") + (query ? "?" + toQueryString(query) : ""),
    options
  )
    .then(response => {
      if (response.status === 204) {
        return Promise.resolve({});
      }
      if ([403, 401].includes(response.status)) {
        if (response.status === 401) {
          return response.text().then(error => {
            if (error.search("(Expired|Invalid) JWT Token") !== -1)
              throw new TokenExpiredError();
            if (error.search("account.bad_credentials") !== -1)
              throw new SubmissionError({
                email: "error.account.bad_credentials",
                password: "error.account.bad_credentials",
              });
            throw new Error("error.permission-denied");
          });
        }
        throw new Error("error.permission-denied");
        //return Promise.reject({message: 'error.permission-denied'});
      }

      if (
        response.headers
          .get("content-type")
          .match(/application\/(ld\+)?json/) === null
      ) {
        throw new TypeError();
      }

      return response.json();
    })
    .then(
      async json => {
        let result;
        if (json.violations) {
          let formattedErrors = {};
          json.violations.forEach(
            error =>
              (formattedErrors[error.propertyPath] =
                "error." + error.message.replace(/\.$/, ""))
          );

          return Promise.reject(new SubmissionError(formattedErrors));
        }

        if (
          json["@type"] === "hydra:Error" &&
          json["hydra:description"] === "Not Found"
        ) {
          return Promise.reject({ type: "not-found" });
        }

        if (requestConfig.pagination.enabled) {
          result = (json["hydra:totalItems"] && json["hydra:member"]) || [];
          if (
            requestConfig.pagination.grabAll &&
            json["hydra:view"] &&
            json["hydra:view"]["hydra:next"]
          ) {
            const endpoint = path(json["hydra:view"]["hydra:next"]);
            const subResult = await request(endpoint, requestConfig);
            result = [...result, ...subResult];
          }
          if (requestConfig.pagination.withMetadata) {
            let isLast = true;

            if (json["hydra:view"]) {
              isLast = json["hydra:view"]["hydra:next"] === undefined;
            }

            result = {
              data: result,
              metadata: {
                isLast,
                page: query.page,
              },
            };

            if (!isLast) result.metadata.next = query.page + 1;
          }
        } else {
          result = json;
        }

        return Promise.resolve(result);
      },
      error => {
        const event = {
          error,
          stopPropagation: false,
        };
        for (const handler of requestFailedHandler) {
          handler(event);
          if (event.stopPropagation) return;
        }
        if (error.name === "SubmissionError") throw error;
        return Promise.reject({ type: "general", data: error.message });
      }
    );
};
