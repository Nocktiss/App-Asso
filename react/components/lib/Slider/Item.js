import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Card, IconButton } from "react-native-paper";
import * as StyleMixins from "../../lib/stylesheet";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  card: {
    ...StyleMixins.margin(5, 10, 8),
    ...StyleMixins.borderRadius(20),
    flex: 1,
  },
  cardContent: { ...StyleMixins.padding(30, 8, 10), flex: 1, width: "100%" },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 5,
    elevation: 1,
  },
});

const SliderItem = ({
  contentStyle = {},
  containerStyle = {},
  cardStyle = {},
  renderContent,
  height = 200,
  width,
  item,
  elevation = 4,
  cardLayout = true,
  onClose = null,
  onPress = null,
}) => {
  return useMemo(
    () => (
      <View style={[containerStyle, { width, height }]} collapsable={false}>
        {cardLayout ? (
          <Card
            elevation={elevation}
            style={[styles.card, cardStyle]}
            onPress={onPress}>
            <Card.Content
              style={[
                styles.cardContent,
                StyleMixins.styles.gridCenter,
                contentStyle,
                { width },
              ]}>
              {renderContent(item)}
            </Card.Content>
          </Card>
        ) : (
          renderContent(item, [styles.card, cardStyle])
        )}
        {onClose && (
          <IconButton
            style={styles.closeButton}
            icon="close"
            onPress={() => onClose(item)}
          />
        )}
      </View>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contentStyle, height, item, width]
  );
};

SliderItem.propTypes = {
  renderContent: PropTypes.func.isRequired,
  height: PropTypes.number,
  width: PropTypes.number.isRequired,
  onClose: PropTypes.func,
};

export default SliderItem;
