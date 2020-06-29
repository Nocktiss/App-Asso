import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import PropTypes from "prop-types";
import { Dialog, Portal, IconButton, Button } from "react-native-paper";
import * as StyleMixins from "../stylesheet";
import { Formik } from "formik";

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  content: {
    ...StyleMixins.padding(24, "10%"),
  },
});

const FormDialog = ({
  open,
  initialValues = {},
  validationSchema,
  onSubmit,
  cancelLabel = "cancel",
  submitLabel = "submit",
  onClose,
  title,
  children,
}) => (
  <Portal>
    <Dialog visible={open} onDismiss={onClose}>
      {title && <Dialog.Title>{title}</Dialog.Title>}
      <Formik
        onSubmit={(values, extras) => {
          return onSubmit(values, extras);
        }}
        validationSchema={validationSchema}
        initialValues={initialValues}>
        {({ handleSubmit }) => (
          <>
            <Dialog.ScrollArea
              style={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
              <ScrollView contentContainerStyle={styles.content}>
                {children}
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button onPress={onClose}>{cancelLabel}</Button>
              <Button onPress={handleSubmit}>{submitLabel}</Button>
            </Dialog.Actions>
          </>
        )}
      </Formik>
      <IconButton
        icon="close"
        onPress={() => onClose()}
        style={styles.closeButton}
      />
    </Dialog>
  </Portal>
);

FormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  validationSchema: PropTypes.object,
  cancelLabel: PropTypes.string,
  submitLabel: PropTypes.string,
};

export default FormDialog;
