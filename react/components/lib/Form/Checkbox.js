import React from "react";
import { View, Platform, StyleSheet } from "react-native";
import {
  Checkbox as RNCheckbox,
  TouchableRipple,
  Paragraph,
  Switch,
  HelperText,
  withTheme,
} from "react-native-paper";
import * as StyleMixins from "../stylesheet";
import { getIn } from "formik";

const styles = StyleSheet.create({
  root: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  paragraph: {
    marginLeft: 20,
  },
});

const Checkbox = ({
  field,
  form,
  style,
  theme,
  onChange = () => {},
  ...props
}) => {
  const toggleValue = () => {
    const newValue = !field.value;
    form.setFieldValue(field.name, newValue);
    onChange(newValue);
  };

  const error = getIn(form.errors, field.name),
    touched = getIn(form.touched, field.name);

  return (
    <View style={style}>
      {Platform.OS === "android" ? (
        <TouchableRipple onPress={toggleValue}>
          <View style={[StyleMixins.styles.gridRow, styles.root, style]}>
            <View pointerEvents="none">
              <RNCheckbox
                status={field.value ? "checked" : "unchecked"}
                color={theme.colors.primary}
                uncheckedColor={theme.colors.primary}
                {...props}
              />
            </View>
            <Paragraph
              style={[
                styles.paragraph,
                error && touched && { color: theme.colors.error },
              ]}>
              {props.label}
            </Paragraph>
          </View>
        </TouchableRipple>
      ) : (
        <View style={[StyleMixins.styles.gridRow, styles.root, style]}>
          <Switch value={field.value} onValueChange={toggleValue} />
          <Paragraph style={styles.paragraph}>{props.label}</Paragraph>
        </View>
      )}
      {Boolean(error) && touched && (
        <HelperText type="error" visible={error !== undefined}>
          {error}
        </HelperText>
      )}
    </View>
  );
};

export default withTheme(Checkbox);
