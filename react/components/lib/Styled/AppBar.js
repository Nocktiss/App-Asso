import React from "react";
import { StyleSheet, View } from "react-native";
import {
  withTheme,
  Appbar as MAppbar,
  IconButton,
  Text,
} from "react-native-paper";
import { getMenuIcon, RT_MAP_HOME } from "../../../config/_constants";
import { StyleMixins } from "..";
import { ucfirst } from "../../../config/utils";
import { useTranslation } from "react-i18next";

const AppBar = ({ theme, routes, location, onPress }) => {
  const { t } = useTranslation();
  const module = "/" + (location.pathname.split("/")[1] || "map");

  return (
    <MAppbar style={styles.menu} dark={true}>
      {routes.map(item => {
        const isSelected =
          (module === "/map" && item.route === RT_MAP_HOME) ||
          module === item.route;
        return (
          <View
            key={item.label}
            style={[StyleMixins.styles.gridCenter, styles.titleIcon]}>
            <IconButton
              icon={({ color, size }) => {
                const Icon = getMenuIcon(item.icon);

                return (
                  <Icon
                    width={size}
                    height={size}
                    fill={"#111111"}
                    color={
                      isSelected ? theme.colors.primary : theme.colors.white
                    }
                    style={{
                      marginTop: "50%",
                    }}
                  />
                );
              }}
              onPress={() => onPress(item.route)}
            />
            <Text
              style={{
                color: isSelected ? theme.colors.primary : theme.colors.black,
                fontSize: 10,
              }}>
              {ucfirst(t(item.label))}
            </Text>
          </View>
        );
      })}
    </MAppbar>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-around",
    backgroundColor: "white",
    display: "none",
  },
  titleIcon: {
    ...StyleMixins.padding(0, 0, 12, 0),
  },
});

export default withTheme(AppBar);
