import React, { useCallback } from "react";
import { View } from "react-native";
import { HelperText, Text, Button } from "react-native-paper";
import { StyleMixins } from "..";
import { getIn } from "formik";

const ToggleButton = ({
  field,
  form,
  style,
  disabled,
  label,
  multi = false,
  keyExtractor = item => item.id,
  valueExtractor = item => item,
  labelExtractor = item => item.text,
  choices,
}) => {
  const handleSelect = useCallback(
    choice => {
      if (multi) {
        if (Array.includes(field.value, valueExtractor(choice))) {
          form.setFieldValue(
            field.name,
            field.value.filter(item => item !== valueExtractor(choice))
          );
        } else {
          form.setFieldValue(field.name, [
            ...field.value,
            valueExtractor(choice),
          ]);
        }
      } else {
        form.setFieldValue(field.name, valueExtractor(choice));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [field.name, form.setFieldValue, valueExtractor, multi]
  );

  const error = getIn(form.errors, field.name),
    touched = getIn(form.touched, field.name);

  return (
    <View
      style={[
        StyleMixins.styles.gridRow,
        StyleMixins.styles.gridCenter,
        style,
      ]}>
      {choices.map(choice => (
        <Button
          key={keyExtractor(choice)}
          onPress={!disabled && (() => handleSelect(choice))}
          mode={
            valueExtractor(choice).id === field.value.id
              ? "contained"
              : "outlined"
          }
          style={
            valueExtractor(choice).id === field.value.id && {
              textColor: "white",
            }
          }>
          <Text>{labelExtractor(choice)}</Text>
        </Button>
      ))}
      {Boolean(error) && touched && (
        <HelperText type="error" visible={error !== undefined}>
          {error}
        </HelperText>
      )}
    </View>
  );
};

export default ToggleButton;
