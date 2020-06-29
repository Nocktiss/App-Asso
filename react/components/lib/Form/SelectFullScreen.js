import React, { useState, useEffect } from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
} from "react-native";
import {
  Divider,
  List,
  TextInput,
  Text,
  HelperText,
  withTheme,
  Portal,
  IconButton,
} from "react-native-paper";
import { getIn } from "formik";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as StyleMixins from "../stylesheet";
import Fuse from "fuse.js";
import * as Styled from "../Styled";
import Highlight from "../Highlight";

const styles = StyleSheet.create({
  portal: {
    position: "absolute",
    backgroundColor: "white",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 0,
    overflow: "hidden",
  },
  topBar: {
    //position: "absolute",
    //top: 0,
    //left: 0,
    padding: 10,
    width: "100%",
  },
  menu: {
    flex: 1,
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

const SelectFullScreen = ({
  disabled,
  style,
  isMulti,
  labelExtractor,
  label,
  field,
  form,
  data,
  searchKeys,
  dataSource,
  placeholder,
  onChange,
  onChangeItem,
  valueExtractor,
  emptyLabel = "",
  theme,
}) => {
  const [modalHeight] = useState(new Animated.Value(0));
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");

  const onPress = () => {
    Animated.timing(modalHeight, {
      toValue: 100,
      duration: 700,
      //useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    getFiltered(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, data]);

  const onClose = () => {
    Animated.timing(modalHeight, {
      toValue: 0,
      duration: 700,
      //useNativeDriver: true,
    }).start(() => setQuery(""));
  };

  const getFiltered = vquery => {
    if (dataSource) {
      dataSource(vquery).then(returnedData => setResults(returnedData));
    } else {
      if (vquery === "") {
        setResults(data);
      } else {
        const fuse = new Fuse(data, {
          keys: searchKeys,
          shouldSort: true,
          threshold: 0.6,
          location: 0,
          distance: 100,
        });
        setResults(fuse.search(vquery));
      }
    }
  };

  const onSelect = index => {
    let value = results[index];
    value = isMulti ? [...field.value, value] : value;
    !isMulti && onClose();
    form.setFieldValue(field.name, value);
    onChange && onChange(value);
    onChangeItem && onChangeItem(results[index]);
  };

  const onUnselect = index => {
    let value = valueExtractor(results[index]);
    value = isMulti
      ? field.value.filter(subValue => valueExtractor(subValue) !== value)
      : null;
    !isMulti && onClose();
    form.setFieldValue(field.name, value);
    onChange && onChange(value);
    onChangeItem && onChangeItem(results[index]);
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
    const selected = isMulti
      ? field.value.find(
          subValue => valueExtractor(subValue) === valueExtractor(item)
        ) !== undefined
      : valueExtractor(item) === valueExtractor(field.value);
    let title = label == null ? value : label;

    return (
      <Option
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
        title={<Highlight search={query.trim()} text={title} />}
        onPress={selected ? onUnselect : onSelect}
      />
    );
  };

  const error = getIn(form.errors, field.name),
    touched = getIn(form.touched, field.name);

  return (
    <View style={style} collapsable={false}>
      <TouchableOpacity
        disabled={disabled}
        onPress={!disabled ? onPress : null}>
        <View pointerEvents="none">{renderBase()}</View>
        <List.Icon
          icon={"arrow-drop-down"}
          style={[styles.menuIcon, disabled && { opacity: 0.3 }]}
        />
      </TouchableOpacity>
      <Portal>
        <Animated.View
          style={[
            styles.portal,
            {
              height: modalHeight.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
          collapsable={false}>
          <View
            style={[
              StyleMixins.styles.gridRow,
              styles.topBar,
              { backgroundColor: theme.colors.primary },
            ]}>
            <IconButton
              onPress={onClose}
              color={theme.colors.white}
              icon="keyboard-arrow-left"
            />
            <Styled.Searchbar
              style={[{ flex: 1 }]}
              onChangeText={query => {
                setQuery(query);
              }}
            />
          </View>
          <FlatList
            style={styles.menu}
            ItemSeparatorComponent={() => <Divider style={styles.divider} />}
            data={results}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={() => (
              <Option title={emptyLabel} onPress={onClose} />
            )}
          />
        </Animated.View>
      </Portal>

      <HelperText type="error" visible={error !== undefined}>
        {error}
      </HelperText>
    </View>
  );
};

const Option = ({ selected, title, icon, index, onPress }) => (
  <TouchableOpacity
    style={{
      backgroundColor: selected ? "lightgray" : "white",
      padding: 16,
    }}
    onPress={() => onPress(index)}>
    <View style={StyleMixins.styles.gridRow}>
      {icon && <Icon name={icon} size={styles.optionText.fontSize} />}
      <Text style={styles.optionText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

export default withTheme(SelectFullScreen);
