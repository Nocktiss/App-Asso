import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import PropTypes from "prop-types";
import { ScrollProvider } from "../../context/ScrollContext";
import { IconButton } from "react-native-paper";
import KeyboardAvoidView from "./KeyboardAvoidView";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingBottom: 46,
  },
  pageNoAppBar: {
    //minHeight: "100%",
    //maxHeight: "100%"
    paddingBottom: 0,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: "20%",
    maxHeight: "20%",
    zIndex: 1,
  },
  body: {
    flex: 1,
  },
});

const Page = ({
  topBar,
  header,
  body,
  noAppBar,
  onClose,
  scrollable = true,
  bodyStyle,
}) => {
  const [scroll, setScroll] = useState();
  const Wrapper = scrollable ? ScrollView : View;
  const RootWrapper = ({ children }) =>
    scrollable ? (
      <>{children}</>
    ) : (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
      </TouchableWithoutFeedback>
    );
  return (
    <>
      <View style={[styles.root, (onClose || noAppBar) && styles.pageNoAppBar]}>
        {!onClose && topBar}
        {header && <View style={styles.header}>{header}</View>}
        <Wrapper
          style={[styles.body, bodyStyle]}
          scrollEnabled={scrollable}
          keyboardDismissMode={"interactive"}
          onMomentumScrollEnd={event =>
            setScroll(event.nativeEvent.contentOffset)
          }
          onPress={!scrollable ? () => Keyboard.dismiss() : undefined}
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={[{ flexGrow: 1 }, bodyStyle]}>
          <KeyboardAvoidView style={{ flex: 1 }}>
            <ScrollProvider scroll={scroll}>
              {body}
              <View style={{ height: 10 }} />
            </ScrollProvider>
          </KeyboardAvoidView>
        </Wrapper>
        {onClose && (
          <IconButton
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1,
              borderRadius: 25,
              backgroundColor: "white",
            }}
            icon="close"
            onPress={onClose}
          />
        )}
      </View>
    </>
  );
};

Page.propTypes = {
  topBar: PropTypes.element,
  header: PropTypes.element,
  body: PropTypes.element.isRequired,
  noAppBar: PropTypes.bool,
  scrollable: PropTypes.bool,
};

export default Page;
