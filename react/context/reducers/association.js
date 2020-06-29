import {
  RECEIVE_ASSOCIATIONS,
  REQUEST_ASSOCIATIONS,
  RECEIVE_ALLASSOCIATIONS,
  RECEIVE_DELETE_MYASSOCIATIONS,
  REQUEST_SEARCH_ASSOCIATIONS,
  RECEIVE_SEARCH_ASSOCIATIONS,
  RECEIVE_ASSOCIATION_LINK,
} from "../actions/association";
import { array_unique, toQueryString } from "../../config/utils";

export const initialState = {
  associations: {},
  allAssociations: [],
  searchResult: {
    query: null,
    lastQuery: null,
    searching: false,
    history: {},
  },
};

export const reducer = (
  state = {
    associations: {},
    allAssociations: [],
    searchResult: {
      query: null,
      lastQuery: null,
      searching: false,
      history: {},
    },
  },
  action
) => {
  let newAssociations = [],
    cacheKey = null;
  switch (action.type) {
    case REQUEST_ASSOCIATIONS:
      newAssociations[action.payload.animal["@id"]] = {
        ...(state.associations[action.payload.animal["@id"]] || { data: [] }),
        searching: true,
      };

      return {
        ...state,
        associations: { ...state.associations, ...newAssociations },
      };
    case RECEIVE_ASSOCIATIONS:
      newAssociations[action.payload.animal["@id"]] = {
        ...(state.associations[action.payload.animal["@id"]] || {}),
        searching: false,
        received: true,
        data: [
          ...((state.associations[action.payload.animal["@id"]] &&
            state.associations[action.payload.animal["@id"]].data) ||
            []),
          ...action.payload.associations,
        ],
        ...action.payload.metadata,
      };

      newAssociations[action.payload.animal["@id"]].data = array_unique(
        newAssociations[action.payload.animal["@id"]].data,
        "@id"
      );

      return {
        ...state,
        associations: { ...state.associations, ...newAssociations },
      };
    case RECEIVE_ALLASSOCIATIONS:
      return {
        ...state,
        allAssociations: action.payload.formatted,
        associations: action.payload.inParts,
      };
    case RECEIVE_DELETE_MYASSOCIATIONS:
      newAssociations[action.payload.animal["@id"]] = {
        ...(state.associations[action.payload.animal["@id"]] || {}),
        data: (
          (state.associations[action.payload.animal["@id"]] &&
            state.associations[action.payload.animal["@id"]].data) ||
          []
        ).filter(myAssociation => {
          return myAssociation["@id"] !== action.payload.association["@id"];
        }),
      };

      return Object.assign({}, state, {
        associations: Object.assign({}, state.associations, newAssociations),
      });
    case REQUEST_SEARCH_ASSOCIATIONS:
      cacheKey = toQueryString(action.payload.query);
      return {
        ...state,
        searchResult: {
          ...state.searchResult,
          searching: true,
          query: cacheKey,
          lastQuery: state.searchResult.query,
        },
      };
    case RECEIVE_SEARCH_ASSOCIATIONS:
      const newSearchResult = { ...state.searchResult };
      cacheKey = toQueryString(action.payload.query);

      if (action.payload.associations) {
        newSearchResult.history[cacheKey] = action.payload.associations;
      }
      newSearchResult.searching = false;

      return {
        ...state,
        searchResult: newSearchResult,
      };
    case RECEIVE_ASSOCIATION_LINK:
      newAssociations[action.payload.associationLink.animal] = {
        ...(state.associations[action.payload.associationLink.animal] || {}),
        data: [
          action.payload.associationLink,
          ...((state.associations[action.payload.associationLink.animal] &&
            state.associations[action.payload.associationLink.animal].data) ||
            []),
        ],
      };

      return Object.assign({}, state, {
        associations: Object.assign({}, state.associations, newAssociations),
      });
    default:
      return state;
  }
};
