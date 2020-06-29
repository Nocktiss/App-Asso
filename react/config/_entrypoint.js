export const API_HOST =
  (__DEV__ && "http://localhost:8080") || "https://api.vetixy.com";

export const API_PATH = "/";

export const API_ANIMALS = API_PATH + "animals";
export const API_ANIMAL_TYPES = API_PATH + "animal_types";
export const API_ANIMAL_SUBTYPES = API_PATH + "animal_sub_types";
export const API_ANIMAL_TYPES_SUBTYPES = API_ANIMAL_TYPES + "/:id/sub_types";

export const API_CONTACT_ANIMALS = API_ANIMALS + "/:id/contacts";

export const API_ASSOCIATIONS = API_PATH + "associations";
export const API_ANIMAL_ASSOCIATIONS = API_ASSOCIATIONS + "/:id/animals";
export const API_ANIMAL_PICTURES =
  API_ANIMAL_ASSOCIATIONS + "/:animalid/pictures";

export const path = (endpoint, params = {}) =>
  Object.keys(params).reduce(
    (url, key) => url.replace(key, params[key]),
    API_HOST + endpoint
  );
