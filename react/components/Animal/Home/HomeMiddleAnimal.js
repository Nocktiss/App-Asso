import React, { useState, useMemo } from "react";
import { StyleSheet, Text, Image, View } from "react-native";
import { Card, Caption, Portal } from "react-native-paper";
import { StyleMixins } from "../../lib";
import { useTranslation } from "react-i18next";
import { ucfirst, dateFormat, age, ageFormat } from "../../../config/utils";
import { DATE_LONG_FORMAT, getResourceLogo } from "../../../config/_constants";
import IconCommunity from "react-native-vector-icons/MaterialCommunityIcons";

// import { Grayscale } from "react-native-color-matrix-image-filters";

const styles = StyleSheet.create({
  paper: {
    position: "absolute",
    width: "70%",
    top: "14%",
    ...StyleMixins.margin(0, "15%"),
    ...StyleMixins.padding(5),
    ...StyleMixins.borderRadius(20),
  },
  image: {
    height: 30,
    width: 30,
  },
});

const HomeMiddleAnimal = ({ animal }) => {
  const { t } = useTranslation("translations");
  const [expanded, setExpanded] = useState(false);

  const genderLogo = useMemo(
    () => <IconCommunity size={24} name={`gender-${animal.gender}`} />,
    [animal.gender]
  );

  const animalAge = ageFormat(age(animal.birthday));

  return useMemo(
    () => (
      <Portal>
        <Card
          elevation={4}
          style={styles.paper}
          onPress={() => setExpanded(!expanded)}>
          <Card.Title
            title={
              <>
                {ucfirst(animal.name) + " "}
                {genderLogo}
                <>
                  <Image
                    resizeMethod={"scale"}
                    resizeMode={"contain"}
                    style={styles.image}
                    source={getResourceLogo(animal.type.name)}
                  />
                </>
              </>
            }
            subtitle={
              animal.birthday && (
                <Text>
                  <Text> {t("animal.is_born") + " : "}</Text>
                  <Caption>
                    {dateFormat(animal.birthday, DATE_LONG_FORMAT) + " "}
                  </Caption>
                  <Caption>({animalAge})</Caption>
                </Text>
              )
            }
            style={{ height: "auto", minHeight: 60 }}
            titleStyle={{
              fontSize: 25,
              fontWeight: "bold",
              alignItems: "center",
            }}
          />
        </Card>
      </Portal>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [animal, expanded]
  );
};

export default HomeMiddleAnimal;
