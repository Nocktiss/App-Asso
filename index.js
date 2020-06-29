/**
 * @format
 */
import { AppRegistry } from "react-native";
import App from "./App";
if (__DEV__) {
  import("./reactotronConfig");
}

import { name as appName } from "./app.json";
import "./i18n";

AppRegistry.registerComponent(appName, () => App);
