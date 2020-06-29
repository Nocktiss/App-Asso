import { useContext } from "react";
import { RootContext } from "../context/RootContext";
import {
  RECEIVE_SEARCH_ASSOCIATIONS,
  searchAssociations,
  REQUEST_SEARCH_ASSOCIATIONS,
} from "../context/actions/association";
import { toQueryString } from "../config/utils";

const useAssociations = () => {
  const {
    state: { association: associationState },
    dispatch,
  } = useContext(RootContext);
  const actions = {
    search: async query => {
      const cacheKey = toQueryString(query);

      dispatch({
        type: REQUEST_SEARCH_ASSOCIATIONS,
        payload: { query },
      });

      if (associationState.searchResult.history[cacheKey]) {
        dispatch({
          type: RECEIVE_SEARCH_ASSOCIATIONS,
          payload: { query },
        });
        return associationState.searchResult.history[cacheKey];
      }

      return searchAssociations(query).then(associations => {
        dispatch({
          type: RECEIVE_SEARCH_ASSOCIATIONS,
          payload: { query, associations },
        });
      });
    },
  };

  const selectors = {
    getSearchResult: () => {
      const isSearching = associationState.searchResult.searching,
        results = isSearching
          ? associationState.searchResult.history[
              associationState.searchResult.lastQuery
            ]
          : associationState.searchResult.history[
              associationState.searchResult.lastQuery
            ];

      return results || [];
    },
    getAssociationById: id => {
      const associations =
        associationState.searchResult.history[
          associationState.searchResult.query
        ];
      return associations.find(asso => asso[0].id === id);
    },
  };

  return { actions, selectors };
};

export default useAssociations;
