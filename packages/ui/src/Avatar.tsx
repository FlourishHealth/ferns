/* eslint-disable no-console */
import {ImageResult, manipulateAsync, SaveFormat} from "expo-image-manipulator";
import {launchImageLibraryAsync, MediaTypeOptions} from "expo-image-picker";
import {LinearGradient} from "expo-linear-gradient";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {Image, Platform, Pressable, Text, View} from "react-native";

import {Box} from "./Box";
import {AvatarProps, CustomSvgProps} from "./Common";
import {Icon} from "./Icon";
import {MobileIcon, OfflineIcon, OnlineIcon, OutOfOfficeIcon} from "./icons";
import {isMobileDevice} from "./MediaQuery";
import {ThemeContext} from "./Theme";
import {Tooltip} from "./Tooltip";

const sizes = {
  xs: 28,
  sm: 38,
  md: 56,
  lg: 64,
  xl: 132,
};

const initialsFontSizes = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 60,
};

const iconSizes = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 30,
};

const iconSizeScale = {
  xs: 0.4,
  sm: 0.5,
  md: 0.6,
  lg: 0.75,
  xl: 1,
};

const sizeIconPadding = {
  xs: 12,
  sm: 10,
  md: 9,
  lg: 7,
  xl: 0,
};

// TODO: Avatar probably makes more sense as a custom set of views rather than relying on
// Box, etc. It's a pretty unique component with unique colors and borders.
export const Avatar = ({
  name,
  hasBorder = true,
  size = "md",
  src,
  onChange,
  status = "online",
  doNotDisturb = false,
}: AvatarProps): React.ReactElement => {
  const {theme} = useContext(ThemeContext);
  const [isImageLoaded, setIsImageLoaded] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(src ?? undefined);
  const avatarImageFormat = SaveFormat.PNG;
  const avatarImageDiameter = sizes[size];
  const showEditIcon = status === "imagePicker";

  const avatarRadius = avatarImageDiameter / 2;
  const computedInitials = (name.match(/(^\S\S?|\s\S)?/g) as any)
    .map((v: string) => v.trim())
    .join("")
    .match(/(^\S|\S$)?/g)
    .join("")
    .toLocaleUpperCase();

  const statusIcons: {
    [id: string]: {
      icon: (props: CustomSvgProps) => React.ReactElement;
      label: string;
    };
  } = {
    online: {icon: OnlineIcon, label: "Online"},
    offline: {icon: OfflineIcon, label: "Offline"},
    outOfOffice: {icon: OutOfOfficeIcon, label: "Out of Office"},
    activeMobile: {
      icon: MobileIcon,

      label: "Active on Mobile",
    },
  };

  // If the src changes, update the image.
  useEffect(() => {
    setImgSrc(imgSrc);
  }, [imgSrc]);

  if (showEditIcon && !onChange) {
    console.warn("Avatars with the status of 'imagePicker' should also have an onChange property.");
  }

  const handleImageError = () => {
    setIsImageLoaded(false);
    console.warn("Image load error");
  };

  const pickImage = async () => {
    // TODO: Add permission request to use camera to take a picture
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
    });

    if (!result.canceled && result.assets) {
      const resizedImage = await resizeImage(result.assets[0].uri);
      setImgSrc(resizedImage.uri);
      if (onChange) {
        onChange({avatarImageFormat, ...resizedImage});
      }
    }
  };

  const resizeImage = async (imageUri: string): Promise<ImageResult> => {
    return manipulateAsync(
      imageUri,
      [{resize: {width: avatarImageDiameter, height: avatarImageDiameter}}],
      {format: avatarImageFormat}
    );
  };

  const shouldShowEditIcon = useMemo(() => {
    if (Platform.OS === "web") {
      return (showEditIcon && !src) || (showEditIcon && hovered);
    }
    return showEditIcon;
  }, [showEditIcon, src, hovered]);

  const renderEditIcon = () => {
    if (shouldShowEditIcon && Platform.OS === "web") {
      return (
        <Pressable
          accessibilityRole="button"
          style={{
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.75)",
            borderRadius: avatarRadius,
            height: avatarImageDiameter,
            justifyContent: "center",
            position: "absolute",
            width: avatarImageDiameter,
            zIndex: 5,
          }}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onPress={pickImage}
        >
          <Icon color="primary" iconName="pen-to-square" size={iconSizes[size]} type="regular" />
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 12,
              marginTop: 10,
            }}
          >
            Upload Image
          </Text>
        </Pressable>
      );
    } else if (shouldShowEditIcon && Platform.OS !== "web") {
      return (
        <Box
          bottom
          left={Boolean(status)}
          paddingX={sizeIconPadding[size]}
          position="absolute"
          right={!Boolean(status)}
          zIndex={5}
          onClick={pickImage}
        >
          <Icon color="primary" iconName="pen-to-square" size={size} />
        </Box>
      );
    }
    return null;
  };

  const renderStatusIcon = () => {
    if (!status || status === "imagePicker") {
      return null;
    }
    const {icon} = statusIcons[status];

    if (!icon) {
      console.warn(`Avatar: Invalid status ${status}`);
      return null;
    }

    return (
      <View
        style={{
          bottom: 0,
          position: "absolute",
          right: 0,
          zIndex: 5,
        }}
      >
        {icon({doNotDisturb, scale: iconSizeScale[size]})}
      </View>
    );
  };

  let avatar = (
    <View style={{height: avatarImageDiameter, position: "relative", width: avatarImageDiameter}}>
      <Pressable
        accessibilityRole="button"
        style={{
          overflow: "hidden",
          position: "relative",
          borderRadius: 1,
          height: "auto",
          width: "auto",
        }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {src && isImageLoaded ? (
          // TODO: Make our Image component rounding work so that we can use it for Avatar.
          // Currently it creates an unrounded box around the Image.
          <Image
            accessibilityIgnoresInvertColors
            source={{uri: src, cache: "force-cache"}}
            style={{
              borderRadius: avatarRadius,
              borderWidth: hasBorder && status !== "imagePicker" ? avatarImageDiameter * 0.04 : 0,
              borderColor: hasBorder ? "white" : "transparent",
              height: avatarImageDiameter,
              overflow: "hidden",
            }}
            onError={handleImageError}
          />
        ) : (
          <View
            style={{
              height: avatarImageDiameter,
              width: avatarImageDiameter,
              borderRadius: avatarRadius,
              borderWidth: hasBorder && status !== "imagePicker" ? avatarImageDiameter * 0.04 : 0,
              borderColor: hasBorder && status !== "imagePicker" ? "white" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.surface.secondaryDark,
            }}
          >
            <Text
              style={{
                fontWeight: 500,
                fontSize: initialsFontSizes[size],
                color: status === "imagePicker" ? theme.text.inverted : theme.text.primary,
              }}
            >
              {computedInitials}
            </Text>
          </View>
        )}
      </Pressable>
      {/* Needs to come after the image so it renders on top. */}
      {renderEditIcon()}
    </View>
  );

  if (hasBorder && status !== "imagePicker") {
    const gradientDiameter = avatarImageDiameter * 1.1;
    const gradientStartColor = "#FFC947";
    const gradientEndColor = "#EA9095";
    // Start the first color in the top left corner and end the second color in the bottom
    // right corner.

    avatar = (
      <LinearGradient
        colors={[gradientStartColor, gradientEndColor]}
        end={{x: 1, y: 1}}
        start={{x: 0, y: 0}}
        style={{
          height: gradientDiameter,
          width: gradientDiameter,
          borderRadius: gradientDiameter / 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {avatar}
      </LinearGradient>
    );
  }

  if (status) {
    // Need to wrap the tooltip so it doesn't expand to 100% width and render the tooltip off.
    // Don't show the tooltips on mobile because they intercept the edit avatar clicks.
    const widthPlusPadding = avatarImageDiameter + sizeIconPadding[size];

    avatar = (
      <View
        style={{
          width: widthPlusPadding,
          paddingRight: sizeIconPadding[size],
          paddingBottom: sizeIconPadding[size],
        }}
      >
        <Tooltip idealDirection="top" text={isMobileDevice() ? undefined : status}>
          {avatar}
        </Tooltip>
        {renderStatusIcon()}
      </View>
    );
  }

  return avatar;
};
