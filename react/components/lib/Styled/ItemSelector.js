import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import { Surface, List, IconButton } from "react-native-paper";
import { StyleMixins } from "..";

const styles = StyleSheet.create({
  root: {
    borderRadius: 20,
    elevation: 4,
    flex: 1,
  },
});

function ItemSelector({ choices, value, onSelect }) {
  const [open, setOpen] = useState(false);
  value = value || choices[0];

  if (typeof value === "string") {
    value = choices.find(choice => value === choice.id);
  }

  choices = choices.filter(choice => choice.id !== value.id);
  return (
    <Surface style={styles.root}>
      <List.Item
        button={choices.length > 1 && open}
        onPress={
          choices.length > 1 &&
          (() => {
            if (open) onSelect(value);
            setOpen(!open);
          })
        }
        title={value.text}
        right={
          choices.length > 1 &&
          (({ color }) => (
            <IconButton
              color={color}
              icon={open ? "arrow-drop-up" : "arrow-drop-down"}
              onPress={() => setOpen(!open)}
              size={24}
            />
          ))
        }
      />
      {open && (
        <>
          {choices.map(choice => (
            <List.Item
              key={choice.id}
              onPress={() => {
                setOpen(false);
                onSelect(choice);
              }}
              title={choice.text}
            />
          ))}
        </>
      )}
    </Surface>
  );
}

ItemSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
  value: PropTypes.shape({
    id: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
  }),
  choices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      text: PropTypes.string.isRequired,
    })
  ),
};

export default ItemSelector;
