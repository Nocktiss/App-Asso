import React from "react";
import { View } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { getIn } from "formik";

const TextField = ({
  field,
  form,
  style,
  autoLowerCase = false,
  multiline = false,
  ...props
}) => {
  const inputStyle = { backgroundColor: "transparent" };
  if (multiline) {
    props.multiline = true;
    props.numberOfLines = props.numberOfLines || 3;
    props.textAlignVertical = props.textAlignVertical || "top";
    props.scrollEnabled = props.scrollEnabled || true;
  }
  const error = getIn(form.errors, field.name),
    touched = getIn(form.touched, field.name);

  return (
    <View style={style}>
      <TextInput
        label={props.label}
        value={field.value}
        error={error && touched}
        onBlur={() => form.handleBlur(field.name)}
        onChangeText={value =>
          form.setFieldValue(
            field.name,
            autoLowerCase ? value.toLowerCase() : value
          )
        }
        style={inputStyle}
        {...props}
      />
      {Boolean(error) && touched && (
        <HelperText type="error" visible={error !== undefined}>
          {error}
        </HelperText>
      )}
    </View>
  );
};

export default TextField;
