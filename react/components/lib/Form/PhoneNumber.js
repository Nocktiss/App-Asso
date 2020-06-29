import React, { useMemo } from "react";
import { View } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { TextInputMask } from "react-native-masked-text";
import { getIn } from "formik";

const PhoneNumber = ({
  field,
  form,
  style,
  variant,
  valueExtractor = value => value,
  noMask = false,
  ...props
}) => {
  const inputStyle = { backgroundColor: "transparent" };

  return useMemo(
    () => {
      const error = getIn(form.errors, field.name),
        touched = getIn(form.touched, field.name);

      return (
        <View style={style}>
          <TextInput
            label={props.label}
            value={
              typeof field.value === "number"
                ? "0" + field.value.toString()
                : field.value
            }
            error={error}
            onBlur={() => form.handleBlur(field.name)}
            onChangeText={value =>
              form.setFieldValue(
                field.name,
                value !== "" ? valueExtractor(value) : value
              )
            }
            style={inputStyle}
            {...props}
            placeholder={"0000000000"}
            render={inputProps => (
              <TextInputMask
                {...inputProps}
                type={"custom"}
                options={{
                  mask: "99999999",
                }}
              />
            )}
          />
          {Boolean(error) && touched && (
            <HelperText type="error" visible={error !== undefined}>
              {error}
            </HelperText>
          )}
        </View>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [field.name, field.value, inputStyle, props, style, variant]
  );
};

export default PhoneNumber;
