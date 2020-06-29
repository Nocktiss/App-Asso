import React, { useMemo } from "react";
import { Portal } from "react-native-paper";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const DatetimePicker = ({
  open,
  mode,
  value,
  onChange,
  closeOnChange = true,
  onClose,
  ...props
}) => {
  return useMemo(() => {
    return (
      <>
        {open && (
          <Portal onPress={onClose}>
            <RNDateTimePicker
              {...props}
              value={value || new Date()}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={(_, date) => {
                closeOnChange && onClose();
                onChange(date);
              }}
            />
          </Portal>
        )}
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, closeOnChange, mode, props, value]);
};

export default DatetimePicker;
