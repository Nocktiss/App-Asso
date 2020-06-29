import React, { useState, useMemo } from "react";
import { View, Dimensions, ScrollView } from "react-native";
import { TextInput, HelperText, Menu, Text, Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { getIn } from "formik";

const Select = ({
  field,
  form,
  style,
  choices,
  getOptionLabel = choice => choice.text,
  getOptionValue = choice => choice.id,
  isMulti = false,
  onChange,
  menuStyle = {},
  ...props
}) => {
  const { t } = useTranslation();
  const inputStyle = { backgroundColor: "transparent" };
  const [menu, setMenu] = useState(false);
  const [menuLayout, setMenuLayout] = useState(false);

  return useMemo(() => {
    const isSelected = choice =>
      (isMulti &&
        field.value.find(
          item => getOptionValue(item) === getOptionValue(choice)
        ) !== undefined) ||
      (!isMulti && getOptionValue(field.value) === getOptionValue(choice));

    const selectItem = item => {
      form.setFieldValue(field.name, isMulti ? [...field.value, item] : item);
      if (!isMulti) setMenu(false);
    };

    const unselectItem = item => {
      form.setFieldValue(
        field.name,
        isMulti
          ? field.value.filter(
              select => getOptionValue(select) !== getOptionValue(item)
            )
          : null
      );
      if (!isMulti) setMenu(false);
    };

    const handleLayout = ({ nativeEvent: { layout } }) => setMenuLayout(layout);

    const error = getIn(form.errors, field.name),
      touched = getIn(form.touched, field.name);

    return (
      <View style={style}>
        <TextInput
          label={props.label}
          value={field.value}
          error={touched && error}
          onBlur={() => form.handleBlur(field.name)}
          onChangeText={undefined}
          editable={false}
          style={inputStyle}
          focused={true}
          {...props}
          render={_ => (
            <Menu
              style={{ marginTop: 40 }}
              visible={menu}
              onDismiss={() => setMenu(false)}
              anchor={
                <Button
                  onPress={() => setMenu(true)}
                  onLayout={handleLayout}
                  disabled={props.disabled}>
                  {field.value && (
                    <Text>
                      {isMulti
                        ? field.value
                            .map(value => getOptionLabel(value))
                            .join(", ")
                        : getOptionLabel(field.value)}
                    </Text>
                  )}
                </Button>
              }>
              <ScrollView
                style={[
                  menuLayout,
                  { height: 250, flexShrink: 1, maxHeight: 250 },
                  menuStyle,
                ]}
                contentContainerStyle={[{ flexGrow: 1 }]}>
                {choices.map(choice => {
                  const selected = isSelected(choice);

                  return (
                    <Menu.Item
                      key={getOptionValue(choice)}
                      icon={selected ? "check-box" : "check-box-outline-blank"}
                      onPress={() =>
                        selected ? unselectItem(choice) : selectItem(choice)
                      }
                      title={getOptionLabel(choice)}
                    />
                  );
                })}
                {!choices.length && (
                  <Menu.Item
                    onPress={() => setMenu(false)}
                    title={t("no.results")}
                  />
                )}
              </ScrollView>
            </Menu>
          )}
        />
        {Boolean(error) && touched && (
          <HelperText type="error" visible={Boolean(error)}>
            {error}
          </HelperText>
        )}
      </View>
    );
  }, [
    choices,
    field.name,
    field.value,
    form,
    getOptionLabel,
    getOptionValue,
    inputStyle,
    isMulti,
    menu,
    menuLayout,
    menuStyle,
    props,
    style,
    t,
  ]);
};

export default Select;
