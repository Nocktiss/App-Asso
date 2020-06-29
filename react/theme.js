import { DefaultTheme } from "react-native-paper";

const primaryColor = "#1F8B8F",
  secondaryColor = "#073F4C",
  orangeColor = "#ED8832",
  greyColor = "#808080",
  blackColor = "#111111",
  whiteColor = "#fff";

export default {
  ...DefaultTheme,
  fonts: {
    regular: "CircularStd-Black",
    medium: "CircularStd-Medium",
    light: "CircularStd-Book",
    thin: "CircularStd-Book",
    bold: "CircularStd-Bold",
  },
  colors: {
    ...DefaultTheme.colors,
    // Official palette
    primary: primaryColor,
    accent: secondaryColor,
    disabled: greyColor,
    background: whiteColor,
    text: blackColor,
    notification: primaryColor,
    // Custom
    orange: orangeColor,
    black: blackColor,
    grey: greyColor,
    white: whiteColor,
  },
  gradients: {
    primary: [primaryColor, "#49afb3"],
    secondary: [secondaryColor, "#49afb3"],
    orange: [orangeColor, "#F6A864"],
  },
};
