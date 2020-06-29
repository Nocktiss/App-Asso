import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
} from "react-native";
import { Page, StyleMixins, Styled } from "../../lib";
import {
  ANIMAL_COVER_DEFAULT,
  RT_ASSOCIATION_DETAILS,
  DATE_FORMAT,
} from "../../../config/_constants";
import { path } from "../../../config/_entrypoint";
import { useTranslation } from "react-i18next";
import {
  Subheading,
  Caption,
  TouchableRipple,
  Surface,
} from "react-native-paper";
import { dateFormat, ucfirst } from "../../../config/utils";
import HomeMiddleAnimal from "../Home/HomeMiddleAnimal";
import useAnimalMonitoring from "../../../hooks/useAnimalMonitoring";

const { width: WIDTH_WINDOW } = Dimensions.get("window");

const styles = StyleSheet.create({
  titlerecord: {
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 15,
  },
  slide: {
    marginTop: "50%",
    height: 0,
  },
  titledetails: {
    fontWeight: "bold",
  },
});

const DetailsAnimals = ({
  history,
  match: {
    params: { id, animalid },
  },
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [modal, setModal] = useState(false);
  const { t } = useTranslation();
  const { selectors, actions } = useAnimalMonitoring();

  const animal = selectors.getAnimal(parseInt(id, 10), parseInt(animalid, 10));

  useEffect(() => {
    actions.getAnimalPicturesList(animal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animal]);

  const _renderItem = ({ item: { avatar_file } }) => {
    return (
      <Surface style={styles.slide}>
        <Image
          key={avatar_file["@id"]}
          resizeMode={"contain"}
          style={[{ width: "100%" }]}
          source={
            avatar_file && {
              //uri: path(
              //  `${picture.avatar_file.uri}.${picture.avatar_file.type}`
              //),
              uri: path("/public/animals/1/avatar?timestamp=1578996773"),
              cache: "reload",
              height: 435, //picture.avatar_file.height,
              width: 590, //picture.avatar_file.width,
            }
          }
        />
        <Text>{avatar_file["@id"]}</Text>
      </Surface>
    );
  };

  const renderImage = () => (
    <ImageBackground
      defaultSource={ANIMAL_COVER_DEFAULT}
      resizeMethod={"scale"}
      resizeMode={"cover"}
      source={
        (animal.avatar_file && {
          uri: path(`${animal.avatar_file.uri}.${animal.avatar_file.type}`),
          cache: "reload",
          height: animal.avatar_file.height,
          width: animal.avatar_file.width,
        }) ||
        ANIMAL_COVER_DEFAULT
      }
      style={{ width: "100%", height: "100%" }}>
      <HomeMiddleAnimal animal={animal} />
    </ImageBackground>
  );

  const onLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }) => setDimensions({ width: width * 0.333, height: width * 0.333 });

  const pictureGallery = selectors.getAnimalPicturesList(animal).data;
  return (
    <Page
      onClose={() => history.push(RT_ASSOCIATION_DETAILS.replace(":id", id))}
      scrollable={true}
      header={renderImage()}
      body={
        <>
          <View
            style={[StyleMixins.styles.formContainer, { marginTop: "10%" }]}>
            <Text style={styles.titlerecord}>{t("animal.my_record")}</Text>
            <Text>
              <Subheading style={styles.titledetails}>
                {t("animal.gender")} :{" "}
              </Subheading>
              <Caption>{ucfirst(animal.gender)}</Caption>
            </Text>
            <Text>
              <Subheading style={styles.titledetails}>
                {t("animal.races")} :{" "}
              </Subheading>
              <Caption>
                {ucfirst(t(animal.subTypes.map(item => item.name).join(", ")))}
              </Caption>
            </Text>
            <Text>
              <Subheading style={styles.titledetails}>
                {t("animal.sterilization")} :{" "}
              </Subheading>
              <Caption>
                {animal.sterilized
                  ? dateFormat(animal.sterilizationDate, DATE_FORMAT)
                  : ucfirst(t("no"))}
              </Caption>
            </Text>
            <Text>
              <Subheading style={styles.titledetails}>
                {t("animal.identificationNumber")} :{" "}
              </Subheading>
              <Caption>{animal.identificationNumber}</Caption>
            </Text>
            <Text
              style={[
                StyleMixins.styles.inputNotFirst,
                styles.titledetails,
                { fontSize: 20 },
              ]}>
              {t("animal.my_pictures")}
            </Text>
          </View>
          <View
            collapsable={false}
            onLayout={onLayout}
            style={[
              StyleMixins.margin(0, "2%"),
              StyleMixins.styles.gridRow,
              StyleMixins.styles.inputNotFirst,
              {
                flexWrap: "wrap",
                justifyContent: "space-between",
              },
            ]}>
            {pictureGallery.map((picture, index) => {
              return (
                <TouchableRipple
                  key={picture["@id"]}
                  onPress={() => setModal(index)}>
                  <Image
                    resizeMode={"cover"}
                    style={dimensions}
                    source={
                      picture.avatar_file && {
                        //uri: path(
                        //  `${picture.avatar_file.uri}.${picture.avatar_file.type}`
                        //),
                        uri: path(
                          "/public/animals/1/avatar?timestamp=1578996773"
                        ),
                        cache: "reload",
                        height: 435, //picture.avatar_file.height,
                        width: 590, //picture.avatar_file.width,
                      }
                    }
                  />
                </TouchableRipple>
              );
            })}
          </View>
          <Styled.Carousel
            open={modal !== false}
            onClose={() => setModal(false)}
            layoutCardOffset={9}
            data={selectors.getAnimalPicturesList(animal).data}
            activeSlide={modal}
            loop={true}
            renderItem={_renderItem}
            sliderWidth={WIDTH_WINDOW}
            itemWidth={WIDTH_WINDOW * 0.8}
          />
        </>
      }
    />
  );
};

export default DetailsAnimals;
