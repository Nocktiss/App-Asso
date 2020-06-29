import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { HelperText, TextInput, withTheme } from "react-native-paper";
import {
  Autocomplete,
  withKeyboardAwareScrollView,
} from "react-native-dropdown-autocomplete";
import { getIn } from "formik";

const styles = StyleSheet.create({
  autocompletesContainer: {
    paddingTop: 0,
    zIndex: 1,
    width: "100%",
    paddingHorizontal: 8,
  },
  input: { maxHeight: 40 },
  inputContainer: {
    display: "flex",
    flexShrink: 0,
    flexGrow: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-start",
    borderBottomWidth: 0,
    borderColor: "transparent",
    paddingVertical: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
});

const Autosuggest2 = ({
  field,
  form,
  style,
  choices,
  getOptionLabel = choice => choice.text,
  getOptionId = choice => choice.id,
  isMulti = false,
  idField,
  onChange,
  scrollToInput,
  onDropdownClose,
  onDropdownShow,
  theme,
  ...props
}) => {
  const [selected, setSelected] = useState(
    field.value ? field.value : isMulti ? [] : null
  );

  const isSelected = useCallback(
    choice => {
      if (
        isMulti &&
        selected.find(item => getOptionId(item) === getOptionId(choice)) !==
          null
      )
        return true;
      if (!isMulti && getOptionId(selected) === getOptionId(choice))
        return true;
      return false;
    },
    [getOptionId, isMulti, selected]
  );

  const error = getIn(form.errors, field.name),
    touched = getIn(form.touched, field.name);

  return (
    <View style={style}>
      <TextInput
        {...props}
        render={props => (
          <Autocomplete
            label={props.label}
            data={choices.filter(item => isSelected(item))}
            resetOnSelect
            valueExtractor={item => getOptionLabel(item)}
            handleSelectItem={item => setSelected([...selected, item])}
            highlightText
            minimumCharactersCount={0}
            highLightColor={theme.colors.primary}
            scrollToInput={ev => scrollToInput(ev)}
            onDropdownClose={() => onDropdownClose()}
            onDropdownShow={() => onDropdownShow()}
            inputStyle={styles.input}
            inputContainerStyle={styles.inputContainer}
            {...props}
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
};

export default withTheme(withKeyboardAwareScrollView(Autosuggest2));
