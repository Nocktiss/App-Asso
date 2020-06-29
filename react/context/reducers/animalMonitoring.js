import { array_unique } from "../../config/utils";
import {
  RECEIVE_ANIMAL_LIST_TYPES,
  REQUEST_ANIMAL_LIST_TYPES,
  REQUEST_ANIMAL_LIST,
  RECEIVE_ANIMAL_LIST,
  REQUEST_ANIMAL_PICTURES_LIST,
  RECEIVE_ANIMAL_PICTURES_LIST,
} from "../actions/animalMonitoring";

export const initialState = {
  animals: {},
  animalTypes: {
    data: [],
    loading: false,
    received: false,
  },
};

export const reducer = (
  state = {
    animals: {},
    animalTypes: {
      data: [],
      loading: false,
      received: false,
    },
  },
  action
) => {
  let newAnimals = {};
  let newPictures = {};
  let assoId;
  let animalId;
  switch (action.type) {
    case REQUEST_ANIMAL_LIST:
      assoId = "/associations/" + action.payload.association.id;
      newAnimals[assoId] = {
        ...(state.animals[assoId] || { data: [] }),
        searching: true,
      };

      return { ...state, animals: { ...state.animals, ...newAnimals } };
    case RECEIVE_ANIMAL_LIST:
      assoId = "/associations/" + action.payload.association.id;
      newAnimals[assoId] = {
        ...(state.animals[assoId] || {}),
        searching: false,
        data: [
          ...((state.animals[assoId] && state.animals[assoId].data) || []),
          ...action.payload.animals,
        ],
        ...action.payload.metadata,
      };

      newAnimals[assoId].data = array_unique(newAnimals[assoId].data, "@id");

      return { ...state, animals: { ...state.animals, ...newAnimals } };
    case REQUEST_ANIMAL_LIST_TYPES:
      return Object.assign({}, state, {
        animalTypes: { data: [], loading: true, received: false },
      });
    case RECEIVE_ANIMAL_LIST_TYPES:
      return {
        ...state,
        animalTypes: {
          data: action.payload.types,
          loading: false,
          received: true,
        },
      };

    case REQUEST_ANIMAL_PICTURES_LIST:
      animalId = "/animals/" + action.payload.animal.id;
      newPictures[animalId] = {
        ...(state.animals[animalId] || { data: [] }),
        searching: true,
      };
      return { ...state, animals: { ...state.animals, ...newPictures } };
    case RECEIVE_ANIMAL_PICTURES_LIST:
      animalId = "/animals/" + action.payload.animal.id;
      newPictures[animalId] = {
        ...(state.animals[animalId] || {}),
        searching: false,
        data: [
          ...((state.animals[animalId] && state.animals[animalId].data) || []),
          ...action.payload.animals,
        ],
        ...action.payload.metadata,
      };

      newPictures[animalId].data = array_unique(
        newPictures[animalId].data,
        "@id"
      );

      return { ...state, animals: { ...state.animals, ...newPictures } };
    default:
      return state;
  }
};
