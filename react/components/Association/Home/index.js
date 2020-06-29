import React, { useState } from "react";
import { Linking } from "react-native";
import { Page, Map } from "../../lib";
import { useAssociations } from "../../../hooks";
import { useTranslation } from "react-i18next";
import { getMapsUri } from "../../../config/utils";
import DetailsAssociations from "../Details/DetailsAssociations";
import { RT_ASSOCIATION_DETAILS } from "../../../config/_constants";

const Home = ({ history }) => {
  const { actions, selectors } = useAssociations();
  const { t } = useTranslation();
  const [associationSelected, setAssociationSelected] = useState(null);

  return (
    <Page
      scrollable={false}
      body={
        <>
          <Map
            dataSource={selectors}
            onQueryChanged={(
              query,
              { center: { latitude: lat, longitude: lng } }
            ) => {
              actions.search({
                full_text: query,
                distance: {
                  lat,
                  lng,
                },
              });
            }}
            onViewportChanged={({
              center: { latitude: lat, longitude: lng },
            }) => {
              actions.search({
                distance: {
                  lat,
                  lng,
                },
              });
            }}
            customActions={[
              {
                text: t("animal.list_animal"),
                icon: "list",
                callback: association => {
                  setAssociationSelected(() =>
                    history.push(
                      RT_ASSOCIATION_DETAILS.replace(":id", association.id),
                      {
                        isModal: true,
                      }
                    )
                  );
                },
                mode: "contained",
              },
              {
                text: t("contact.directions"),
                icon: "directions",
                callback: association =>
                  Linking.openURL(getMapsUri(association)),
                mode: "outlined",
              },
              {
                text: t("contact.call"),
                icon: "call",
                callback: association =>
                  Linking.openURL(`tel:${association.contactPhone}`),
                mode: "outlined",
                test: association => Boolean(association.contactPhone),
              },
            ]}
          />
          {associationSelected && (
            <DetailsAssociations
              association={associationSelected}
              onClose={() => setAssociationSelected(null)}
            />
          )}
        </>
      }
    />
  );
};

export default Home;
