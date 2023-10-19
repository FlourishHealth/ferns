import React from "react";
import {StyleProp, Text as NativeText, TextStyle} from "react-native";

import {HeadingProps} from "./Common";
import {Unifier} from "./Unifier";

const fontSizes = {
  sm: 20,
  md: 28,
  lg: 36,
};

export const Heading = ({align, children, color, size}: HeadingProps): React.ReactElement => {
  const style: StyleProp<TextStyle> = {};

  style.fontFamily = Unifier.theme.titleFont;

  style.fontSize = fontSizes[size || "md"];
  if (align) {
    style.textAlign = align;
  }
  style.color = Unifier.theme[color ?? "darkGray"];
  // TODO: might be useful for wrapping/truncating
  // if (numberOfLines !== 1 && !inline) {
  //   style.flexWrap = "wrap";
  // }

  const lines = 0;
  return (
    <NativeText numberOfLines={lines} style={style}>
      {children}
    </NativeText>
  );
};
