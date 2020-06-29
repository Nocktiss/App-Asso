import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { HelperText, withTheme, Text } from "react-native-paper";
import * as StyleMixins from "../stylesheet";
import { Chip } from "../Styled";
import { getIn } from "formik";

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    paddingHorizontal: 12,
    color: "rgba(0,0,0,0.54)",
  },
});

const ButtonSelector = ({
  field,
  form,
  style,
  choices,
  onChange = () => {},
  theme,
  customButton,
  valueExtractor = item => item.id,
  labelExtractor = item => item.text,
  keyExtractor = item => item.id,
  ...props
}) => {
  const error = getIn(form.errors, field.name),
    touched = getIn(form.touched, field.name);

  return (
    <View style={style}>
      {Boolean(props.label) && <Text style={styles.label}>{props.label}</Text>}
      <View
        style={[
          Boolean(props.label) && { marginTop: 5 },
          StyleMixins.styles.fullSize,
          StyleMixins.styles.gridRow,
          StyleMixins.styles.gridSpaceEvenly,
        ]}>
        {choices.map(choice => {
          const selected =
            valueExtractor(choice) ===
            (typeof field.value === "string"
              ? field.value
              : valueExtractor(field.value));

          const selectedColor = theme.colors.primary,
            Item =
              customButton ||
              (() => <Chip selected={selected}>{labelExtractor(choice)}</Chip>);

          return (
            <TouchableOpacity
              key={keyExtractor(choice)}
              onPress={() => {
                form.setFieldValue(field.name, valueExtractor(choice));
                onChange(choice);
              }}>
              <View style={{ flex: 1, height: "100%" }} pointerEvents="none">
                <Item
                  isSelected={selected}
                  selectedColor={selectedColor}
                  choice={choice}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      {Boolean(error) && touched && (
        <HelperText type="error" visible={error !== undefined}>
          {error}
        </HelperText>
      )}
    </View>
  );
};

export default withTheme(ButtonSelector);
