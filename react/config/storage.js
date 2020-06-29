import AsyncStorage from "@react-native-community/async-storage";

const DEBUG = false;

export default {
  getItem: async key => {
    try {
      DEBUG && console.log("Async Storage fetching", key);
      const value = await AsyncStorage.getItem(key);
      const toReturn = value ? JSON.parse(value) : value;
      DEBUG && console.log("Async Storage fetched", key, toReturn);
      return toReturn;
    } catch (e) {
      console.error(`Async Storage error : ${e.message}`);
    }
  },
  removeItem: async key => {
    try {
      DEBUG && console.log("Async Storage removing", key);
      await AsyncStorage.removeItem(key);
      DEBUG && console.log("Async Storage removed", key);
      return true;
    } catch (e) {
      console.error(`Async Storage error : ${e.message}`);
    }
  },
  saveItem: async (key, value) => {
    try {
      DEBUG && console.log("Async Storage saving", key, value);
      const toSaved = JSON.stringify(value);
      await AsyncStorage.setItem(key, toSaved);
      DEBUG && console.log("Async Storage saved", key, toSaved);
      return true;
    } catch (e) {
      console.error(`Async Storage error : ${e.message}`);
    }
  },
  withCache: async function(funcPromise, name) {
    return this.getItem(name).then(value => {
      if (value) {
        return Promise.resolve(value);
      } else {
        return funcPromise().then(data =>
          this.saveItem(name, data).then(() => Promise.resolve(data))
        );
      }
    });
  },
};
