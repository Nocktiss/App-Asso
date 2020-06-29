import React, { useEffect, useState, useMemo } from "react";
import { View, Keyboard } from "react-native";

const KeyboardAvoidView = ({ style, children, ...props }) => {
  const [bottom, setBottom] = useState(0);

  useEffect(() => {
    const openlistener = Keyboard.addListener("keyboardWillShow", event => {
      setBottom(event.endCoordinates.height);
    });
    const closelistener = Keyboard.addListener("keyboardWillHide", event => {
      setBottom(0);
    });
    return () => {
      Keyboard.removeListener("keyboardWillShow", openlistener);
      Keyboard.removeListener("keyboardWillHide", closelistener);
    };
  }, []);

  return useMemo(
    () => (
      <View
        style={[style, { paddingBottom: bottom }]}
        {...props}
        collapsable={false}>
        {children}
      </View>
    ),
    [bottom, children, props, style]
  );
};

export default KeyboardAvoidView;
