import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Portal, IconButton } from "react-native-paper";
import { StyleMixins } from "../../lib";
import RNCarousel, { Pagination } from "react-native-snap-carousel";

const { width: WIDTH_WINDOW } = Dimensions.get("window");

const Carousel = ({
  open,
  renderItem,
  onClose,
  entries,
  activeSlide,
  ...props
}) => {
  const [step, setStep] = useState();
  const _renderItem = innerprops => {
    return (
      <>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={[StyleSheet.absoluteFillObject]} />
        </TouchableWithoutFeedback>
        {renderItem(innerprops)}
      </>
    );
  };

  useEffect(() => {
    setStep(activeSlide || 0);
  }, [activeSlide]);

  return (
    <>
      {open && (
        <Portal>
          <>
            <TouchableWithoutFeedback onPressIn={onClose}>
              <View
                style={[
                  StyleMixins.styles.backdrop,
                  StyleSheet.absoluteFillObject,
                ]}
              />
            </TouchableWithoutFeedback>
            <RNCarousel
              layout={"default"}
              sliderWidth={WIDTH_WINDOW}
              itemWidth={WIDTH_WINDOW * 0.8}
              renderItem={_renderItem}
              firstItem={step || activeSlide}
              onSnapToItem={index => setStep(index)}
              {...props}
            />
            <Pagination
              dotsLength={props.data.length}
              activeDotIndex={step || activeSlide}
              dotStyle={{
                width: 12,
                height: 12,
                borderRadius: 12,
                bottom: 120,
                marginHorizontal: 2,
                backgroundColor: "white",
              }}
              inactiveDotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                bottom: 120,
                marginHorizontal: 2,
                backgroundColor: "gray",
              }}
              inactiveDotOpacity={0.9}
              inactiveDotScale={0.6}
            />
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
          </>
        </Portal>
      )}
    </>
  );
};

export default Carousel;
