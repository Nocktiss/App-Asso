import React from "react";
import { StyleSheet } from "react-native";
import StyledText from "react-native-paper/src/components/Typography/StyledText";

const styles = StyleSheet.create({
  root: {
    fontSize: 24,
    textAlign: "center",
  },
});

const H4 = ({ children }) => (
  <StyledText alpha={0.5} style={styles.root}>
    {children}
  </StyledText>
);

export default H4;
