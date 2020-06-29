import React from "react";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { Link } from "react-router-native";
import {
  Dialog as MDialog,
  Portal,
  IconButton,
  Button,
} from "react-native-paper";
import * as StyleMixins from "../stylesheet";

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  content: {
    ...StyleMixins.padding(24, "10%", 0),
  },
  noActions: {
    paddingBottom: 10,
  },
});

const Dialog = ({ open, onClose, title, actions, children }) => (
  <Portal>
    <MDialog visible={open} onDismiss={onClose}>
      {title && <MDialog.Title>{title}</MDialog.Title>}
      <MDialog.Content style={[styles.content, !actions && styles.noActions]}>
        {children}
      </MDialog.Content>
      {actions && (
        <MDialog.Actions>
          {actions.map((action, index) => {
            const props = {
              key: index,
            };
            if (action.disabled) {
              props.disabled = action.disabled;
            }
            if (action.component) {
              return (
                <React.Fragment key={index}>{action.component}</React.Fragment>
              );
            } else if (action.callback) {
              props.onPress = () => action.callback();
            } else if (action.link) {
              props.component = Link;
              props.to = action.link;
            } else if (action.href) {
              props.component = "a";
              props.href = action.href;
            }
            return <Button {...props}>{action.text}</Button>;
          })}
        </MDialog.Actions>
      )}
      <IconButton
        icon="close"
        onPress={() => onClose()}
        style={styles.closeButton}
      />
    </MDialog>
  </Portal>
);

Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      callback: PropTypes.func,
      link: PropTypes.string,
      text: PropTypes.string,
      component: PropTypes.any,
    })
  ),
};

export default Dialog;
