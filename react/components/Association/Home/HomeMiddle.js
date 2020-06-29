import React, { useState, useMemo } from "react";
import { StyleSheet } from "react-native";
import { IconButton, Card, Text, Portal, Caption } from "react-native-paper";
import { StyleMixins } from "../../lib";
import { useTranslation } from "react-i18next";
import { PhoneButton, MailButton } from "../../lib/Map/ContactCard";
import { computeAddress } from "../../../config/utils";

const styles = StyleSheet.create({
  subheading: {
    color: "black",
  },
  titleStyle: {
    fontSize: 14,
    fontWeight: "bold",
    ...StyleMixins.margin(5, 16, -35),
  },
  paper: {
    position: "absolute",
    width: "70%",
    top: "14%",
    ...StyleMixins.margin(0, "15%"),
    ...StyleMixins.padding(5),
    ...StyleMixins.borderRadius(20),
    zIndex: 2,
  },
  icon: {
    height: 20,
    bottom: 5,
  },
});

const HomeMiddle = ({ association }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return useMemo(
    () => (
      <Portal>
        <Card
          elevation={4}
          style={styles.paper}
          onPress={() => setExpanded(!expanded)}>
          <Text style={styles.titleStyle} numberOfLines={2}>
            {association.name}
          </Text>
          <Card.Title
            titleStyle={{ fontSize: 15 }}
            right={() => (
              <IconButton
                style={styles.icon}
                icon="arrow-drop-down"
                onPress={() => setExpanded(!expanded)}
              />
            )}
            style={{ height: "auto", minHeight: 50 }}></Card.Title>

          <>
            <Card.Content style={StyleMixins.padding(0, 16, 16)}>
              <Caption
                style={[styles.subheading, { marginTop: -10 }]}
                numberOfLines={2}>
                {computeAddress(association)}
              </Caption>
              {!expanded && (
                <Caption style={{ textDecorationLine: "underline" }}>
                  {t("tell_me_more")}
                </Caption>
              )}
              {expanded && (
                <>
                  <Caption
                    style={[styles.subheading, { marginBottom: 6 }]}
                    numberOfLines={2}>
                    {t("association.kind_animals") +
                      " : " +
                      (association.supportedAnimal.length
                        ? association.supportedAnimal.join(", ")
                        : t("na"))}
                  </Caption>
                  <Text style={{ fontWeight: "bold" }}>
                    {t("contact.primary")} :
                  </Text>
                  <Text style={{ paddingLeft: 16, marginTop: 7 }}>
                    {(association.contactFirstname &&
                      association.contactLastname &&
                      association.contactFirstname +
                        " " +
                        association.contactLastname) ||
                      t("na")}
                  </Text>
                  {association.contactEmail && (
                    <MailButton
                      contentStyle={{
                        justifyContent: "flex-start",
                        marginTop: 5,
                      }}
                      mode="text"
                      title={association.contactEmail}
                      value={association.contactEmail}
                    />
                  )}
                  {association.contactPhone && (
                    <PhoneButton
                      title={association.contactPhone}
                      mode="text"
                      contentStyle={{ justifyContent: "flex-start" }}
                      value={association.contactPhone}
                    />
                  )}
                </>
              )}
            </Card.Content>
          </>
        </Card>
      </Portal>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [association, expanded]
  );
};

export default HomeMiddle;
