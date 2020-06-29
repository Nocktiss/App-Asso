import React from "react";
import { View } from "react-native";
import { HelperText, Portal } from "react-native-paper";
import MapView from "../Map";
import { getIn } from "formik";
import { useAssociations } from "../../../hooks";

const Map = ({
  field,
  form,
  style,
  keyExtractor = value => value.id,
  buttonProps = {
    label: "submit",
    icon: "send",
  },
  customFooter,
}) => {
  const { actions } = useAssociations();

  const error = getIn(form.errors, field.name),
    touched = getIn(form.touched, field.name);

  const isSelected = contact => {
    return field.value.filter(
      value => keyExtractor(value) === keyExtractor(contact)
    ).length;
  };

  return (
    <View style={style}>
      <Portal>
        <MapView
          onQueryChanged={(
            query,
            { center: { latitude: lat, longitude: lng } }
          ) => {
            actions.search({
              full_text: query,
              distance: {
                lat,
                lng,
              },
            });
          }}
          onViewportChanged={({
            center: { latitude: lat, longitude: lng },
          }) => {
            actions.search({
              distance: {
                lat,
                lng,
              },
            });
          }}
          customActions={[
            {
              text: contact =>
                isSelected(contact)
                  ? buttonProps.label.selected
                  : buttonProps.label.unselected,
              icon: contact =>
                isSelected(contact)
                  ? buttonProps.icon.selected
                  : buttonProps.icon.unselected,
              callback: contact => {
                isSelected(contact)
                  ? form.setFieldValue(field.name, [])
                  : form.setFieldValue(field.name, [contact]);
              },
              closeOnClick: true,
              mode: "contained",
            },
          ]}
          customFooter={customFooter}
        />
      </Portal>
      {Boolean(error) && touched && (
        <HelperText
          style={{ position: "absolute", bottom: 20 }}
          type="error"
          visible={error !== undefined}>
          {error}
        </HelperText>
      )}
    </View>
  );
};

export default Map;
