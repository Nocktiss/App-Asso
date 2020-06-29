import React, { useCallback } from "react";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import { Title } from "react-native-paper";
import { Page, StyleMixins } from "../../lib";
import { useAssociations } from "../../../hooks";
import { RT_MAP_HOME, ANIMAL_COVER_DEFAULT } from "../../../config/_constants";
import { useTranslation } from "react-i18next";
import HomeMiddle from "../Home/HomeMiddle";
import AnimalMonitoringGrid from "../../AnimalMonitoring/Grid";

const styles = StyleSheet.create({
  section: {
    ...StyleMixins.padding(0, "8.5%"),
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
});

const DetailsAssociations = ({
  history,
  match: {
    params: { id },
  },
}) => {
  const { t } = useTranslation();
  const { selectors } = useAssociations();
  const { 0: association, distance } = selectors.getAssociationById(
    parseInt(id, 10)
  );

  const goTo = useCallback(
    (route, isModal = false) => history.push(route, { isModal }),
    [history]
  );

  const renderImage = () => (
    <ImageBackground
      defaultSource={ANIMAL_COVER_DEFAULT}
      resizeMethod={"scale"}
      resizeMode={"cover"}
      source={ANIMAL_COVER_DEFAULT}
      style={{ width: "100%", height: "100%" }}>
      <HomeMiddle association={association} />
    </ImageBackground>
  );

  return (
    <Page
      onClose={() => history.push(RT_MAP_HOME)}
      scrollable={true}
      header={renderImage()}
      body={
        <>
          <View style={{ height: 40 }} />
          <View style={styles.section}>
            <View
              style={[
                StyleMixins.styles.gridRow,
                styles.sectionTitle,
                { alignItems: "center" },
              ]}
            />
          </View>
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>
              {t("animal.list_animals_adopt")}
            </Title>
            <AnimalMonitoringGrid association={association} goTo={goTo} />
          </View>
        </>
      }
    />
  );
};

export default DetailsAssociations;
