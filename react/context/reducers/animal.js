import {
  REQUEST_ANIMALS,
  RECEIVE_ANIMALS,
  REQUEST_ANIMAL_TYPES,
  RECEIVE_ANIMAL_TYPES,
  RECEIVE_ANIMAL_SUB_TYPES,
  SELECTED_ANIMAL,
  RECEIVE_ANIMAL_UPDATE,
  RECEIVE_ANIMAL_CREATE,
  RECEIVE_FOLLOWERS,
  RECEIVE_FOLLOWER_DELETE,
  RECEIVE_FOLLOWER_NEW,
} from "../actions/animal";

export const initialState = {
  animals: [],
  selected: undefined,
  animalsReceived: false,
  types: {
    data: [],
    loading: false,
    received: false,
  },
  followers: {},
};

export const reducer = (state, action) => {
  switch (action.type) {
    case REQUEST_ANIMALS:
      return {
        ...state,
        animalsLoading: true,
      };
    case RECEIVE_ANIMALS:
      const selected =
        state.selected &&
        action.payload.animals.find(
          animal => animal["@id"] === state.selected["@id"]
        )
          ? state.selected
          : action.payload.animals[0];
      return {
        ...state,
        animals: action.payload.animals,
        animalsLoading: false,
        animalsReceived: true,
        selected: selected,
      };
    case SELECTED_ANIMAL:
      return Object.assign({}, state, {
        selected: action.payload.animal,
      });
    case RECEIVE_ANIMAL_CREATE:
      return Object.assign({}, state, {
        animals: [action.payload.animal, ...state.animals],
      });
    case RECEIVE_ANIMAL_UPDATE:
      return Object.assign({}, state, {
        animals: state.animals.map(item =>
          item.id === action.payload.animal.id ? action.payload.animal : item
        ),
      });
    case REQUEST_ANIMAL_TYPES:
      return Object.assign({}, state, {
        types: { data: [], loading: true, received: false },
      });
    case RECEIVE_ANIMAL_TYPES:
      return Object.assign({}, state, {
        types: { ...state.types, data: action.payload.types },
      });
    case RECEIVE_ANIMAL_SUB_TYPES:
      const animalTypes = state.types;
      const index = animalTypes.data.findIndex(
        type => type["@id"] === action.payload.type["@id"]
      );
      animalTypes.data[index].subTypes = action.payload.subTypes;

      const received =
        animalTypes.data.filter(type => type.subTypes === undefined).length ===
        0;
      animalTypes.loading = !received;
      animalTypes.received = received;

      return {
        ...state,
        types: animalTypes,
      };
    case RECEIVE_FOLLOWERS:
      const followers = Object.assign({}, state.followers);
      followers[action.payload.animal["@id"]] =
        followers[action.payload.animal["@id"]] || {};
      followers[action.payload.animal["@id"]].data = action.payload.followers;
      followers[action.payload.animal["@id"]].received = true;

      return Object.assign({}, state, {
        followers,
      });
    case RECEIVE_FOLLOWER_NEW:
      let newFollowers = {};
      newFollowers[action.payload.follower.animal["@id"]] = {
        data: [
          ...(state.followers[action.payload.follower.animal["@id"]]
            ? state.followers[action.payload.follower.animal["@id"]].data
            : []),
          action.payload.follower,
        ],
        received: true,
      };
      return Object.assign({}, state, {
        followers: Object.assign({}, state.followers, newFollowers),
      });
    case RECEIVE_FOLLOWER_DELETE:
      let deleteFollowers = {};
      deleteFollowers[action.payload.follower.animal["@id"]] = {
        data: state.followers[
          action.payload.follower.animal["@id"]
        ].data.filter(
          follower => follower["@id"] !== action.payload.follower["@id"]
        ),
        received: true,
      };
      return Object.assign({}, state, {
        followers: Object.assign({}, state.followers, deleteFollowers),
      });
    default:
      return state;
  }
};
