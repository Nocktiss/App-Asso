import { useContext } from "react";
import storage from "../config/storage";
import { LS_ANIMAL_SELECTED } from "../config/_constants";
import {
  SELECTED_ANIMAL,
  RECEIVE_ANIMAL_TYPES,
  fetchAnimalTypes,
  RECEIVE_ANIMAL_SUB_TYPES,
  fetchAnimalSubTypes,
  REQUEST_ANIMAL_TYPES,
  fetchAnimals,
  RECEIVE_ANIMALS,
  REQUEST_ANIMALS,
} from "../context/actions/animal";
import { RootContext } from "../context/RootContext";

const useAnimals = () => {
  const {
    state: { animal: animalState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    loadAnimals: async () => {
      if (animalState.animalsLoading) return false;
      if (animalState.animalsReceived) return true;
      dispatch({
        type: REQUEST_ANIMALS,
      });
      let selectedAnimal = await storage.getItem(LS_ANIMAL_SELECTED);
      if (selectedAnimal) {
        dispatch({
          type: SELECTED_ANIMAL,
          payload: { animal: selectedAnimal },
        });
      }
      const animals = await fetchAnimals();
      if (!selectedAnimal && animals.length) {
        dispatch({
          type: SELECTED_ANIMAL,
          payload: { animal: animals[0] },
        });
      }
      dispatch({
        type: RECEIVE_ANIMALS,
        payload: { animals },
      });
      return true;
    },
    getAnimalTypes: async () => {
      if (animalState.types.loading) return false;
      if (animalState.types.received) return true;
      dispatch({
        type: REQUEST_ANIMAL_TYPES,
        payload: { types },
      });
      const types = await fetchAnimalTypes();
      dispatch({
        type: RECEIVE_ANIMAL_TYPES,
        payload: { types },
      });
      await Promise.all(
        types.map(async type => {
          const subTypes = await fetchAnimalSubTypes(type);
          dispatch({
            type: RECEIVE_ANIMAL_SUB_TYPES,
            payload: { type, subTypes },
          });
        })
      );
      return true;
    },
  };

  const selectors = {
    getAnimals: () => animalState.animals,
    isAnimalsReceived: () => animalState.animalsReceived,
    getAnimalTypes: () => animalState.types.data,
    isAnimalTypesReceived: () => animalState.types.received,
  };

  return { actions, selectors };
};

export default useAnimals;
