import React, { useState, useEffect, useMemo, useRef } from "react";
import { View, FlatList } from "react-native";
import {
  HelperText,
  Card,
  TextInput,
  Portal,
  Button,
  Divider,
} from "react-native-paper";
import { Chip } from "../Styled";
import Highlight from "../Highlight";
import * as StyleMixins from "../stylesheet";
import { useScrollListener } from "../../../context/ScrollContext";
import { getIn } from "formik";

/**
 * !!todo algo de recherche dichotomique
 */
const Autosuggest = ({
  field,
  form,
  style,
  choices,
  getOptionLabel = choice => choice.text,
  getOptionValue = choice => choice.id,
  isMulti = false,
  idField,
  onChange,
  disabled,
  ...props
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selected, setSelected] = useState(
    field.value ? field.value : isMulti ? [] : null
  );
  const [inputText, setInputText] = useState("");
  const inputContainer = useRef();
  const [inputLayout, setInputLayout] = useState(null);

  useEffect(() => {
    form.setFieldValue(field.name, selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const measuredRef = () => {
    inputContainer &&
      inputContainer.current &&
      inputContainer.current.measureInWindow((x, y, width, height) => {
        setInputLayout({
          x,
          y,
          width,
          height,
        });
      });
  };

  useScrollListener("autosuggest" + field.name, scroll => {
    measuredRef();
  });

  return useMemo(() => {
    const selectItem = item => {
      setSelected(isMulti ? [...selected, item] : item);
      setInputText("");
      setShowMenu(false);
    };

    const unselectItem = item => {
      setSelected(
        isMulti
          ? selected.filter(
              select => getOptionValue(select) !== getOptionValue(item)
            )
          : null
      );
      setInputText("");
      setShowMenu(false);
    };

    const isSelected = choice =>
      (isMulti &&
        selected.find(
          item => getOptionValue(item) === getOptionValue(choice)
        ) !== undefined) ||
      (!isMulti && getOptionValue(selected) === getOptionValue(choice));

    const isMatching = choice =>
      inputText === "" ||
      getOptionLabel(choice)
        .toLowerCase()
        .indexOf(inputText.toLowerCase()) !== -1;

    const error = getIn(form.errors, field.name),
      touched = getIn(form.touched, field.name);

    return (
      <View style={style}>
        <View
          ref={ref => {
            inputContainer.current = ref;
            measuredRef();
          }}
          onLayout={measuredRef}
          collapsable={false}
          style={{ marginBottom: 10 }}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={value => {
              setInputText(value);
              value.length && setShowMenu(true);
              !value.length && setShowMenu(false);
            }}
            onBlur={() => {
              //setInputText("");
              //setShowMenu(false);
            }}
            style={[
              { backgroundColor: "transparent" },
              disabled && { opacity: 0.3 },
            ]}
            {...props}
            disabled={props.disabled || (!isMulti && selected !== null)}
          />
          {showMenu && (
            <Portal>
              <Card
                elevation={4}
                style={[
                  inputLayout && {
                    width: inputLayout.width,
                    top: inputLayout.y + inputLayout.height + 5,
                    left: inputLayout.x,
                  },
                  { maxHeight: 200, position: "absolute" },
                ]}>
                <Card.Content style={{ padding: 0 }}>
                  <View collapsable={false}>
                    <FlatList
                      style={{ height: "100%" }}
                      data={choices.filter(
                        choice => !isSelected(choice) && isMatching(choice)
                      )}
                      initialNumToRender={
                        choices.length > 5 ? 5 : choices.length
                      }
                      renderItem={data => {
                        const choice = data.item;
                        return (
                          <Button
                            key={"choice-" + data.index}
                            onPress={() => selectItem(choice)}>
                            <Highlight
                              search={inputText}
                              text={getOptionLabel(choice)}
                            />
                          </Button>
                        );
                      }}
                      ItemSeparatorComponent={Divider}
                      keyExtractor={item => getOptionValue(item)}
                    />
                  </View>
                </Card.Content>
              </Card>
            </Portal>
          )}
        </View>
        {selected && (
          <View
            style={[
              StyleMixins.styles.gridRow,
              StyleMixins.styles.gridSpaceEvenly,
              { flexWrap: "wrap" },
            ]}>
            {!isMulti && selected !== null && (
              <Chip selected={true} onClose={() => unselectItem(selected)}>
                {getOptionLabel(selected)}
              </Chip>
            )}
            {isMulti &&
              selected.length > 0 &&
              selected.map(select => (
                <Chip
                  key={getOptionValue(select)}
                  selected={true}
                  onClose={() => unselectItem(select)}>
                  {getOptionLabel(select)}
                </Chip>
              ))}
          </View>
        )}
        <HelperText type="error" visible={error !== undefined}>
          {error}
        </HelperText>
      </View>
    );
  }, [
    form.errors,
    form.touched,
    field.name,
    style,
    disabled,
    props,
    isMulti,
    selected,
    showMenu,
    inputLayout,
    choices,
    getOptionLabel,
    getOptionValue,
    inputText,
  ]);
};

export default Autosuggest;
