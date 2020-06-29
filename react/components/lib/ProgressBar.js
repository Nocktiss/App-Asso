import React, { useMemo } from "react";
import { View } from "react-native";
import {
  ProgressBar as RNProgressBar,
  withTheme,
  Caption,
} from "react-native-paper";
import Tooltip from "rn-tooltip";
import { Icon } from "react-native-vector-icons/MaterialIcons";
import PropTypes from "prop-types";
import * as StyleMixins from "./stylesheet";

const styledBy = (property, mapping) => {
  switch (typeof mapping) {
    case "string":
      return mapping.replace("__unit__", property);
    case "object":
      return mapping[property + 0];
    default:
      break;
  }
};

const generateStyle = (props, theme) => ({
  root: {
    paddingTop: styledBy(props.withLabel, [5, 15]),
    display: "flex",
    flex: 1,
    position: "relative",
    height: styledBy(props.withLabel, [5, 31]),
  },
  progress: {
    flex: 1,
    ...StyleMixins.borderRadius(3),
  },
  slider: {
    position: "absolute",
    left: styledBy(props.progress * 100, "__unit__%"),
    marginLeft: -12,
    color: theme.colors.primary,
    transform: {
      translateX: "15%",
    },
  },
  label: {
    position: "absolute",
    left: styledBy(props.progress * 100, "__unit__%"),
    width: 30,
    marginLeft: -15,
    transform: {
      translateY: "50%",
    },
    textAlign: "center",
  },
  paper: {
    ...StyleMixins.padding("5%"),
  },
});

const ProgressBar = ({ withLabel, details, theme, ...other }) => {
  const styles = useMemo(
    () => generateStyle({ progress: other.progress, withLabel }, theme),
    [other.progress, withLabel, theme]
  );

  const _renderProgressBar = () => (
    <View>
      <RNProgressBar
        style={styles.progress}
        color={theme.colors.primary}
        {...other}
      />
      {withLabel && <Icon icon="arrow-drop-up" style={styles.slider} />}
      {withLabel && <Caption style={styles.label}>{other.value}%</Caption>}
    </View>
  );

  const _renderWithDetails = () => (
    <Tooltip overlayColor={theme.colors.white} popover={details}>
      {_renderProgressBar()}
    </Tooltip>
  );

  return details ? _renderWithDetails() : _renderProgressBar();
};

ProgressBar.propTypes = {
  withLabel: PropTypes.bool,
};

export default withTheme(ProgressBar);
