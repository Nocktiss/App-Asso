import { request, withPagination } from "./utils";
import {
  path,
  API_ANIMALS,
  API_ANIMAL_TYPES,
  API_ANIMAL_TYPES_SUBTYPES,
} from "../../config/_entrypoint";
import { LS_ANIMAL_TYPES } from "../../config/_constants";
import storage from "../../config/storage";

export const REQUEST_ANIMAL_TYPES = "REQUEST_ANIMAL_TYPES";
export const RECEIVE_ANIMAL_TYPES = "RECEIVE_ANIMAL_TYPES";
export const RECEIVE_ANIMAL_SUB_TYPES = "RECEIVE_ANIMAL_SUB_TYPES";

export const fetchAnimals = () =>
  request(path(API_ANIMALS), {
    query: {
      groups: ["animal_read", "animal_file"],
    },
    ...withPagination({ itemsPerPage: 50, grabAll: true }),
  });

export const fetchAnimalTypes = () =>
  storage.withCache(
    () =>
      request(path(API_ANIMAL_TYPES), {
        ...withPagination({ itemsPerPage: 50, grabAll: true }),
      }),
    LS_ANIMAL_TYPES
  );

export const fetchAnimalSubTypes = type =>
  storage.withCache(
    () =>
      request(path(API_ANIMAL_TYPES_SUBTYPES, { ":id": type.id }), {
        ...withPagination({ grabAll: true }),
      }),
    LS_ANIMAL_TYPES + "-" + type.id
  );
