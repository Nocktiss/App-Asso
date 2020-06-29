import React from "react";
import { StyleSheet } from "react-native";
import { Button, withTheme, IconButton, Text } from "react-native-paper";
import PropTypes from "prop-types";
import { padding, borderRadius, boxShadow } from "./stylesheet";
import LinearGradient from "react-native-linear-gradient";

const styledBy = (property, mapping) =>
  mapping[property] !== undefined ? mapping[property] : mapping.default;

const generateButtonStyle = props => ({
  ...styledBy(props.dir, {
    topLeft: borderRadius(0, 27, 27, 27),
    topRight: borderRadius(27, 0, 27, 27),
    top: borderRadius(0, 0, 27, 27),
    bottomLeft: borderRadius(27, 27, 27, 0),
    bottomRight: borderRadius(27, 27, 0, 27),
    all: borderRadius(0),
    none: borderRadius(27),
  }),
  marginTop: props.button && !props.disabled ? 0 : 20,
  ...styledBy(props.rounded, {
    true: padding(0, 0),
    default: props.button && padding(8, 12),
  }),
  ...styledBy(props.rounded, {
    true: {
      height: props.size ? props.size * 2 : 48,
      width: props.size ? props.size * 2 : 48,
      ...borderRadius(props.size || 24),
    },
  }),
  minWidth: styledBy(props.rounded, {
    true: 0,
  }),
  ...styledBy(props.variant, {
    outlined: boxShadow(5, 5, 15, "rgba(0,0,0,0.1)"),
  }),
  justifyContent: "center",
  alignItems: "center",
});
const generateTextStyle = props => ({
  color: styledBy(props.variant, {
    contained: props.theme.colors.white,
    default: props.theme.colors.primary,
  }),
});

const ArrowButton = ({
  dir,
  style = {},
  children,
  variant = "contained",
  onClick,
  noGradient = false,
  color = "primary",
  ...other
}) => {
  const withGradient = _children => {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={other.theme.gradients[color]}
        style={StyleSheet.flatten([
          generateButtonStyle({
            dir,
            rounded: variant === "icon",
            variant,
            theme: other.theme,
            size: other.size,
          }),
          style,
        ])}>
        {_children}
      </LinearGradient>
    );
  };

  const _renderButton = () => {
    return variant === "icon" ? (
      <IconButton
        color={other.theme.colors.white}
        onPress={other.onPress || onClick}
        {...other}
      />
    ) : (
      <Button
        mode={variant}
        color={"transparent"}
        onPress={other.onPress || onClick}
        {...other}
        style={StyleSheet.flatten([
          generateButtonStyle({
            dir,
            rounded: variant === "icon",
            variant,
            theme: other.theme,
            button: true,
            size: other.size,
          }),
          { ...boxShadow(0, 0, 0, 0) },
          style,
        ])}>
        <Text style={generateTextStyle({ variant, theme: other.theme })}>
          {children}
        </Text>
      </Button>
    );
  };

  return (variant === "contained" || variant === "icon") &&
    !noGradient &&
    !other.disabled
    ? withGradient(_renderButton())
    : _renderButton();
};

ArrowButton.propTypes = {
  dir: PropTypes.oneOf([
    "topLeft",
    "topRight",
    "top",
    "bottomLeft",
    "bottomRight",
    "bottom",
    "all",
    "none",
  ]),
};

export default withTheme(ArrowButton);
