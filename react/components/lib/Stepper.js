import React, { useState, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Platform,
  I18nManager,
} from "react-native";
import { withTheme } from "react-native-paper";

const isAndroidRTL = I18nManager.isRTL && Platform.OS === "android";

const Stepper = ({
  onSlideChange,
  slides,
  hidePagination,
  activeDotStyle,
  dotStyle,
  buttonStyle,
  buttonTextStyle,
  renderItem,
  data,
  bottomButton,
  onDone,
  onSkip,
  paginationStyle,
  style,
  theme,
  ...otherProps
}) => {
  const [dimension, setDimensions] = useState({ width: 0, height: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const flatList = useRef();

  const goToSlide = pageNum => {
    setActiveIndex(pageNum);
    flatList.current.scrollToOffset({
      offset: _rtlSafeIndex(pageNum) * dimension.width,
    });
  };

  const _onNextPress = () => {
    goToSlide(activeIndex + 1);
    onSlideChange && onSlideChange(activeIndex + 1, activeIndex);
  };
  const _onPrevPress = () => {
    goToSlide(activeIndex - 1);
    onSlideChange && onSlideChange(activeIndex - 1, activeIndex);
  };

  const _onPaginationPress = index => {
    const activeIndexBeforeChange = activeIndex;
    goToSlide(index);
    onSlideChange && onSlideChange(index, activeIndexBeforeChange);
  };

  const _renderItem = flatListArgs => {
    const { width, height } = dimension;
    const props = { ...flatListArgs /*, dimensions: { width, height }*/ };
    return (
      <ScrollView
        style={{ flex: 1, width, height }}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        {renderItem(props)}
      </ScrollView>
    );
  };

  const _renderButton = (name, onPress) => {
    const show = otherProps[`show${name}Button`];
    const content = otherProps[`render${name}Button`]
      ? otherProps[`render${name}Button`]()
      : _renderDefaultButton(name);
    return show && _renderOuterButton(content, name, onPress);
  };

  const _renderDefaultButton = name => {
    let content = (
      <Text style={[styles.buttonText, buttonTextStyle]}>
        {otherProps[`${name.toLowerCase()}Label`]}
      </Text>
    );
    if (bottomButton) {
      content = (
        <View
          style={[
            styles.bottomButton,
            (name === "Skip" || name === "Prev") && {
              backgroundColor: "transparent",
            },
            buttonStyle,
          ]}>
          {content}
        </View>
      );
    }
    return content;
  };

  const _renderOuterButton = (content, name, onPress) => {
    const outerstyle =
      name === "Skip" || name === "Prev"
        ? styles.leftButtonContainer
        : styles.rightButtonContainer;
    return (
      <View style={!bottomButton && outerstyle}>
        <TouchableOpacity
          onPress={onPress}
          style={!bottomButton && buttonStyle}>
          {content}
        </TouchableOpacity>
      </View>
    );
  };

  const _renderNextButton = () => _renderButton("Next", _onNextPress);

  const _renderPrevButton = () => _renderButton("Prev", _onPrevPress);

  const _renderDoneButton = () => _renderButton("Done", onDone && onDone);

  const _renderSkipButton = () =>
    // scrollToEnd does not work in RTL so use goToSlide instead
    _renderButton("Skip", () =>
      onSkip ? onSkip() : goToSlide(slides.length - 1)
    );

  const _renderPagination = () => {
    const isLastSlide = activeIndex === slides.length - 1;
    const isFirstSlide = activeIndex === 0;

    const skipBtn =
      (!isFirstSlide && _renderPrevButton()) ||
      (!isLastSlide && _renderSkipButton());
    const btn = isLastSlide ? _renderDoneButton() : _renderNextButton();

    return (
      <View style={[styles.paginationContainer, paginationStyle]}>
        <View style={styles.paginationDots}>
          {slides.length > 1 &&
            slides.map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dot,
                  _rtlSafeIndex(i) === activeIndex
                    ? activeDotStyle || {
                        backgroundColor: theme.colors.primary,
                      }
                    : dotStyle,
                ]}
                onPress={() => _onPaginationPress(i)}
              />
            ))}
        </View>
        {btn}
        {skipBtn}
      </View>
    );
  };

  const _rtlSafeIndex = i => (isAndroidRTL ? slides.length - 1 - i : i);

  const _onMomentumScrollEnd = e => {
    const offset = e.nativeEvent.contentOffset.x;
    // Touching very very quickly and continuous brings about
    // a variation close to - but not quite - the width.
    // That's why we round the number.
    // Also, Android phones and their weird numbers
    const newIndex = _rtlSafeIndex(Math.round(offset / dimension.width));
    if (newIndex === activeIndex) {
      // No page change, don't do anything
      return;
    }
    const lastIndex = activeIndex;
    setActiveIndex(newIndex);
    onSlideChange && onSlideChange(newIndex, lastIndex);
  };

  const _onLayout = ({
    nativeEvent: {
      layout: { width, height },
    },
  }) => {
    setDimensions({ width, height });
    // Set new scroll position
    const func = () => {
      flatList.current.scrollToOffset({
        offset: _rtlSafeIndex(activeIndex) * width,
        animated: false,
      });
    };
    Platform.OS === "android" ? setTimeout(func, 0) : func();
  };

  return (
    <View style={[styles.flexOne, style]}>
      <FlatList
        ref={flatList}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        style={styles.flatList}
        renderItem={_renderItem}
        onMomentumScrollEnd={_onMomentumScrollEnd}
        onLayout={_onLayout}
        {...otherProps}
      />
      {!hidePagination && _renderPagination()}
    </View>
  );
};

Stepper.defaultProps = {
  dotStyle: {
    backgroundColor: "rgba(0, 0, 0, .2)",
  },
  skipLabel: "Skip",
  doneLabel: "Done",
  nextLabel: "Next",
  prevLabel: "Back",
  buttonStyle: null,
  buttonTextStyle: null,
  paginationStyle: null,
  showDoneButton: true,
  showNextButton: true,
};

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  flatList: {
    flex: 1,
    flexDirection: isAndroidRTL ? "row-reverse" : "row",
    width: "100%",
  },
  paginationContainer: {
    marginHorizontal: 16,
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: isAndroidRTL ? "row-reverse" : "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  leftButtonContainer: {
    position: "absolute",
    left: 0,
  },
  rightButtonContainer: {
    position: "absolute",
    right: 0,
  },
  bottomButton: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, .3)",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    backgroundColor: "transparent",
    fontSize: 18,
    padding: 12,
  },
});

export default withTheme(Stepper);
