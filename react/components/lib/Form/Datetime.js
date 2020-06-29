import React, { useState, useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import { TextInput, HelperText, IconButton } from "react-native-paper";
import * as StyleMixins from "../stylesheet";
import { DATE_FORMAT, TIME_FORMAT } from "../../../config/_constants";
import {
  dateFormat,
  dateSetDate,
  dateSetTime,
  parseISO,
} from "../../../config/utils";
import { TextInputMask } from "react-native-masked-text";
import { isEqual, subMonths } from "date-fns";
import { getIn } from "formik";
import DatetimePicker from "./DatetimePicker";

const Datetime = ({ field, form, style, variant, label, ...props }) => {
  const inputStyle = { backgroundColor: "transparent", flex: 1 };
  const [value, setValue] = useState(
    field.value ? parseISO(field.value) : null
  );
  const dateField = useRef();
  const timeField = useRef();
  const [mode, setMode] = useState(false);
  const [datetime, setDatetime] = useState({
    date: value ? dateFormat(value, DATE_FORMAT) : "",
    time: value ? dateFormat(value, TIME_FORMAT) : "",
  });

  useEffect(() => {
    let date = new Date();
    if (variant === "date") {
      date = dateSetTime(date, 0, 0, 0);
    }
    if (dateField.current && dateField.current.isValid()) {
      date = subMonths(dateSetDate(date, ...datetime.date.split("/")), 1);
    }
    if (timeField.current && timeField.current.isValid()) {
      date = dateSetTime(date, ...datetime.time.split(":"));
    }
    if (!isEqual(parseISO(field.value), parseISO(date)))
      setDatetime({
        date: field.value ? dateFormat(field.value, DATE_FORMAT) : "",
        time: field.value ? dateFormat(field.value, TIME_FORMAT) : "",
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  useEffect(() => {
    let date = new Date();
    if (variant === "date") {
      date = dateSetTime(date, 0, 0, 0);
    }
    if (dateField.current && dateField.current.isValid()) {
      date = dateSetDate(
        date,
        ...datetime.date.split("/").map((item, index) => {
          item = parseInt(item, 10);
          if (index === 1) item--;
          return item;
        })
      );
    }
    if (timeField.current && timeField.current.isValid()) {
      date = dateSetTime(date, ...datetime.time.split(":"));
    }
    if (
      ((variant === "date" &&
        dateField.current &&
        dateField.current.isValid()) ||
        (variant === "time" &&
          timeField.current &&
          timeField.current.isValid()) ||
        (variant === "datetime" &&
          dateField.current &&
          dateField.current.isValid() &&
          timeField.current &&
          timeField.current.isValid())) &&
      !isEqual(parseISO(field.value), date)
    )
      form.setFieldValue(field.name, date.toISOString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datetime]);

  return useMemo(
    () => {
      const error = getIn(form.errors, field.name),
        touched = getIn(form.touched, field.name);

      return (
        <View style={style}>
          <View style={StyleMixins.styles.gridRow}>
            {variant.indexOf("date") !== -1 && (
              <TextInput
                label={label}
                value={datetime.date}
                render={inputProps => (
                  <View
                    style={[
                      StyleMixins.styles.gridRow,
                      { alignItems: "flex-end" },
                    ]}>
                    <TextInputMask
                      {...inputProps}
                      type={"datetime"}
                      options={{
                        format: DATE_FORMAT.toUpperCase(),
                      }}
                      ref={dateField}
                    />
                    <IconButton
                      style={{
                        margin: 0,
                        marginHorizontal: 10,
                        marginBottom: 7,
                      }}
                      onPress={() => setMode("date")}
                      icon="today"
                    />
                  </View>
                )}
                error={error && touched}
                onBlur={() => form.handleBlur(field.name)}
                onChangeText={inputValue =>
                  setDatetime({ ...datetime, date: inputValue })
                }
                style={inputStyle}
                {...props}
              />
            )}
            {variant.indexOf("time") !== -1 && (
              <TextInput
                label={(variant.indexOf("date") === -1 && label) || " "}
                value={datetime.time}
                render={inputProps => (
                  <View
                    style={[
                      StyleMixins.styles.gridRow,
                      { alignItems: "flex-end" },
                    ]}>
                    <TextInputMask
                      {...inputProps}
                      type={"datetime"}
                      options={{
                        format: TIME_FORMAT,
                      }}
                      ref={timeField}
                    />
                    <IconButton
                      style={{
                        margin: 0,
                        marginHorizontal: 10,
                        marginBottom: 7,
                      }}
                      onPress={() => setMode("time")}
                      icon="timer"
                    />
                  </View>
                )}
                error={error && touched}
                onBlur={() => form.handleBlur(field.name)}
                onChangeText={inputValue =>
                  setDatetime({ ...datetime, time: inputValue })
                }
                style={inputStyle}
                {...props}
              />
            )}
          </View>
          {Boolean(error) && touched && (
            <HelperText type="error" visible={error !== undefined}>
              {error}
            </HelperText>
          )}
          <DatetimePicker
            open={Boolean(mode)}
            mode={mode}
            onClose={() => setMode(false)}
            value={parseISO(field.value)}
            onChange={date => {
              date &&
                setDatetime({
                  ...datetime,
                  [mode]: dateFormat(
                    date,
                    mode === "time" ? TIME_FORMAT : DATE_FORMAT
                  ),
                });
            }}
          />
        </View>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [datetime, field.name, field.value, inputStyle, mode, props, style, variant]
  );
};

export default Datetime;
