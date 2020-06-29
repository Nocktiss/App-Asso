import React, { useState, useEffect } from "react";
import { Animated, View } from "react-native";
import { withTheme } from "react-native-paper";

const Wave = ({ delay = 0, size, color, style }) => {
  const [scale] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(scale, {
        delay,
        toValue: 100,
        duration: 2000,
        useNativeDriver: true,
      }),
      {
        iterations: -1,
      }
    ).start();
  }, [delay, scale]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...style,
        width: size,
        height: size,
        opacity: scale.interpolate({
          inputRange: [0, 100],
          outputRange: [1, 0],
        }),
        borderRadius: Animated.divide(Animated.multiply(size, scale), 2),
        backgroundColor: color,
        transform: [
          {
            scale: scale.interpolate({
              inputRange: [0, 100],
              outputRange: [0.1, 2.5],
            }),
          },
        ], // Bind opacity to animated valu
      }}
    />
  );
};

// You can then use your `FadeInView` in place of a `View` iour components:
const Beacon = ({ size, color, theme }) => {
  color = color || theme.colors.primary;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <View
        style={{
          width: size / 4,
          height: size / 4,
          borderRadius: size / 8,
          backgroundColor: color,
          position: "absolute",
        }}
      />
      <Wave size={size / 4} color={color} style={{ position: "absolute" }} />
      <Wave
        delay={1000}
        size={size / 4}
        color={color}
        style={{ position: "absolute" }}
      />
    </View>
  );
};

export default withTheme(Beacon);
