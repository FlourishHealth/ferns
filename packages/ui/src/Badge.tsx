import React, {useContext} from "react";
import {Text, View} from "react-native";

import {BadgeProps, SurfaceTheme, TextTheme} from "./Common";
import {Icon} from "./Icon";
import {ThemeContext} from "./Theme";

export const Badge = ({
  value,
  iconName,
  status = "info",
  secondary = false,
  variant,
  maxValue = 100,
}: BadgeProps): React.ReactElement => {
  const {theme} = useContext(ThemeContext);
  const isIconOnly = variant === "iconOnly";

  let badgeColor: keyof TextTheme = "inverted";

  const secondaryBorderColors = {
    error: "#F39E9E",
    warning: "#FCC58F",
    info: "#8FC1D2",
    success: "#7FD898",
    neutral: "#AAAAAA",
  };

  if (secondary) {
    if (status === "error") {
      badgeColor = "error";
    } else if (status === "warning") {
      badgeColor = "warning";
    } else if (status === "info") {
      badgeColor = "secondaryDark";
    } else if (status === "success") {
      badgeColor = "success";
    } else if (status === "neutral") {
      badgeColor = "primary";
    }
  }

  let badgeBgColor: keyof SurfaceTheme = "neutralDark";

  if (status === "error") {
    badgeBgColor = secondary ? "errorLight" : "error";
  } else if (status === "warning") {
    badgeBgColor = secondary ? "warningLight" : "warning";
  } else if (status === "info") {
    badgeBgColor = secondary ? "secondaryLight" : "secondaryDark";
  } else if (status === "success") {
    badgeBgColor = secondary ? "successLight" : "success";
  } else if (status === "neutral") {
    badgeBgColor = secondary ? "neutralLight" : "neutralDark";
  }

  let badgeBorderRadius = theme.radius.default as any;
  if (isIconOnly) {
    badgeBorderRadius = theme.radius.full as any;
  } else if (variant === "numberOnly") {
    badgeBorderRadius = theme.radius.rounded as any;
  }

  let badgeValue = value;

  if (variant === "numberOnly") {
    if (!isNaN(Number(value)) && maxValue) {
      const numberValue = Number(value);
      if (numberValue > maxValue) {
        badgeValue = `${maxValue}+`;
      } else {
        badgeValue = numberValue;
      }
    } else {
      console.warn("Warning: Badge value is not a number");
    }
  }

  return (
    <View
      style={{
        alignItems: "flex-start",
      }}
    >
      <View
        style={[
          {
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 1,
            paddingHorizontal: theme.spacing.xs as any,
            flexDirection: "row",
            borderRadius: badgeBorderRadius as any,
            backgroundColor: theme.surface[badgeBgColor],
          },
          isIconOnly && {height: 16, width: 16},
          secondary && {borderWidth: 1, borderColor: secondaryBorderColors[status]},
        ]}
      >
        {Boolean(variant !== "numberOnly" && iconName) && (
          <View style={{marginRight: isIconOnly ? undefined : (theme.spacing.xs as any)}}>
            <Icon color={badgeColor} iconName={iconName!} size="xs" />
          </View>
        )}
        {Boolean(variant !== "iconOnly") && (
          <Text
            style={{
              color: theme.text[badgeColor],
              fontSize: 10,
              fontWeight: "700",
              fontFamily: theme.font.primary,
            }}
          >
            {badgeValue}
          </Text>
        )}
      </View>
    </View>
  );
};
