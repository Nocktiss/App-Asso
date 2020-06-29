import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Chip, withTheme } from "react-native-paper";

const StyledChip = ({ theme, style, textStyle, ...props }) => {
  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          borderColor: theme.colors.primary,
          borderWidth: 1,
          backgroundColor: props.selected
            ? theme.colors.primary
            : theme.colors.white,
        },
        text: {
          color: props.selected ? theme.colors.white : theme.colors.primary,
        },
      }),
    [props.selected, theme.colors.primary, theme.colors.white]
  );

  return useMemo(
    () => (
      <Chip
        selectedColor={theme.colors.white}
        textStyle={[styles.text, textStyle]}
        style={[styles.root, style]}
        {...props}
      />
    ),
    [props, style, styles.root, styles.text, textStyle, theme.colors.white]
  );
};

export default withTheme(StyledChip);
