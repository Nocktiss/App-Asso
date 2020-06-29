import React from "react";
import { Linking, ScrollView, StyleSheet, View, Text } from "react-native";
import { Card, Caption } from "react-native-paper";
import { Button } from "../Styled";
import { computeAddress, getMapsUri } from "../../../config/utils";
import { useTranslation } from "react-i18next";
import { StyleMixins } from "..";

const styles = StyleSheet.create({
  actionsContainer: {
    marginTop: 10,
  },
  actionMarginLeft: {
    marginLeft: 5,
  },
  titleStyle: {
    fontSize: 18,
    ...StyleMixins.margin(5, "4%", 5),
  },
});

const ContactCard = ({ contact, customActions, style, onClose }) => {
  style = Array.isArray(style) ? style : [style];
  return (
    <Card style={[{ flex: 1 }, ...style]}>
      <Text style={styles.titleStyle} numberOfLines={2}>
        {contact.name}
      </Text>
      <Card.Content style={{ justifyContent: "space-between", flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Caption>{computeAddress(contact)}</Caption>
          {Boolean(contact.phoneNumber) && (
            <Caption>{contact.phoneNumber}</Caption>
          )}
        </View>
        <View>
          <ScrollView
            horizontal={true}
            style={styles.actionsContainer}
            showsHorizontalScrollIndicator={false}>
            {!customActions && (
              <>
                <DirectionButton contact={contact} />
                {Boolean(contact.phoneNumber) && (
                  <PhoneButton value={contact.phoneNumber} />
                )}
              </>
            )}
            {customActions &&
              customActions.map((action, index) => {
                switch (action.type) {
                  case "phone":
                    return <PhoneButton contact={contact} />;
                  case "direction":
                    return <DirectionButton contact={contact} />;
                  default:
                    return (
                      (action.test ? action.test(contact) : true) && (
                        <Button
                          key={
                            typeof action.text === "function"
                              ? action.text(contact)
                              : action.text
                          }
                          icon={
                            typeof action.text === "function"
                              ? action.icon(contact)
                              : action.icon
                          }
                          style={index > 0 && styles.actionMarginLeft}
                          mode={action.mode}
                          uppercase={false}
                          onPress={() => {
                            action.callback(contact);
                            action.closeOnClick && onClose();
                          }}>
                          {typeof action.text === "function"
                            ? action.text(contact)
                            : action.text}
                        </Button>
                      )
                    );
                }
              })}
          </ScrollView>
        </View>
      </Card.Content>
    </Card>
  );
};

export const DirectionButton = ({ contact }) => {
  const { t } = useTranslation();

  return (
    <Button
      icon="directions"
      mode="contained"
      uppercase={false}
      onPress={() => Linking.openURL(getMapsUri(contact))}>
      {t("contact.directions")}
    </Button>
  );
};

export const PhoneButton = ({ value, title, ...other }) => {
  const { t } = useTranslation();

  return (
    <Button
      icon="call"
      style={styles.actionMarginLeft}
      mode="outlined"
      uppercase={false}
      onPress={() => Linking.openURL(`tel:${value.phoneNumber}`)}
      {...other}>
      {title || t("contact.call")}
    </Button>
  );
};

export const MailButton = ({ value, title, ...other }) => {
  const { t } = useTranslation();

  return (
    <Button
      icon="mail"
      style={styles.actionMarginLeft}
      mode="outlined"
      uppercase={false}
      onPress={() => Linking.openURL(`mailto:${value.phoneNumber}`)}
      {...other}>
      {title || t("contact.mail")}
    </Button>
  );
};

export default ContactCard;
