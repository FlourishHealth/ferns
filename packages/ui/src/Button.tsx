import debounce from "lodash/debounce";
import React, {useContext, useState} from "react";
import {ActivityIndicator, Pressable} from "react-native";

import {Box} from "./Box";
import {ButtonProps, TextColor} from "./Common";
import {Icon} from "./Icon";
import {Modal} from "./Modal";
import {Text} from "./Text";
import {ThemeContext} from "./Theme";
import {Tooltip} from "./Tooltip";
import {Unifier} from "./Unifier";

const buttonTextColor: {[buttonColor: string]: "white" | "darkGray"} = {
  blue: "white",
  neutralLight: "darkGray",
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
  xs: 30,
  sm: 36,
  md: 40,
  lg: 48,
};

export const Button = ({
  disabled = false,
  type = "solid",
  loading: propsLoading,
  text,
  inline = false,
  icon,
  size = "md",
  onClick,
  color = "gray",
  withConfirmation = false,
  confirmationText = "Are you sure you want to continue?",
  confirmationHeading = "Confirm",
  shape = "rounded",
  testID,
  tooltip,
}: ButtonProps) => {
  const [loading, setLoading] = useState(propsLoading);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const {theme} = useContext(ThemeContext);

  // TODO: get real button colors here.
  const backgroundColor = theme.surface.primary;
  const textColor: TextColor = "inverted";
  const borderColor = theme.text.primary;

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
      <>
        <Pressable
          accessibilityRole="button"
          disabled={disabled || loading}
          style={{
            alignSelf: inline === true ? undefined : "stretch",
            height: HEIGHTS[size || "md"],
            backgroundColor,
            // width: inline === true ? undefined : "100%",
            flexShrink: inline ? 1 : 0,
            // flexGrow: inline ? 0 : 1,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: shape === "pill" ? 999 : 5,
            borderColor,
            borderWidth: type === "outline" ? 2 : 0,
            opacity: disabled ? 0.4 : 1,
            flexDirection: "row",
            paddingHorizontal: size === "xs" ? 6 : size === "sm" ? 12 : 8 * 2,
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
              } catch (error) {
                setLoading(false);
                throw error;
              }
              setLoading(false);
            },
            500,
            {leading: true}
          )}
        >
          {icon !== undefined && (
            <Box marginRight={2}>
              <Icon color={textColor} iconName={icon} size={size === "xs" ? "sm" : size} />
            </Box>
          )}
          {Boolean(text) && (
            <Text
              align="center"
              color={textColor}
              inline={inline}
              size={size === "xs" ? "sm" : size}
              skipLinking
              weight="bold"
            >
              {text}
            </Text>
          )}
          {Boolean(loading) && (
            <Box marginLeft={2}>
              <ActivityIndicator color={textColor} size="small" />
            </Box>
          )}
        </Pressable>
        {Boolean(withConfirmation) && renderConfirmation()}
      </>
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
};
