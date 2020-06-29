import React, { useMemo } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { Portal } from "react-native-paper";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import * as Styled from "../Styled";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n";

const DatetimePicker = ({
  open,
  mode,
  value,
  onChange,
  closeOnChange = true,
  onClose,
  ...props
}) => {
  const { t } = useTranslation();
  return useMemo(() => {
    return (
      <>
        {open && (
          <Portal onPress={onClose}>
            <View
              style={{
                justifyContent: "center",
                flex: 1,
                backgroundColor: "white",
              }}>
              <TouchableWithoutFeedback onPressIn={onClose}>
                <View
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </TouchableWithoutFeedback>
              <RNDateTimePicker
                {...props}
                value={value || new Date()}
                mode={mode}
                locale={i18n.language || "fr"}
                is24Hour={true}
                display="default"
                onChange={(_, date) => {
                  onChange(date);
                }}
              />
              <Styled.Button onPress={onClose}>
                {t("form.validate")}
              </Styled.Button>
            </View>
          </Portal>
        )}
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, closeOnChange, mode, props, value]);
};

export default DatetimePicker;
