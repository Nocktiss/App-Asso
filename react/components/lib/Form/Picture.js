import React, { useState, useEffect } from "react";
import { View, Image } from "react-native";
import {
  HelperText,
  TouchableRipple,
  Avatar,
  Caption,
  withTheme,
} from "react-native-paper";
import { getIn } from "formik";
import ImagePicker from "react-native-image-crop-picker";
import { useTranslation } from "react-i18next";
// import DEFAULT_IMAGE from "../../../images/cover.jpg";
import * as Styled from "../Styled";
import * as StyleMixins from "../stylesheet";
import { ucfirst } from "../../../config/utils";
import { path } from "../../../config/_entrypoint";
import Label from "./Label";

const Picture = ({
  field,
  form,
  style,
  cropOptions = null,
  asyncImage = null,
  label,
  theme,
  ...props
}) => {
  const [image, setImage] = useState(field.value);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const configuration = {
    mediaType: "photo",
    includeBase64: true,
    avoidEmptySpaceAroundImage: true,
    writeTempFile: false,
    cropping: Boolean(cropOptions),
    ...cropOptions,
    cropperToolbarTitle: t("photo.edit"),
    compressImageQuality: 0.8,
    loadingLabelText: t("photo.loading"),
    forceJpg: true,
    enableRotationGesture: true,
    cropperChooseText: t("photo.choose"),
    cropperCancelText: t("photo.cancel"),
    cropperToolbarColor: theme.colors.primary,
  };

  const onPressDialog = provider => {
    setOpen(false);
    const method = `open${provider}`;
    ImagePicker[method](configuration)
      .then(result => {
        setImage(result);
        form.setFieldValue(
          field.name,
          `data:${result.mime};base64,${result.data}`
        );
      })
      .catch(e => {
        if (e.code !== "E_PICKER_CANCELLED") {
          form.setFieldError(field.name, e.message);
        }
      });
  };

  useEffect(() => {
    return () => {
      ImagePicker.clean();
    };
  });

  const renderDialog = () => {
    return (
      <Styled.Dialog
        open={open}
        title={t("photo.select_provider")}
        onClose={() => setOpen(false)}>
        <View
          style={[
            StyleMixins.styles.gridRow,
            StyleMixins.styles.gridSpaceAround,
          ]}>
          <TouchableRipple onPress={() => onPressDialog("Camera")}>
            <View style={StyleMixins.styles.gridCenter}>
              <Avatar.Icon icon="camera" />
              <Caption>{ucfirst(t("photo.camera"))}</Caption>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => onPressDialog("Picker")}>
            <View style={StyleMixins.styles.gridCenter}>
              <Avatar.Icon icon="folder" />
              <Caption>{ucfirst(t("photo.folder"))}</Caption>
            </View>
          </TouchableRipple>
        </View>
      </Styled.Dialog>
    );
  };
  const onLayout = ({
    nativeEvent: {
      layout: { width, height },
    },
  }) => setDimensions({ width, height });
  const renderBase = () => {
    return (
      <Image
        height={"100%"}
        width={"100%"}
        onLayout={onLayout}
        resizeMethod={"auto"}
        resizeMode={"contain"}
        source={
          image
            ? typeof image === "string"
              ? {
                  uri: image,
                  height: dimensions.height,
                  width: dimensions.width,
                }
              : {
                  uri: `data:${image.mime};base64,${image.data}`,
                  height: dimensions.height,
                  width: dimensions.width,
                }
            : asyncImage
            ? {
                uri: path(`${asyncImage.uri}.${asyncImage.type}`),
                height: dimensions.height,
                width: dimensions.width,
              }
            : DEFAULT_IMAGE
        }
      />
    );
  };

  const error = getIn(form.errors, field.name),
    touched = getIn(form.touched, field.name);

  return (
    <View style={style} collapsable={false}>
      <Label style={{ textAlign: "center" }}>{label}</Label>
      <View
        style={{ flex: 1, overflow: "hidden" }}
        collapsable={false}
        onLayout={({
          nativeEvent: {
            layout: { width, height },
          },
        }) => setDimensions({ width, height })}>
        <TouchableRipple
          style={{ height: "100%", width: "100%" }}
          onPress={() => setOpen(true)}>
          {renderBase()}
        </TouchableRipple>
      </View>
      {renderDialog()}
      {Boolean(error) && touched && (
        <HelperText type="error" visible={error !== undefined}>
          {error}
        </HelperText>
      )}
    </View>
  );
};

export default withTheme(Picture);
