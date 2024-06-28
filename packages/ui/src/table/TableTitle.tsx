import React, {FC, useContext} from "react";
import {Text, View} from "react-native";

import {TableTitleProps} from "../Common";
import {ThemeContext} from "../Theme";

const width = {
  sm: 82,
  md: 161,
  lg: 233,
  xl: 302,
};
export const TableTitle: FC<TableTitleProps> = ({title, size}) => {
  const {theme} = useContext(ThemeContext);
  return (
    <View
      accessibilityHint=""
      accessibilityLabel={`Table title: ${title}`}
      accessibilityRole="header"
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <Text
        ellipsizeMode="tail" // ensures that the text is clipped at the end of the line for all platforms
        numberOfLines={3}
        style={{
          fontSize: 16,
          fontWeight: "700",
          flexWrap: "wrap",
          overflow: "hidden",
          color: theme.text.primary,
          maxWidth: width[size],
        }}
      >
        {title}
      </Text>
    </View>
  );
};
