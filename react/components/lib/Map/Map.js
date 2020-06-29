import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import ArrowButton from "../ArrowButton";
import MapStyle from "../../../config/maps-style.json";
import { SvgXml } from "react-native-svg";
import generateMarkerSVG from "./generateMarkerSVG";
import { Card } from "react-native-paper";
import PropTypes from "prop-types";
import Animation from "../Animation";
import ContactCard from "./ContactCard";
import * as StyleMixins from "../stylesheet";

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomContainer: {
    bottom: 20,
    position: "absolute",
    alignItems: "flex-end",
    width: "90%",
    marginLeft: "5%",
  },
  myLocation: {
    marginBottom: 10,
  },
  actionsContainer: {
    marginTop: 10,
  },
  actionMarginLeft: {
    marginLeft: 10,
  },
});

const Map = ({
  initialViewport,
  onViewportChanged,
  customActions,
  customFooter,
  contactSelected,
  hideCards = false,
  dataSource,
}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [contactDetailed, setContactDetailed] = useState(contactSelected);
  const map = useRef();

  const hasPermission = async () => {
    if (Platform.OS === "ios") {
      Geolocation.setRNConfiguration({ authorizationLevel: "whenInUse" });
      Geolocation.requestAuthorization();
      return true;
    } else {
      const askPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (askPermission) return true;

      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

      if (status === PermissionsAndroid.RESULTS.DENIED) {
        ToastAndroid.show(
          "Location permission denied by user.",
          ToastAndroid.LONG
        );
      } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        ToastAndroid.show(
          "Location permission revoked by user.",
          ToastAndroid.LONG
        );
      }

      return false;
    }
  };

  useEffect(() => {
    if (contactSelected) {
      const { latitude, longitude } = contactSelected;
      setContactDetailed(contactSelected);
      map.current.animateCamera({
        center: { latitude, longitude },
      });
    }
  }, [contactSelected]);

  const getUserLocation = async () => {
    const hasAuthorization = await hasPermission();
    if (hasAuthorization) {
      Geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setCurrentLocation({ latitude, longitude });
          map.current.animateCamera({
            center: { latitude, longitude },
            zoom: 14,
            elevation: 30,
          });
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  };

  const contacts = dataSource.getSearchResult();
  const renderMarkers = useMemo(
    () =>
      contacts
        .filter(({ 0: contact }) => {
          return contact.latitude && contact.longitude;
        })
        .map(({ 0: contact }) => {
          const svgString = generateMarkerSVG(contact.avatar);
          return (
            <Marker
              onPress={event => {
                setContactDetailed(contact);
              }}
              key={contact.id}
              coordinate={{
                latitude: contact.latitude,
                longitude: contact.longitude,
              }}>
              {<SvgXml xml={svgString} height="40" width="30" />}
            </Marker>
          );
        }),
    [contacts]
  );
  const renderMap = useMemo(
    () => (
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={map}
        initialCamera={initialViewport}
        onRegionChangeComplete={onViewportChanged}
        style={styles.map}
        rotateEnabled={false}
        showsIndoors={false}
        showsTraffic={false}
        showsBuildings={false}
        showsPointsOfInterest={false}
        loadingEnabled={true}
        onPress={event => {
          if (event.nativeEvent.action !== "marker-press")
            setContactDetailed(null);
        }}
        customMapStyle={MapStyle}>
        {currentLocation && (
          <Marker
            anchor={{ x: 0.5, y: 0.5 }}
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}>
            <Animation.Beacon size={50} />
          </Marker>
        )}
        {renderMarkers}
      </MapView>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLocation, initialViewport, renderMarkers, contacts]
  );

  return useMemo(
    () => (
      <View style={styles.container}>
        {renderMap}
        {!hideCards && (
          <View style={styles.bottomContainer}>
            <ArrowButton
              variant="icon"
              icon="my-location"
              style={styles.myLocation}
              onClick={getUserLocation}
            />
            {contactDetailed && (
              <ContactCard
                style={StyleMixins.styles.gridRow}
                contact={contactDetailed}
                customActions={customActions}
                onClose={() => setContactDetailed(null)}
              />
            )}
            {Boolean(customFooter) && !contactDetailed && (
              <Card
                style={{
                  width: "100%",
                }}>
                <Card.Content>{customFooter}</Card.Content>
              </Card>
            )}
          </View>
        )}
      </View>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contactDetailed, renderMap, customFooter, hideCards]
  );
};

Map.propTypes = {
  initialViewport: PropTypes.shape({
    center: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }).isRequired,
    pitch: PropTypes.number.isRequired,
    heading: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired,
    altitude: PropTypes.number.isRequired,
  }).isRequired,
  onViewportChanged: PropTypes.func,
  customActions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
      icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      callback: PropTypes.func.isRequired,
      mode: PropTypes.oneOf(["text", "contained", "outlined"]),
      test: PropTypes.func,
    })
  ),
};

export default Map;
