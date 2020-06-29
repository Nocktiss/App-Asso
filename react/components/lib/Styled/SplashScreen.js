import React, { useMemo } from "react";
import { Dimensions } from "react-native";
import * as StyleMixins from "../stylesheet";
import { withTheme, Text, ActivityIndicator } from "react-native-paper";
import Logo from "../../../images/logo_white.svg";
import LinearGradient from "react-native-linear-gradient";

const { width: screenW } = Dimensions.get("window");

const SplashScreen = ({ theme }) => {
  return useMemo(
    () => (
      <LinearGradient
        style={[StyleMixins.styles.fullSize, StyleMixins.styles.gridCenter]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={theme.gradients.primary}>
        <Logo
          fill="white"
          height={screenW / 2}
          width={screenW / 2}
          style={{ color: theme.colors.primary }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginTop: -35,
            marginBottom: 40,
            color: theme.colors.white,
          }}></Text>
        <ActivityIndicator animating={true} color={theme.colors.white} />

        <Text style={{ marginTop: 10, color: theme.colors.white }}>
          Chargement...
        </Text>
      </LinearGradient>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
};

export default withTheme(SplashScreen);
