import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const styles = StyleSheet.create({
  root: {
    fontSize: 14,
    paddingHorizontal: 12,
    color: "rgba(0,0,0,0.54)",
    marginBottom: 5,
  },
});

export default ({ style, children }) => {
  return <Text style={[styles.root, style]}>{children}</Text>;
};
