import React, { useCallback } from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import { StyleMixins } from "..";

const ToggleButton = ({
  value,
  onChange,
  style,
  choices,
  multi = false,
  disabled,
  keyExtractor = item => item.id,
  valueExtractor = item => item,
  labelExtractor = item => item.text,
}) => {
  const handleSelect = useCallback(
    choice => {
      if (multi) {
        if (
          value.map(subVal => subVal.id).includes(valueExtractor(choice).id)
        ) {
          onChange(value.filter(item => item.id !== valueExtractor(choice).id));
        } else {
          onChange([...value, valueExtractor(choice)]);
        }
      } else {
        onChange(valueExtractor(choice));
      }
    },
    [multi, onChange, value, valueExtractor]
  );
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
            (multi &&
              value
                .map(subVal => subVal.id)
                .includes(valueExtractor(choice).id)) ||
            (!multi && value.id === valueExtractor(choice).id)
              ? "contained"
              : "outlined"
          }>
          <Text
            style={
              ((multi &&
                value
                  .map(subVal => subVal.id)
                  .includes(valueExtractor(choice).id)) ||
                (!multi && value.id === valueExtractor(choice).id)) && {
                color: "white",
              }
            }>
            {labelExtractor(choice)}
          </Text>
        </Button>
      ))}
    </View>
  );
};

export default ToggleButton;
