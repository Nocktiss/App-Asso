import React, { useMemo } from "react";
import { Dimensions } from "react-native";
import * as StyleMixins from "../../lib/stylesheet";
import { withTheme, Text } from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import Logo from "../../../images/logo_white.svg";

const Home = ({ theme }) => {
  const { width: screenW } = Dimensions.get("window");

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

        <Text style={{ marginBottom: 100, color: theme.colors.white }}>
          Page en construction...
        </Text>
      </LinearGradient>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
};

export default withTheme(Home);
