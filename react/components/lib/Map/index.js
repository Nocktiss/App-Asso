import React, { useState, useMemo, useEffect } from "react";
import MapView from "./Map";
import MapSearch from "./MapSearch";
import { round } from "mathjs";
import { useTranslation } from "react-i18next";

const initialViewport = {
  center: {
    latitude: 48.8534,
    longitude: 2.3488,
  },
  pitch: 0,
  heading: 0,
  zoom: 14,
  altitude: 30,
};

const Map = ({
  onViewportChanged,
  onQueryChanged,
  customActions,
  customFooter,
  dataSource,
}) => {
  const [viewport, setViewport] = useState(initialViewport);
  const [contactSelected, setContactSelected] = useState(null);
  const [hideCards, setHideCards] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    onViewportChanged(initialViewport);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewportChange = newViewport => {
    newViewport.center.latitude = round(newViewport.center.latitude, 4);
    newViewport.center.longitude = round(newViewport.center.longitude, 4);
    if (
      viewport.center.latitude !== newViewport.latitude ||
      viewport.center.longitude !== newViewport.longitude ||
      viewport.zoom !== newViewport.zoom ||
      viewport.altitude !== newViewport.altitude
    ) {
      setViewport(newViewport);
      onViewportChanged && onViewportChanged(newViewport);
    }
  };

  const renderMapView = useMemo(() => {
    return (
      <MapView
        dataSource={dataSource}
        hideCards={hideCards}
        customActions={customActions}
        customFooter={customFooter}
        initialViewport={initialViewport}
        contactSelected={contactSelected}
        onViewportChanged={newRegion => {
          const newViewport = {
            ...viewport,
            center: {
              latitude: newRegion.latitude,
              longitude: newRegion.longitude,
            },
          };

          handleViewportChange(newViewport);
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactSelected, customFooter, hideCards, dataSource]);

  return (
    <>
      {renderMapView}
      <MapSearch
        dataSource={dataSource}
        onChange={query => onQueryChanged(query, viewport)}
        placeholder={t("search.title")}
        onOpen={() => setHideCards(true)}
        onDismiss={() => setHideCards(false)}
        onSelect={contact => {
          setContactSelected(contact);
          handleViewportChange({
            ...viewport,
            center: {
              ...viewport.center,
              latitude: contact.latitude,
              longitude: contact.longitude,
            },
          });
        }}
      />
    </>
  );
};

const { initialViewport: test, ...MapViewPropTypes } = MapView.propTypes;

Map.propTypes = {
  ...MapViewPropTypes,
};

export default Map;
