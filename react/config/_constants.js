import logoPrescription from "../images/events/prescription.png";
import logoDeworming from "../images/events/deworming.png";
import logoTraining from "../images/events/education.png";
import logoGrooming from "../images/events/grooming.png";
import logoVaccine from "../images/events/vaccine.png";
import logoOthers from "../images/events/other.png";
import logoVetirinary from "../images/events/veterinary.png";
import logoCat from "../images/animal/cat.png";
import logoDog from "../images/animal/dog.png";

import cover from "../images/cover.jpg";
import MenuAnimal from "../images/menu/animal.svg";
import MenuMap from "../images/menu/map.svg";
import MenuFavorite from "../images/menu/heart.svg";

//
///**
// * Icons
// */

export const ANIMAL_COVER_DEFAULT = cover;
export const getResourceLogo = type => {
  switch (type) {
    case "grooming":
    case "groomer":
      return logoGrooming;
    case "training":
    case "trainer":
      return logoTraining;
    case "petsitter":
    case "petshop":
    case "others":
      return logoOthers;
    case "cat":
      return logoCat;
    case "dog":
      return logoDog;
    case "treatment":
    case "prescription":
      return logoPrescription;
    case "vaccine":
      return logoVaccine;
    case "deworming":
      return logoDeworming;
    case "veterinary":
      return logoVetirinary;
    default:
      return ANIMAL_COVER_DEFAULT;
  }
};

export const getMenuIcon = label => {
  switch (label) {
    case "MAP":
      return MenuMap;
    case "ANIMAL":
      return MenuAnimal;
    case "FAVORITE":
      return MenuFavorite;
    default:
      return null;
  }
};

//
//export const getAvatarSize = () => window.innerHeight > 600 ? 90 : 65;

/**
 * Date formats
 */
export const DATE_FORMAT = "dd/MM/yyyy";
export const DATE_LONG_FORMAT = "d MMMM yyyy";
export const DATETIME_FORMAT = "dd/MM/yyyy HH:mm";
export const DATETIME_LONG_FORMAT = "d MMMM yyyy [at] HH:mm";
export const TIME_FORMAT = "HH:mm";

/**
 * LocalStorage constants
 */
export const LS_ANIMAL_SELECTED = "animal-selected";
export const LS_ANIMAL_TYPES = "animal-types";

/**
 * Routing constants
 */
export const RT_ANIMAL_HOME = "/animal";
export const RT_ANIMAL_LIST = "/animal/list";

export const RT_MONITORING_NEW = "/monitor/new";
export const RT_MONITORING_INFO = "/monitor/:id";

export const RT_MAP_HOME = "/";
export const RT_FAVORITE_HOME = "/favorite";

export const RT_ASSOCIATION_DETAILS = "/association/:id";
export const RT_ANIMAL_DETAILS = RT_ASSOCIATION_DETAILS + "/animal/:animalid";
export const RT_ANIMAL_PICTURES = RT_ANIMAL_DETAILS + "/pictures";

export const FIREBASE_MESSAGING_PUBK =
  process.env.FIREBASE_MESSAGING_PUBK ||
  "BJMq1rt2-Gl4zv9GMYYGeFQVM4gFDJX-SUZeClS78EUFsEILommgD0yZSFVDJzyOIUhdnY1Ms3W9rA-cciBNuUY";
export const FIREBASE_MESSAGING_MSID =
  process.env.FIREBASE_MESSAGING_MSID || "542721328620";
