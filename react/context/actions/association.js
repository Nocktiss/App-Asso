import { request, withPagination } from "./utils";
import {
  path,
  API_CONTACT_ANIMALS,
  API_CONTACT_ANIMALS_DIRECT,
  API_ASSOCIATIONS,
} from "../../config/_entrypoint";
import { object_filter } from "../../config/utils";

export const REQUEST_SEARCH_ASSOCIATIONS = "REQUEST_SEARCH_ASSOCIATIONS";
export const RECEIVE_SEARCH_ASSOCIATIONS = "RECEIVE_SEARCH_ASSOCIATIONS";
export const RECEIVE_ASSOCIATIONS = "RECEIVE_ASSOCIATIONS";
export const REQUEST_ASSOCIATIONS = "REQUEST_ASSOCIATIONS";
export const RECEIVE_ALLASSOCIATIONS = "RECEIVE_ALLASSOCIATIONS";
export const RECEIVE_DELETE_MYASSOCIATIONS = "RECEIVE_DELETE_MYASSOCIATIONS";
export const RECEIVE_CONTACT_LINK = "RECEIVE_CONTACT_LINK";

export const fetchAssociations = (animal, page) =>
  request(path(API_CONTACT_ANIMALS, { ":id": animal.id }), {
    query: { page },
    ...withPagination({
      withMetadata: true,
    }),
  });

export const fetchAllAssociations = () =>
  request(path(API_CONTACT_ANIMALS_DIRECT), {
    ...withPagination({
      grabAll: true,
    }),
  }).then(async result => {
    const formatted = Object.values(
      result.reduce((accu, item) => {
        if (accu[item.contact["@id"]] === undefined)
          accu[item.contact["@id"]] = Object.assign(
            {},
            { links: [] },
            item.contact
          );

        accu[item.contact["@id"]].links.push(item["@id"]);

        if (!accu[item.contact["@id"]].bookmarked && item.bookmarked) {
          accu[item.contact["@id"]].bookmarked = true;
        }

        return accu;
      }, {})
    );

    const inParts = result.reduce((newAssociations, item) => {
      if (newAssociations[item.animal] === undefined) {
        newAssociations[item.animal] = {
          searching: false,
          last: true,
          data: [item],
        };
      } else {
        newAssociations[item.animal].data.push(item);
      }

      return newAssociations;
    }, {});

    return { formatted, inParts };
  });

export const deleteMyContact = contactAnimal =>
  request(path("") + contactAnimal["@id"], { method: "DELETE" });

export const searchAssociations = query => {
  const params = object_filter(query, value => value !== "");
  if (params.distance) {
    params.order_distance = {
      lng: params.distance.lng,
      lat: params.distance.lat,
      order: "ASC",
    };
    delete params.distance;
  }

  return request(path(API_ASSOCIATIONS), {
    query: params,
    ...withPagination({
      itemsPerPage: 50,
    }),
  });
};

export const linkContact = (contact, animal) =>
  request(path(API_CONTACT_ANIMALS_DIRECT), {
    method: "POST",
    body: { animal: animal["@id"], contact: contact["@id"] },
  });
