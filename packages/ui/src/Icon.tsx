import {FontAwesome5} from "@expo/vector-icons";
import React, {useContext} from "react";

import {IconProps, iconSizeToNumber} from "./Common";
import {ThemeContext} from "./Theme";

export function initIcons() {
  console.debug("Initializing icons");
}

// TODO: Update <Icon /> to be closer to Expo's Vector Icon, letting multiple icon packs be used, etc.
export function Icon({color, size, name, prefix}: IconProps): React.ReactElement {
  const {theme} = useContext(ThemeContext);
  const iconColor = theme[color || "primary"];
  const iconSize = iconSizeToNumber(size);
  return (
    <FontAwesome5
      color={iconColor}
      name={name}
      regular={prefix === "far"}
      size={iconSize}
      solid={!prefix || prefix === "fas"}
    />
  );
}
