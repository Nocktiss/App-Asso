import i18n from "../../i18n";
import { Platform } from "react-native";
import {
  format,
  addDays,
  addMonths,
  addYears,
  setSeconds,
  setMinutes,
  setHours,
  setYear,
  setMonth,
  setDate,
  setMilliseconds,
  parseISO as dfParseISO,
  isDate,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
} from "date-fns";
import { en, fr } from "date-fns/locale";

const locales = {
  en,
  fr,
};

export const parseISO = date => (isDate(date) ? date : dfParseISO(date));

// Date functions
export const dateFormat = (date, formatStr) =>
  format(parseISO(date), formatStr, {
    locale: locales[i18n.language || "fr"],
  });

export const dateSetTime = (date, hours = 0, minutes = 0, seconds = 0) => {
  return setMilliseconds(
    setSeconds(setMinutes(setHours(parseISO(date), hours), minutes), seconds),
    0
  );
};

export const dateSetDate = (date, day = 0, month = 0, year = 0) => {
  return setDate(setMonth(setYear(parseISO(date), year), month), day);
};

export const dateAdd = (date, amount, period) => {
  switch (period) {
    case "years":
      return addYears(parseISO(date), amount);
    case "months":
      return addMonths(parseISO(date), amount);
    case "days":
      return addDays(parseISO(date), amount);
  }
};

export const age = date => {
  const result = { years: 0, months: 0, days: 0 };
  const now = new Date();
  let age = parseISO(date);
  const years = differenceInYears(now, age);
  if (years > 0) {
    result.years = years;
    age = addYears(age, years);
  }
  const months = differenceInMonths(now, age);
  if (months > 0) {
    result.months = months;
    age = addMonths(age, months);
  }
  const days = differenceInDays(now, age);
  if (days > 0) {
    result.days = days;
  }
  return result;
};

export const ageFormat = age => {
  const result = [];
  if (age.years) {
    result.push(i18n.t("animal.age.years{{nb}}", { nb: age.years }));
  }
  return result.join(" ");
};

// String functions
export const ucfirst = str => {
  if (typeof str !== "string") throw new TypeError("str not a string");

  if (!str.length) return this;

  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Array functions
export const array_unique = (array, idField) => {
  const result = [];
  const map = new Map();
  for (const item of array) {
    const value = idField ? item[idField] : item;
    if (!map.has(value)) {
      map.set(value, true); // set any value to Map
      result.push(item);
    }
  }
  return result;
};

export const intersectArray = (
  arr1 = [],
  arr2 = [],
  func = (item, item2) => item === item2
) => {
  const result = [];
  arr1.forEach((item, index) => {
    if (arr2.find(item2 => func(item, item2))) {
      result[index] = item;
    }
  });

  return result;
};

export const mergeArray = (arr1 = [], arr2 = [], func) => {
  const result = [];
  arr1.forEach((item, index) => {
    let data;
    if ((data = arr2.find(item2 => func(item, item2))) !== undefined) {
      result[index] = data;
    } else {
      result[index] = item;
    }
  });

  return result;
};

//Object functions
const object_path_access = (object, path, throwError = true) => {
  object = object || {};
  if (!path) return object;
  const pathArray = path.split(".");

  for (let i = 0; i < pathArray.length; i++) {
    const prevObject = object;
    object = object[pathArray[i]];
    if (object === undefined) {
      if (throwError)
        throw new Error(
          pathArray.slice(0, i + 1).join(".") +
            " does not exist, expected : " +
            JSON.stringify(Object.keys(prevObject))
        );
      else return false;
    }
  }

  return object;
};

export const PropertyAccessor = {
  has: (obj, key) =>
    obj instanceof Map ? obj.has(key) : object_path_access(obj, key, false),
  get: (obj, key) =>
    obj instanceof Map ? obj.get(key) : object_path_access(obj, key),
  set: (obj, key, value) =>
    obj instanceof Map ? obj.set(key, value) : (obj[key] = value),
  delete: (obj, key) =>
    obj instanceof Map ? obj.delete(key) : delete obj[key],
};

export const toObject = aMap => {
  if (!(aMap instanceof Map)) return aMap;
  const obj = {};
  aMap.forEach((v, k) => {
    obj[k] = v;
  });
  return obj;
};

export const object_filter = (obj, callback) => {
  let result = {},
    p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      if (callback(obj[p], p)) {
        result[p] = obj[p];
      }
    }
  }
  return result;
};

export const toQueryString = (obj, prefix) => {
  const str = [];
  const keys = obj instanceof Map ? obj.keys() : Object.keys(obj);

  for (const p of keys) {
    var k = prefix ? prefix + "[" + p + "]" : p,
      v = obj instanceof Map ? obj.get(p) : obj[p];
    str.push(
      v !== null && typeof v === "object"
        ? toQueryString(v, k)
        : encodeURIComponent(k) + "=" + encodeURIComponent(v)
    );
  }
  return str.join("&");
};

// Color functions
export function hexAToRGBA(h) {
  let r = 0,
    g = 0,
    b = 0,
    a = 1;

  if (h.length === 5) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];
    a = "0x" + h[4] + h[4];
  } else if (h.length === 9) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
    a = "0x" + h[7] + h[8];
  }
  a = +(a / 255).toFixed(3);

  return { red: r, green: g, blue: b, alpha: a };
}

export function hexToRGB(h) {
  let r = 0,
    g = 0,
    b = 0;

  if (h.length === 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];
  } else if (h.length === 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }

  return {
    red: parseInt(r, 16),
    green: parseInt(g, 16),
    blue: parseInt(b, 16),
  };
}

// Mixed functions
export const nullify = string =>
  string !== null && string !== "" ? string : "na";

// Contact functions
export const computeAddress = (contact, joinElement = ", ") => {
  let address = {
    street: contact.address || "",
    other: (contact.zipCode || "") + " " + (contact.city || ""),
  };

  return Object.values(address)
    .map(string => (string.trim() !== "" ? string.trim() : null))
    .filter(item => item !== null)
    .join(joinElement);
};

export const getMapsUri = contact => {
  if (contact.longitude) {
    const query = `${contact.latitude},${contact.longitude}(${contact.name})`;
    return Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
    });
  }
  const computedAddress = computeAddress(contact);
  return `https://maps.google.com/?q=${computedAddress}, France`;
};
