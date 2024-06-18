import React, {FC, useContext, useEffect, useRef} from "react";
import {
  Dimensions,
  DimensionValue,
  Modal as RNModal,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet, {ActionSheetRef} from "react-native-actions-sheet";

import {Button} from "./Button";
import {ModalProps} from "./Common";
import {Heading} from "./Heading";
import {Icon} from "./Icon";
import {isMobileDevice} from "./MediaQuery";
import {Text} from "./Text";
import {ThemeContext} from "./Theme";
import {isNative} from "./Utilities";

const getModalSize = (size: "sm" | "md" | "lg"): DimensionValue => {
  const sizeMap = {
    sm: 540,
    md: 720,
    lg: 900,
  };
  let sizePx: DimensionValue = sizeMap[size] || sizeMap.sm;
  if (sizePx > Dimensions.get("window").width) {
    sizePx = "90%";
  }
  return sizePx;
};

const ModalContent: FC<{
  children?: React.ReactNode;
  title?: string;
  subTitle?: string;
  text?: string;
  primaryButtonText?: string;
  primaryButtonDisabled?: boolean;
  secondaryButtonText?: string;
  primaryButtonOnClick?: () => void;
  secondaryButtonOnClick?: () => void;
  onDismiss: () => void;
  sizePx: DimensionValue;
  theme: any;
  isMobile: boolean;
}> = ({
  children,
  title,
  subTitle,
  text,
  primaryButtonText,
  primaryButtonDisabled,
  secondaryButtonText,
  primaryButtonOnClick,
  secondaryButtonOnClick,
  onDismiss,
  sizePx,
  theme,
  isMobile,
}) => {
  return (
    <View
      style={{
        padding: 32,
        alignItems: "center",
        alignSelf: "center",
        zIndex: 1,
        backgroundColor: theme.surface.base,
        margin: "auto",
        borderRadius: theme.radius.default as any,
        width: sizePx,
        ...(isMobile
          ? {}
          : {
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.5,
              shadowRadius: 24,
              elevation: 24,
            }),
      }}
    >
      <View style={{alignSelf: "flex-end", position: "relative"}}>
        <Pressable
          accessibilityHint="Closes the modal"
          accessibilityLabel="Close modal"
          accessibilityRole="button"
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: -8,
            bottom: -8,
            left: -8,
            right: -8,
          }}
          onPress={onDismiss}
        >
          <Icon iconName="x" size="sm" />
        </Pressable>
      </View>
      {title && (
        <View
          accessibilityHint="Modal title"
          accessibilityLabel={title}
          accessibilityRole="header"
          style={{alignSelf: "flex-start"}}
        >
          <Heading size="lg">{title}</Heading>
        </View>
      )}
      {subTitle && (
        <View
          accessibilityHint="Modal Sub Heading Text"
          accessibilityLabel={subTitle}
          accessibilityRole="text"
          style={{alignSelf: "flex-start", marginTop: subTitle ? 8 : 0}}
        >
          <Text size="lg">{subTitle}</Text>
        </View>
      )}
      {text && (
        <View
          accessibilityHint="Modal body text"
          accessibilityLabel={text}
          accessibilityRole="text"
          style={{marginVertical: text ? 12 : 0, alignSelf: "flex-start"}}
        >
          <Text>{text}</Text>
        </View>
      )}
      {children && (
        <View accessibilityRole="text" style={{alignSelf: "flex-start", marginTop: text ? 0 : 12}}>
          {children}
        </View>
      )}
      <View
        style={{
          marginTop: text && !children ? 20 : 32,
          flexDirection: "row",
          alignSelf: "flex-end",
        }}
      >
        {Boolean(secondaryButtonText && secondaryButtonOnClick) && (
          <View style={{marginRight: primaryButtonText ? 20 : 0}}>
            <Button
              text={secondaryButtonText as string}
              variant="muted"
              onClick={secondaryButtonOnClick as () => void}
            />
          </View>
        )}
        {Boolean(primaryButtonText && primaryButtonOnClick) && (
          <Button
            disabled={primaryButtonDisabled}
            text={primaryButtonText as string}
            onClick={primaryButtonOnClick as () => void}
          />
        )}
      </View>
    </View>
  );
};

export const Modal: FC<ModalProps> = ({
  children,
  primaryButtonDisabled = false,
  primaryButtonText,
  secondaryButtonText,
  size = "sm",
  subTitle,
  text,
  title,
  visible,
  onDismiss,
  primaryButtonOnClick,
  secondaryButtonOnClick,
}: ModalProps) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const {theme} = useContext(ThemeContext);

  // Modal uses a visible prop, but ActionSheet uses a setModalVisible method on a reference.
  // Open the action sheet ref when the visible prop changes.
  useEffect(() => {
    if (actionSheetRef.current) {
      actionSheetRef.current.setModalVisible(visible);
    }
  }, [visible]);

  const isMobile = isMobileDevice() && isNative();
  const sizePx = getModalSize(size);

  const modalContentProps = {
    title,
    subTitle,
    text,
    primaryButtonText,
    primaryButtonDisabled,
    secondaryButtonText,
    primaryButtonOnClick,
    secondaryButtonOnClick,
    onDismiss,
    sizePx,
    theme,
    isMobile,
  };

  if (isMobile) {
    return (
      <ActionSheet ref={actionSheetRef} onClose={onDismiss}>
        <TouchableOpacity
          accessibilityHint="Closes the modal"
          accessibilityLabel="Close modal"
          accessibilityRole="button"
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            padding: 2,
            backgroundColor: "#9A9A9A",
            borderRadius: 5,
            width: "30%",
            height: 3,
            marginTop: 10,
          }}
          onPress={onDismiss}
        />
        <ModalContent {...modalContentProps}>{children}</ModalContent>
      </ActionSheet>
    );
  } else {
    return (
      <RNModal animationType="slide" transparent visible={visible} onRequestClose={onDismiss}>
        <ModalContent {...modalContentProps}>{children}</ModalContent>
      </RNModal>
    );
  }
};
