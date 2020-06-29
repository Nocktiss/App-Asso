import React, { useMemo } from "react";
import { withTheme, Text } from "react-native-paper";

const Highlight = ({
  highlightColor,
  search,
  text,
  theme,
  style,
  ...props
}) => {
  return useMemo(() => {
    if (search === "")
      return (
        <Text style={style} {...props}>
          {text}
        </Text>
      );
    const reg = new RegExp(search, "ig");
    const exploded = text.split(reg).filter(str => str !== "");

    const founds = [];
    let result;
    while ((result = reg.exec(text)) !== null) founds.push(result);

    let firstFound = false;
    if (founds.length && founds[0].index === 0) {
      firstFound = true;
    }

    return (
      <Text style={style} {...props}>
        {founds.map((found, index) => (
          <React.Fragment key={found[0] + index}>
            {!firstFound && <Text>{exploded[index]}</Text>}
            <Text
              style={{
                color: theme.colors[highlightColor] || theme.colors.primary,
              }}>
              {found[0]}
            </Text>
            {firstFound && <Text>{exploded[index]}</Text>}
          </React.Fragment>
        ))}
        {founds.length < exploded.length && (
          <Text>{exploded[founds.length]}</Text>
        )}
      </Text>
    );
  }, [highlightColor, props, search, style, text, theme.colors]);
};

export default withTheme(Highlight);
