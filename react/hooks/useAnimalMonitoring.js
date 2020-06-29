import { useContext } from "react";
import { RootContext } from "../context/RootContext";
import {
  REQUEST_ANIMAL_LIST,
  RECEIVE_ANIMAL_LIST,
  REQUEST_ANIMAL_PICTURES_LIST,
  RECEIVE_ANIMAL_PICTURES_LIST,
  fetchAnimalList,
  fetchAnimalPicturesList,
} from "../context/actions/animalMonitoring";

const useAnimalMonitoring = () => {
  const {
    state: { animals: animalState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    getAnimalList: async (association, page = 1) => {
      dispatch({
        type: REQUEST_ANIMAL_LIST,
        payload: { association },
      });
      return fetchAnimalList(association, page).then(result => {
        dispatch({
          type: RECEIVE_ANIMAL_LIST,
          payload: {
            association,
            animals: result.data,
            metadata: result.metadata,
          },
        });

        return result.data;
      });
    },
    getAnimalPicturesList: async (animal, page = 1) => {
      dispatch({
        type: REQUEST_ANIMAL_PICTURES_LIST,
        payload: { animal },
      });
      return fetchAnimalPicturesList(animal, page).then(result => {
        dispatch({
          type: RECEIVE_ANIMAL_PICTURES_LIST,
          payload: {
            animal,
            animals: result.data,
            metadata: result.metadata,
          },
        });

        return result.data;
      });
    },
  };

  const selectors = {
    getAnimalList: association => {
      const assoId = "/associations/" + association.id;
      if (animalState.animals[assoId]) {
        return animalState.animals[assoId];
      } else {
        return { data: [], received: false };
      }
    },
    getAnimal: (assoId, animalId) => {
      assoId = "/associations/" + assoId;
      return animalState.animals[assoId].data.find(
        animal => animal.id === animalId
      );
    },
    getAnimalPicturesList: animal => {
      return {
        data: [
          {
            "@id": 1,
            avatar_file: {},
          },
          {
            "@id": 2,
            avatar_file: {},
          },
          {
            "@id": 3,
            avatar_file: {},
          },
          {
            "@id": 4,
            avatar_file: {},
          },
        ],
        received: false,
      };
      // const animalId = "/animals/" + animal.id;
      // if (animalState.animals[animalId]) {
      //   return animalState.animals[animalId];
      // } else {
      //   return { data: [], received: false };
      // }
    },
  };

  return { actions, selectors };
};

export default useAnimalMonitoring;
