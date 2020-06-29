import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Animated,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import PropTypes from "prop-types";
import { borderRadius, padding } from "./stylesheet";
import { Subheading, Portal, Card } from "react-native-paper";
import KeyboardAvoidView from "./KeyboardAvoidView";

const styles = StyleSheet.create({
  bottomUpDrawer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    ...padding(20),
    backgroundColor: "white",
    flex: 1,
    ...borderRadius(80, 80, 0, 0),
    //borderWidth: 1,
    marginBottom: -10,
    marginTop: 50,
  },
  title: {
    textAlign: "center",
  },
});

const BottomUpDrawer = ({
  children,
  initialHeight,
  maxHeight,
  style,
  title,
}) => {
  const [open, setOpen] = useState(false);
  const [drawerHeight] = useState(new Animated.Value(0));

  const onPress = () => {
    if (!open) {
      Animated.timing(drawerHeight, {
        toValue: 100,
        duration: 1000,
        //useNativeDriver: true,
      }).start(() => setOpen(true));
    } else {
      Animated.timing(drawerHeight, {
        toValue: 0,
        duration: 1000,
        //useNativeDriver: true,
      }).start(() => setOpen(false));
    }
  };

  const renderBase = () => {
    return (
      <Card
        collapsable={false}
        elevation={24}
        style={[
          styles.bottomUpDrawer,
          style,
          {
            minHeight: initialHeight,
            maxHeight: maxHeight,
            height: drawerHeight.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}>
        <TouchableWithoutFeedback onPressIn={onPress}>
          <Subheading style={[styles.title]}>{title}</Subheading>
        </TouchableWithoutFeedback>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}>
          <KeyboardAvoidView>
            {typeof children === "function" ? children({ onPress }) : children}
          </KeyboardAvoidView>
        </ScrollView>
      </Card>
    );
  };

  return (
    <>
      {open && (
        <Portal>
          <>
            <TouchableWithoutFeedback onPressIn={onPress}>
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  { height: "300%", top: "-100%" },
                ]}
              />
            </TouchableWithoutFeedback>
            {renderBase()}
          </>
        </Portal>
      )}
      {!open && renderBase()}
    </>
  );
};

BottomUpDrawer.propTypes = {
  initialHeight: PropTypes.number.isRequired,
};

export default BottomUpDrawer;
