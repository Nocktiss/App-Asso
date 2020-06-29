import React, { useMemo, useState, useCallback } from "react";
import { ScrollView } from "react-native";
import SliderItem from "./Item";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Text,
  Colors,
  IconButton,
} from "react-native-paper";
import ArrowButton from "../ArrowButton";
import * as StyleMixins from "../stylesheet";
import { ucfirst } from "../../../config/utils";
//import Tooltip from "rn-tooltip";

const Slider = ({
  dataSource,
  height = 200,
  ratio = 0.8,
  contentStyle,
  cardStyle,
  renderContent,
  onNewPress,
  onSeeMorePress,
  cardLayout = true,
  onClose = null,
}) => {
  const { t } = useTranslation("translations");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const onLayout = useCallback(
    e =>
      setDimensions({
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return useMemo(
    () => (
      <ScrollView
        style={{ width: "100%" }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onLayout={onLayout}>
        {dataSource.data.map((item, index) => (
          <SliderItem
            width={dimensions.width * ratio}
            key={index}
            height={height}
            item={item}
            cardLayout={cardLayout}
            contentStyle={contentStyle}
            renderContent={renderContent}
            onClose={onClose}
          />
        ))}
        {dataSource.isLast === false && (
          <ArrowButton
            variant={"outlined"}
            dir={"none"}
            style={{ textTransform: "none" }}
            disabled={dataSource.searching}
            onClick={onSeeMorePress}>
            {!dataSource.searching ? (
              <Text>{ucfirst(t("see_more"))}</Text>
            ) : (
              <ActivityIndicator animating={true} size="large" />
            )}
          </ArrowButton>
        )}
        {onNewPress && (
          <SliderItem
            width={height}
            height={height}
            cardStyle={{ backgroundColor: Colors.grey300 }}
            containerStyle={{ marginLeft: 5 }}
            contentStyle={{
              ...StyleMixins.padding(10, 8),
            }}
            elevation={2}
            onPress={onNewPress}
            renderContent={() => (
              <IconButton
                icon={"add"}
                size={50}
                style={{ height: 100, width: 100 }}
              />
            )}
          />
        )}
      </ScrollView>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataSource.data.length, dataSource.received, dimensions.width]
  );
};

Slider.propTypes = {};

export default Slider;
