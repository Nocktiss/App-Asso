import React, { useEffect, useMemo } from "react";
import { Image, View, StyleSheet } from "react-native";
import {
  Card,
  Subheading,
  Caption,
  Text,
  ActivityIndicator,
  TouchableRipple,
  Title,
} from "react-native-paper";
import { StyleMixins } from "../lib";
import { useTranslation } from "react-i18next";
import { ucfirst, dateFormat } from "../../config/utils";
import {
  DATE_LONG_FORMAT,
  getResourceLogo,
  RT_ANIMAL_DETAILS,
} from "../../config/_constants";
import useAnimalMonitoring from "../../hooks/useAnimalMonitoring";
import { path } from "../../config/_entrypoint";
import logo from "../../images/logo2.png";

const styles = StyleSheet.create({
  card: {
    width: "47%",
    marginTop: 16,
    ...StyleMixins.borderRadius(20),
  },
  image: {
    bottom: 16,
    width: 160,
    height: 110,
    ...StyleMixins.borderRadius(20, 20, 0, 0),
  },
  nameanimal: {
    textAlign: "center",
    marginTop: -15,
    top: 5,
  },
  noadopt: {
    fontSize: 20,
    marginTop: 20,
    textAlign: "center",
    justifyContent: "center",
    ...StyleMixins.padding(8, 12),
  },
  marginLeft: {
    marginLeft: "6%",
  },
});

const Grid = ({ association, goTo }) => {
  const { t } = useTranslation();
  const { selectors, actions } = useAnimalMonitoring();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const animals = selectors.getAnimalList(association);

  useEffect(() => {
    actions.getAnimalList(association);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [association]);

  return useMemo(
    () => (
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          flexWrap: "wrap",
        }}>
        {animals.data.map((animal, index) => (
          <Card
            elevation={4}
            key={animal["@id"]}
            style={[styles.card, index % 2 === 1 && styles.marginLeft]}
            onPress={() =>
              goTo(
                RT_ANIMAL_DETAILS.replace(":id", association.id).replace(
                  ":animalid",
                  animal.id
                ),
                true
              )
            }>
            <Card.Content>
              <View style={[StyleMixins.styles.gridCenter]}>
                <Image
                  resizeMethod={"resize"}
                  resizeMode={"cover"}
                  style={[styles.image]}
                  source={
                    (animal.avatar_file && {
                      uri: path(
                        `${animal.avatar_file.uri}.${animal.avatar_file.type}`
                      ),
                      height: animal.avatar_file.height,
                      width: animal.avatar_file.width,
                    }) ||
                    getResourceLogo(animal.type.name)
                  }
                />
                <Subheading style={styles.nameanimal}>
                  {ucfirst(animal.name)}
                </Subheading>
                <Caption>
                  {animal.birthday
                    ? dateFormat(animal.birthday, DATE_LONG_FORMAT)
                    : ""}
                </Caption>
              </View>
            </Card.Content>
          </Card>
        ))}
        {animals.isLast === false && (
          <TouchableRipple
            style={{ width: "100%" }}
            onPress={() => actions.getAnimalList(association, animals.next)}>
            {!animals.searching ? (
              <Text style={{ ...StyleMixins.margin(0, "auto") }}>
                {ucfirst(t("see_more"))}
              </Text>
            ) : (
              <ActivityIndicator animating={true} size="large" />
            )}
          </TouchableRipple>
        )}
        {animals.searching === false && animals.data.length === 0 && (
          <View style={{ alignItems: "center", flex: 1 }}>
            <Title style={styles.noadopt}>
              {t("animal.no_animals_available")}
            </Title>
            <Image style={{ width: "62%", height: "62%" }} source={logo} />
          </View>
        )}
      </View>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [association, animals.data, animals.isLast, animals.searching]
  );
};

export default Grid;
