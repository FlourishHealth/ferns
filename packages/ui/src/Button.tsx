import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import debounce from "lodash/debounce";
import React, {FC, useMemo, useState} from "react";
import {ActivityIndicator, Pressable, Text, View} from "react-native";

import {Box} from "./Box";
import {ButtonProps} from "./Common";
import {isMobileDevice} from "./MediaQuery";
import {Modal} from "./Modal";
import {useTheme} from "./Theme";
import {Tooltip} from "./Tooltip";
import {Unifier} from "./Unifier";
import {isNative} from "./Utilities";

const ConfirmationModal: FC<{
  visible: boolean;
  title: string;
  subtitle?: string;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({visible, title, subtitle, text, onConfirm, onCancel}) => {
  return (
    <Modal
      primaryButtonOnClick={onConfirm}
      primaryButtonText="Confirm"
      secondaryButtonOnClick={onCancel}
      secondaryButtonText="Cancel"
      subtitle={subtitle}
      title={title}
      visible={visible}
      onDismiss={onCancel}
    >
      <Text>{text}</Text>
    </Modal>
  );
};

const ButtonComponent: FC<ButtonProps> = ({
  confirmationText = "Are you sure you want to continue?",
  customBackgroundColor,
  customTextColor,
  disabled = false,
  fullWidth = false,
  iconName,
  iconPosition = "left",
  loading: propsLoading,
  modalTitle = "Confirm",
  modalSubTitle,
  testID,
  text,
  variant = "primary",
  withConfirmation = false,
  onClick,
}) => {
  const [loading, setLoading] = useState(propsLoading);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const {theme} = useTheme();

  const {backgroundColor, borderColor, borderWidth, color} = useMemo(() => {
    if (!theme) {
      return {};
    }
    let bgColor = theme.surface.primary;
    let bColor: string | undefined;
    let bWidth: number | undefined;
    let textColor = theme.text.inverted;

    if (disabled) {
      bgColor = theme.surface.disabled;
    } else if (variant === "secondary") {
      bgColor = theme.surface.secondaryDark;
    } else if (variant === "muted") {
      bgColor = theme.surface.secondaryLight;
      textColor = theme.surface.neutralDark;
    } else if (variant === "outline") {
      bgColor = theme.surface.base;
      bColor = theme.text.secondaryDark;
      bWidth = 2;
      textColor = theme.text.secondaryDark;
    } else if (variant === "destructive") {
      bgColor = theme.surface.error;
    }

    if (customBackgroundColor) {
      bgColor = customBackgroundColor;
    }

    if (customTextColor) {
      textColor = customTextColor;
    }

    return {
      backgroundColor: bgColor,
      borderColor: bColor,
      borderWidth: bWidth,
      color: textColor,
    };
  }, [disabled, variant, theme]);

  if (!theme) {
    return null;
  }

  return (
    <Pressable
      accessibilityHint={
        withConfirmation ? "Opens a confirmation dialog" : "Press to perform action"
      }
      aria-label={text}
      aria-role="button"
      disabled={disabled || loading}
      style={{
        alignItems: "center",
        alignSelf: fullWidth ? "stretch" : undefined,
        backgroundColor,
        borderColor,
        borderRadius: theme.radius.rounded,
        borderWidth,
        flexDirection: "column",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 8,
        width: fullWidth ? "100%" : "auto",
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
      <View style={{flexDirection: "row"}}>
        <View style={{flexDirection: iconPosition === "left" ? "row" : "row-reverse"}}>
          {Boolean(iconName) && (
            <View
              style={{
                alignSelf: "center",
                marginRight: iconPosition === "left" ? 8 : 0,
                marginLeft: iconPosition === "right" ? 8 : 0,
              }}
            >
              <FontAwesome6 color={color} name={iconName} size={16} solid />
            </View>
          )}
          <Text style={{color, fontWeight: "700", fontSize: 16}}>{text}</Text>
        </View>
        {Boolean(loading) && (
          <Box marginLeft={2}>
            <ActivityIndicator color={color} size="small" />
          </Box>
        )}
      </View>
      {withConfirmation && (
        <ConfirmationModal
          subtitle={modalSubTitle}
          text={confirmationText}
          title={modalTitle}
          visible={showConfirmation}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={async () => {
            await onClick();
            setShowConfirmation(false);
          }}
        />
      )}
    </Pressable>
  );
};

export const Button: FC<ButtonProps> = (props) => {
  const {tooltipText, tooltipIdealPosition, tooltipIncludeArrow = false} = props;
  const isMobileOrNative = isMobileDevice() || isNative();

  if (tooltipText && !isMobileOrNative) {
    return (
      <Tooltip
        idealPosition={tooltipIdealPosition}
        includeArrow={tooltipIncludeArrow}
        text={tooltipText}
      >
        <ButtonComponent {...props} />
      </Tooltip>
    );
  }

  return <ButtonComponent {...props} />;
};
