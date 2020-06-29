import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-community/async-storage";

Reactotron.clear();

Reactotron.configure() // controls connection & communication settings
  .setAsyncStorageHandler(AsyncStorage)
  .configure()
  .useReactNative({
    asyncStorage: true, // there are more options to the async storage.
    networking: {
      // optionally, you can turn it off with false.
      ignoreUrls: /symbolicate/,
    },
    editor: false, // there are more options to editor
    overlay: false, // just turning off overlay
  })
  .connect(); // let's connect!

Reactotron.onCustomCommand("AsyncStorage display", () =>
  AsyncStorage.getAllKeys().then(keys =>
    Reactotron.log("async-storage - keys", keys)
  )
);
Reactotron.onCustomCommand({
  command: "AsyncStorage remove",
  handler: ({ key }) =>
    AsyncStorage.removeItem(key)
      .then(_ => Reactotron.log("async-storage - key '" + key + "' removed"))
      .catch(error =>
        Reactotron.error(
          "async-storage - removing key '" + key + "' failed",
          error
        )
      ),
  args: [
    {
      name: "key",
      type: "string",
    },
  ],
});
Reactotron.onCustomCommand({
  command: "AsyncStorage get",
  handler: ({ key }) =>
    AsyncStorage.getItem(key)
      .then(value =>
        Reactotron.log("async-storage - key '" + key + "' - " + value)
      )
      .catch(error =>
        Reactotron.error(
          "async-storage - getting key '" + key + "' failed",
          error
        )
      ),
  args: [
    {
      name: "key",
      type: "string",
    },
  ],
});
Reactotron.onCustomCommand({
  command: "AsyncStorage clear",
  handler: () =>
    AsyncStorage.clear()
      .then(() => Reactotron.log("async-storage - cleared"))
      .catch(error => Reactotron.error("async-storage - clear failed", error)),
});

//const logger = console.log;
//console.log = (...args) => {
//  Reactotron.log(...args);
//  logger(...args);
//};
//
