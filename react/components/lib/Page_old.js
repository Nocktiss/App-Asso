import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import PropTypes from "prop-types";
import { ScrollProvider } from "../../context/ScrollContext";
import { IconButton } from "react-native-paper";

const dimensions = Dimensions.get("window");

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
    minHeight: dimensions.height * 0.2,
    maxHeight: dimensions.height * 0.2,
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
  return (
    <View style={[styles.root, (onClose || noAppBar) && styles.pageNoAppBar]}>
      {!onClose && topBar}
      {header && <View style={styles.header}>{header}</View>}
      <Wrapper
        style={[styles.body, bodyStyle]}
        scrollEnabled={scrollable}
        onMomentumScrollEnd={event =>
          setScroll(event.nativeEvent.contentOffset)
        }
        contentContainerStyle={[{ flexGrow: 1 }, bodyStyle]}>
        <ScrollProvider scroll={scroll}>
          <>
            {body}
            <View style={{ height: 10 }} />
          </>
        </ScrollProvider>
      </Wrapper>
      {onClose && (
        <IconButton
          style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
          icon="close"
          onPress={onClose}
        />
      )}
    </View>
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
