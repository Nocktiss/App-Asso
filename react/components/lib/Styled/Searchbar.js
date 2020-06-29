import React from "react";
import { StyleSheet } from "react-native";
import { Searchbar as RPSearchbar } from "react-native-paper";

const styles = StyleSheet.create({
  root: {
    borderRadius: 25,
  },
});

const Searchbar = ({ style, innerRef, ...props }) => (
  <RPSearchbar ref={innerRef} style={[styles.root, style]} {...props} />
);

export default Searchbar;
