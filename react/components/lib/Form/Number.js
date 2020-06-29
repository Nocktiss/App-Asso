import React, { useMemo } from "react";
import { View, TextInput as NativeTextInput } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { TextInputMask } from "react-native-masked-text";
import { getIn } from "formik";

const Number = ({
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
            value={field.value.toString()}
            error={error}
            onBlur={() => form.handleBlur(field.name)}
            onChangeText={value => {
              form.setFieldValue(
                field.name,
                value !== "" ? valueExtractor(value) : value
              );
            }}
            style={inputStyle}
            {...props}
            placeholder={!noMask ? "00.000" : ""}
            render={inputProps =>
              !noMask ? (
                <TextInputMask
                  {...inputProps}
                  type={"money"}
                  options={{
                    precision: 3,
                    separator: ".",
                    delimiter: "",
                    unit: "",
                    suffixUnit: "",
                  }}
                />
              ) : (
                <NativeTextInput keyboardType={"number-pad"} {...inputProps} />
              )
            }
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

export default Number;
