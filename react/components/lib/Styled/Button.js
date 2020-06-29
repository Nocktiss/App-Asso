import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { borderRadius } from "../stylesheet";

const styles = StyleSheet.create({
  root: {
    ...borderRadius(19),
  },
});

const StyledButton = ({ style, ...props }) => {
  return useMemo(() => <Button style={[styles.root, style]} {...props} />, [
    props,
    style,
  ]);
};

export default StyledButton;
