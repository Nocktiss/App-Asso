import { request, withPagination } from "./utils";
import {
  path,
  API_ANIMAL_ASSOCIATIONS,
  API_ANIMAL_LIST_TYPES,
  API_ANIMAL_PICTURES,
} from "../../config/_entrypoint";
import { dateSetTime } from "../../config/utils";
import { LS_ANIMAL_LIST_TYPES } from "../../config/_constants";
import storage from "../../config/storage";

export const REQUEST_ANIMAL_LIST = "REQUEST_ANIMAL_LIST";
export const RECEIVE_ANIMAL_LIST = "RECEIVE_ANIMAL_LIST";
export const REQUEST_ANIMAL_LIST_TYPES = "REQUEST_ANIMAL_LIST_TYPES";
export const RECEIVE_ANIMAL_LIST_TYPES = "RECEIVE_ANIMAL_LIST_TYPES";
export const REQUEST_ANIMAL_PICTURES_LIST = "REQUEST_ANIMAL_PICTURES_LIST";
export const RECEIVE_ANIMAL_PICTURES_LIST = "RECEIVE_ANIMAL_PICTURES_LIST";

function convertEntityValue(entity) {
  if (entity.prescription && entity.prescription.treatments) {
    if (!Array.isArray(entity.prescription.treatments)) {
      entity.prescription.treatments = Object.values(
        entity.prescription.treatments
      );
    }

    if (entity.prescription.treatments.length) {
      entity.prescription.treatments = entity.prescription.treatments.map(
        treatment => {
          if (treatment.phases) {
            if (!Array.isArray(treatment.phases)) {
              treatment.phases = Object.values(treatment.phases);
            }

            if (treatment.phases.length) {
              treatment.phases.map(phase => {
                if (phase.times !== null) {
                  phase.times = Object.entries(phase.times).map(pair => {
                    return {
                      id: pair[0],
                      value: dateSetTime(
                        new Date(),
                        ...pair[1].split(":")
                      ).toISOString(),
                    };
                  });
                }

                return phase;
              });
            }
          }

          return treatment;
        }
      );
    }
  }

  return entity;
}

export const fetchAnimalList = (association, page) =>
  request(path(API_ANIMAL_ASSOCIATIONS, { ":id": association.id }), {
    query: { page },
    ...withPagination({
      itemsPerPage: 4,
      withMetadata: true,
    }),
  }).then(result => {
    result.data = result.data.map(entity => convertEntityValue(entity));
    return Promise.resolve(result);
  });

export const fetchAnimalTypes = () =>
  storage.withCache(
    () => request(path(API_ANIMAL_LIST_TYPES), { ...withPagination() }),
    LS_ANIMAL_LIST_TYPES
  );

export const fetchAnimalPicturesList = (animal, page) =>
  request(path(API_ANIMAL_PICTURES, { ":animalid": animal.id }), {
    query: { page },
    ...withPagination({
      itemsPerPage: 4,
      withMetadata: true,
    }),
  }).then(result => {
    result.data = result.data.map(entity => convertEntityValue(entity));
    return Promise.resolve(result);
  });
