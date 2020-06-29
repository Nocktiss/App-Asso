import React, { useState, useEffect, useRef } from "react";
import { FlatList, View, StyleSheet, Animated } from "react-native";
import { Divider, List, withTheme, Caption, Avatar } from "react-native-paper";
import { StyleMixins } from "..";
import * as Styled from "../Styled";
import Highlight from "../Highlight";
import { computeAddress } from "../../../config/utils";
import { getResourceLogo } from "../../../config/_constants";
import { round } from "mathjs";

const styles = StyleSheet.create({
  portal: {
    position: "absolute",
    backgroundColor: "white",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 0,
    overflow: "hidden",
  },
  topBar: {
    height: 70,
    width: "100%",
  },
  menu: {
    flex: 1,
  },
  divider: { marginLeft: 16 },
});

const MapSearch = ({
  emptyLabel,
  onChange,
  placeholder,
  onSelect,
  theme,
  inputStyle,
  dataSource,
  onOpen = () => {},
  onDismiss = () => {},
}) => {
  const [modalHeight] = useState(new Animated.Value(0));
  const [opened, setOpened] = useState(false);
  const [query, setQuery] = useState("");
  const results = opened && query !== null ? dataSource.getSearchResult() : [];
  const searchbarRef = useRef();

  const onPress = () => {
    Animated.timing(modalHeight, {
      toValue: 100,
      duration: 500,
      //useNativeDriver: true,
    }).start(() => {
      setOpened(true);
      searchbarRef.current.focus();
    });
  };

  const onClose = () => {
    Animated.timing(modalHeight, {
      toValue: 0,
      duration: 500,
      restSpeedThreshold: 100,
      restDisplacementThreshold: 40,
      //useNativeDriver: true,
    }).start(() => {
      setOpened(false);
      setQuery(null);
      searchbarRef.current.blur();
    });
  };

  useEffect(() => {
    if (opened) {
      setQuery("");
      onChange("");
      onOpen();
    } else {
      onDismiss();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  const renderBase = () => {
    const backgroundColor = opened ? theme.colors.primary : "transparent";
    return (
      <View
        style={[
          StyleMixins.styles.gridRow,
          styles.topBar,
          { backgroundColor },
        ]}>
        <Styled.Searchbar
          dataSource={dataSource}
          innerRef={searchbarRef}
          style={[StyleMixins.margin(10, 25)]}
          onFocus={() => onPress()}
          icon={opened ? "arrow-back" : "search"}
          onIconPress={() => (opened ? onClose() : onPress())}
          onChangeText={q => setQuery(q) || onChange(q.trim())}
          value={query}
          placeholder={placeholder}
        />
      </View>
    );
  };

  const renderItem = ({ item: { 0: contact, distance } }) => {
    distance =
      distance > 1000 ? `+${round(distance / 1000, 2)} km` : `+${distance} m`;
    return (
      <List.Item
        style={{ paddingHorizontal: 30 }}
        title={<Highlight search={query.trim()} text={contact.name} />}
        description={() => (
          <Caption>
            <Caption>
              <Highlight
                alpha={0.54}
                search={query.trim()}
                text={computeAddress(contact)}
              />
            </Caption>
          </Caption>
        )}
        right={() => (
          <View style={{ justifyContent: "center" }}>
            <Caption> {distance}</Caption>
          </View>
        )}
        left={
          Boolean(contact.type) &&
          (() => (
            <View style={{ justifyContent: "center" }}>
              <Avatar.Image
                size={50}
                style={{ marginRight: 10 }}
                source={getResourceLogo(contact.type.name)}
              />
            </View>
          ))
        }
        onPress={() => {
          onSelect(contact);
          onClose();
        }}
      />
    );
  };

  return (
    <>
      <Animated.View
        style={[
          styles.portal,
          {
            height: modalHeight.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
        collapsable={false}>
        <View style={[styles.topBar]} />
        <FlatList
          style={styles.menu}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          data={results.filter(({ 0: contact }) => {
            return contact.latitude && contact.longitude;
          })}
          renderItem={renderItem}
          keyExtractor={item => item[0].id.toString()}
          ListEmptyComponent={() => <List.Item title={emptyLabel} />}
        />
      </Animated.View>
      {renderBase(inputStyle)}
    </>
  );
};

export default withTheme(MapSearch);
