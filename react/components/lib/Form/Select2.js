import React, { useState, useEffect } from "react";
import { FlatList, TouchableOpacity, View, StyleSheet } from "react-native";
import {
  Divider,
  List,
  Menu,
  TextInput,
  Text,
  HelperText,
  withTheme,
} from "react-native-paper";
import { getIn } from "formik";
import Icon from "react-native-vector-icons/MaterialIcons";
import { StyleMixins } from "..";

const styles = StyleSheet.create({
  menu: {
    maxHeight: 300,
  },
  option: {},
  optionText: { marginLeft: 16, fontSize: 17 },
  divider: { marginLeft: 16 },
  menuIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    marginVertical: 16,
    marginLeft: 0,
  },
});

const Select = ({
  disabled,
  style,
  isMulti,
  labelExtractor,
  label,
  field,
  form,
  data,
  placeholder,
  onChange,
  onChangeItem,
  valueExtractor,
  emptyLabel = "",
  theme,
}) => {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(350);

  const onPress = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (field.value) {
      onChange && onChange(valueExtractor(field.value));
      onChangeItem && onChangeItem(field.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelect = index => {
    let value = valueExtractor(data[index], index);
    value = isMulti ? [...field.value, value] : value;
    !isMulti && onClose();
    form.setFieldValue(field.name, value);
    onChange && onChange(value);
    onChangeItem && onChangeItem(data[index]);
  };

  const onUnselect = index => {
    let value = valueExtractor(data[index], index);
    value = isMulti ? field.value.filter(subValue => subValue !== value) : null;
    !isMulti && onClose();
    form.setFieldValue(field.name, value);
    onChange && onChange(value);
    onChangeItem && onChangeItem(data[index]);
  };

  const keyExtractor = (item, index) =>
    `${index}-${valueExtractor(item, index)}`;

  const renderBase = props => {
    let { value } = field;
    const error = getIn(form.errors, field.name),
      touched = getIn(form.touched, field.name);

    let title;

    if (title == null) {
      title =
        value &&
        (isMulti
          ? value.map(subVal => labelExtractor(subVal)).join(", ")
          : labelExtractor(value));
    }

    title = title == null || typeof title === "string" ? title : String(title);
    const inputStyle = { backgroundColor: "transparent", marginVertical: 8 };

    if (disabled) {
      inputStyle.opacity = 0.3;
    }

    if (!data.length) title = placeholder || emptyLabel;

    return (
      <TextInput
        pointerEvents="none"
        error={error}
        mode="flat"
        label={label}
        style={inputStyle}
        onChangeText={undefined}
        editable={false}
        value={title}
      />
    );
  };

  const renderItem = ({ item, index }) => {
    let value = valueExtractor(item);
    let label = labelExtractor(item);
    const selected =
      field.value &&
      (isMulti
        ? field.value.find(
            subValue => valueExtractor(subValue) === valueExtractor(item)
          ) !== undefined
        : valueExtractor(item) === valueExtractor(field.value));
    let title = label == null ? value : label;

    return (
      <Option
        width={width}
        index={index}
        icon={
          !isMulti
            ? undefined
            : selected
            ? "check-box"
            : "check-box-outline-blank"
        }
        selected={selected === index}
        {...item}
        title={title}
        onPress={selected ? onUnselect : onSelect}
      />
    );
  };

  const error = getIn(form.errors, field.name),
    touched = getIn(form.touched, field.name);

  return (
    <View
      style={style}
      collapsable={false}
      onLayout={({
        nativeEvent: {
          layout: { width: layoutWidth },
        },
      }) => setWidth(layoutWidth)}>
      <Menu
        visible={open}
        onDismiss={onClose}
        style={{ marginTop: 65 }}
        anchor={
          <TouchableOpacity
            disabled={disabled}
            onPress={!disabled ? onPress : null}>
            <View pointerEvents="none">{renderBase()}</View>
            <List.Icon
              icon={"arrow-drop-down"}
              style={[styles.menuIcon, disabled && { opacity: 0.3 }]}
            />
          </TouchableOpacity>
        }>
        <FlatList
          style={styles.menu}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={() => (
            <Option width={width} title={emptyLabel} onPress={onClose} />
          )}
        />
      </Menu>
      {Boolean(error) && touched && (
        <HelperText type="error" visible={error !== undefined}>
          {error}
        </HelperText>
      )}
    </View>
  );
};

Select.defaultProps = {
  data: [],

  disabled: false,

  valueExtractor: ({ value } = {}, index) => value,
  labelExtractor: ({ label } = {}, index) => label,
};

const Option = ({ selected, title, icon, index, onPress, width }) => (
  <TouchableOpacity
    style={{
      backgroundColor: selected ? "lightgray" : "white",
      padding: 16,
      width: width,
    }}
    onPress={() => onPress(index)}>
    <View style={StyleMixins.styles.gridRow}>
      {icon && <Icon name={icon} size={styles.optionText.fontSize} />}
      <Text style={styles.optionText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

export default withTheme(Select);
