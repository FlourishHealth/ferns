import debounce from "lodash/debounce";
import React, {useContext, useState} from "react";
import {ActivityIndicator, Pressable, View} from "react-native";

import {Box} from "./Box";
import {ButtonColor, Color, IconName, IconPrefix, TooltipDirection, UnifiedTheme} from "./Common";
import {Icon} from "./Icon";
import {Modal} from "./Modal";
import {Text} from "./Text";
import {ThemeContext} from "./Theme";
import {Tooltip} from "./Tooltip";
import {Unifier} from "./Unifier";

export interface ButtonProps {
  children?: React.ReactElement;
  text: string;
  // TODO make this work for all colors
  color?: ButtonColor | Color;
  // default gray
  disabled?: boolean; // default false
  inline?: boolean; // default false
  size?: "sm" | "md" | "lg"; // default md
  type?: "solid" | "ghost" | "outline"; // default solid
  loading?: boolean;
  onClick: any;
  icon?: IconName;
  iconPrefix?: IconPrefix;
  iconColor?: ButtonColor | Color;
  withConfirmation?: boolean;
  confirmationText?: string;
  confirmationHeading?: string;
  shape?: "rounded" | "pill";
  testID?: string;
  tooltip?: {
    text: string;
    idealDirection?: TooltipDirection;
  };
}

const buttonTextColor: {[buttonColor: string]: "white" | "darkGray"} = {
  blue: "white",
  lightGray: "darkGray",
  red: "white",
  transparent: "white",
  white: "darkGray",
  primary: "white",
  secondary: "white",
  accent: "white",
  tertiary: "white",
  facebook: "white",
  twitter: "white",
  google: "white",
};

const HEIGHTS = {
  sm: 36,
  md: 40,
  lg: 48,
};

export function Button({
  disabled = false,
  type = "solid",
  loading: propsLoading,
  children,
  text,
  inline = false,
  icon,
  iconPrefix,
  size = "md",
  onClick,
  color = "gray",
  withConfirmation = false,
  confirmationText = "Are you sure you want to continue?",
  confirmationHeading = "Confirm",
  shape = "rounded",
  testID,
  tooltip,
}: ButtonProps) {
  const [loading, setLoading] = useState(propsLoading);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const {theme} = useContext(ThemeContext);

  const getBackgroundColor = (backgroundColor: string): string => {
    if (type === "ghost" || type === "outline") {
      return "transparent";
    } else {
      return theme[backgroundColor as keyof UnifiedTheme];
    }
  };

  const getTextColor = (textColor: Color): Color => {
    if (type === "ghost" || type === "outline") {
      return textColor;
    } else if (textColor === undefined) {
      return "darkGray";
    } else {
      return buttonTextColor[textColor] || "white";
    }
  };

  const getBorderColor = (borderColor: string): string => {
    if (type === "outline") {
      return theme[getTextColor(borderColor as Color)];
    } else {
      return "transparent";
    }
  };

  if (color === "gray") {
    color = "lightGray";
  }

  const renderConfirmation = () => {
    return (
      <Modal
        heading={confirmationHeading}
        primaryButtonOnClick={() => {
          onClick();
          setShowConfirmation(false);
        }}
        primaryButtonText="Confirm"
        secondaryButtonOnClick={(): void => setShowConfirmation(false)}
        secondaryButtonText="Cancel"
        size="sm"
        visible={showConfirmation}
        onDismiss={(): void => {
          setShowConfirmation(false);
        }}
      >
        <Text>{confirmationText}</Text>
      </Modal>
    );
  };

  const renderButton = () => {
    return (
      <View>
        <Pressable
          disabled={disabled || loading}
          style={{
            alignSelf: inline === true ? undefined : "stretch",
            height: HEIGHTS[size || "md"],
            backgroundColor: getBackgroundColor(color),
            // width: inline === true ? undefined : "100%",
            flexShrink: inline ? 1 : 0,
            // flexGrow: inline ? 0 : 1,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: shape === "pill" ? 999 : 5,
            borderColor: getBorderColor(color),
            borderWidth: type === "outline" ? 2 : 0,
            opacity: disabled ? 0.4 : 1,
            flexDirection: "row",
            paddingHorizontal: 8 * 2,
          }}
          testID={testID}
          onPress={debounce(
            async () => {
              await Unifier.utils.haptic();
              setLoading(true);
              try {
                if (withConfirmation && !showConfirmation) {
                  setShowConfirmation(true);
                } else if (onClick) {
                  await onClick();
                }
              } catch (e) {
                setLoading(false);
                throw e;
              }
              setLoading(false);
            },
            500,
            {leading: true}
          )}
        >
          {icon !== undefined && (
            <Box paddingX={2}>
              <Icon
                color={getTextColor(color as Color)}
                name={icon}
                prefix={iconPrefix || "far"}
                size={size}
              />
            </Box>
          )}
          {Boolean(children) && children}
          {Boolean(text) && (
            <Text
              color={getTextColor(color as Color)}
              font="button"
              inline={inline}
              size={size}
              skipLinking
              weight="bold"
            >
              {text}
            </Text>
          )}
          {Boolean(loading) && (
            <Box marginLeft={2}>
              <ActivityIndicator color={getTextColor(color as Color)} size="small" />
            </Box>
          )}
        </Pressable>
        {Boolean(withConfirmation) && renderConfirmation()}
      </View>
    );
  };

  if (tooltip) {
    return (
      <Tooltip idealDirection={tooltip.idealDirection} text={tooltip.text}>
        {renderButton()}
      </Tooltip>
    );
  } else {
    return renderButton();
  }
}
