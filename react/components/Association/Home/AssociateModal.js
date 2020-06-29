import React, { useState, useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Styled } from "../../lib";
import { useTranslation } from "react-i18next";
import { List, IconButton, Text } from "react-native-paper";
import { useAssociations, useAnimals } from "../../../hooks";

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});

export default ({ onClose, association }) => {
  const { t } = useTranslation();
  const [values, setValues] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { selectors: associationSelectors, actions } = useAssociations();
  const { selectors: animalSelectors } = useAnimals();
  const onSubmit = () => {
    setSubmitting(true);
    actions
      .linkAssociation(association, values)
      .then(() => {
        onClose();
      })
      .finally(() => setSubmitting(false));
  };

  const myLinkedAnimals = useMemo(() => {
    if (association) {
      return Object.keys(associationSelectors.getAllMyAssociations()).filter(
        animalId => {
          return (
            associationSelectors
              .getAssociations({ "@id": animalId })
              .data.filter(
                myAssociation =>
                  myAssociation.association["@id"] === association["@id"]
              ).length > 0
          );
        }
      );
    } else return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [association]);

  const animals = animalSelectors.getAnimals();
  return (
    <Styled.Dialog
      open={Boolean(association)}
      title={t("association.details")}
      onClose={onClose}
      actions={[
        {
          disabled: submitting,
          callback: () => onSubmit(),
          text: t("association.list_animals"),
        },
      ]}>
      <Text>{t("association.info")}</Text>
      <ScrollView style={{ maxHeight: 200 }}>
        {animals.map(choice => {
          const isSelected =
            values.find(value => choice.id === value.id) !== undefined;
          const disabled =
            myLinkedAnimals.find(animalId => choice["@id"] === animalId) !==
            undefined;
          return (
            <List.Item
              key={choice["@id"]}
              disabled={disabled}
              onPress={() =>
                setValues(
                  isSelected
                    ? values.filter(value => choice.id !== value.id)
                    : [...values, choice]
                )
              }
              left={props => (
                <IconButton
                  icon={
                    isSelected || disabled
                      ? "check-box"
                      : "check-box-outline-blank"
                  }
                />
              )}
              title={choice.name}
              style={disabled && styles.disabled}
            />
          );
        })}
      </ScrollView>
    </Styled.Dialog>
  );
};
