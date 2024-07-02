import {getCalendars} from "expo-localization";
import React, {ReactElement, useCallback, useState} from "react";
import {
  DimensionValue,
  KeyboardTypeOptions,
  Platform,
  Pressable,
  StyleProp,
  TextInput,
  View,
} from "react-native";

import {TextFieldProps, TextStyleWithOutline} from "./Common";
import {FieldError, FieldHelperText, FieldTitle} from "./FieldElements";
import {Icon} from "./Icon";
import {useTheme} from "./Theme";

const keyboardMap: {[id: string]: string | undefined} = {
  date: "default",
  email: "email-address",
  number: "number-pad",
  numberRange: "number-pad",
  decimalRange: "decimal-pad",
  decimal: "decimal-pad",
  height: "default",
  password: "default",
  phoneNumber: "number-pad",
  search: "default",
  text: "default",
  url: Platform.select({
    ios: "url",
    android: "default",
  }),
  username: "default",
};

// Not an exhaustive list of all the textContent types, but the ones we use.
const textContentMap: {
  [id: string]: "none" | "emailAddress" | "password" | "username" | "URL" | undefined;
} = {
  date: "none",
  email: "emailAddress",
  number: "none",
  decimal: "none",
  decimalRange: "none",
  height: "none",
  password: "password",
  search: "none",
  text: "none",
  url: Platform.select({
    ios: "URL",
    android: "none",
  }),
  username: "username",
};

export const TextField = ({
  title,
  disabled,
  helperText,
  errorText,
  value,
  onChange,
  placeholderText,
  blurOnSubmit = true,
  height: propsHeight,
  iconName,
  onIconClick,
  type = "text",
  autoComplete,
  inputRef,
  multiline,
  rows,
  grow,
  returnKeyType,
  onBlur,
  onEnter,
  onSubmitEditing,
  onTap,
  testID,
}: TextFieldProps): ReactElement => {
  const {theme} = useTheme();

  const numberRangeActionSheetRef: React.RefObject<any> = React.createRef();
  const decimalRangeActionSheetRef: React.RefObject<any> = React.createRef();
  const weightActionSheetRef: React.RefObject<any> = React.createRef();

  const calendar = getCalendars()[0];
  const localTimeZone = calendar?.timeZone;
  if (!localTimeZone) {
    console.warn("Could not automatically determine timezone.");
  }

  const [focused, setFocused] = useState(false);
  const [height, setHeight] = useState(propsHeight || 40);

  let borderColor = focused ? theme.border.focus : theme.border.dark;
  if (disabled) {
    borderColor = theme.border.activeNeutral;
  } else if (errorText) {
    borderColor = theme.border.error;
  }

  let calculatedHeight: DimensionValue = 20;
  if (grow) {
    calculatedHeight = Math.max(40, height);
  } else if (multiline) {
    calculatedHeight = height || "100%";
  }

  const defaultTextInputStyles: StyleProp<TextStyleWithOutline> = {
    flex: 1,
    width: "100%",
    height: calculatedHeight,
    color: theme.text.primary,
    fontFamily: theme.font.primary,
    fontSize: 16,
    paddingVertical: 0,
    gap: 10,
  };

  if (Platform.OS === "web") {
    defaultTextInputStyles.outline = "none";
  }

  const isHandledByModal = [
    "date",
    "datetime",
    "time",
    "numberRange",
    "decimalRange",
    "height",
  ].includes(type);

  const isEditable = !disabled && !isHandledByModal;

  const shouldAutocorrect =
    ["text", "textarea"].includes(type) && (!autoComplete || autoComplete === "on");

  const keyboardType = keyboardMap[type];
  const textContentType = textContentMap[type || "text"];
  const Wrapper = isHandledByModal ? Pressable : View;

  return (
    <View>
      <Wrapper
        style={{
          flexDirection: "column",
          width: "100%",
        }}
        onPress={onTap}
        onTouchStart={onTap}
      >
        {title && <FieldTitle text={title} />}
        {Boolean(errorText) && errorText && <FieldError text={errorText} />}
        <Wrapper
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: disabled ? theme.surface.neutralLight : theme.surface.base,
            borderColor,
            borderWidth: focused ? 3 : 1,
            paddingHorizontal: focused ? 10 : 12,
            paddingVertical: focused ? 6 : 8,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <TextInput
            ref={(ref) => {
              if (inputRef) {
                inputRef(ref);
              }
            }}
            accessibilityHint="Enter text here"
            accessibilityLabel="Text input field"
            autoCapitalize={type === "text" ? "sentences" : "none"}
            autoCorrect={shouldAutocorrect}
            blurOnSubmit={blurOnSubmit}
            editable={isEditable}
            keyboardType={keyboardType as KeyboardTypeOptions}
            multiline={multiline}
            numberOfLines={rows || 4}
            placeholder={placeholderText}
            placeholderTextColor={theme.text.secondaryLight}
            returnKeyType={returnKeyType}
            secureTextEntry={type === "password"}
            style={defaultTextInputStyles}
            testID={testID}
            textContentType={textContentType}
            underlineColorAndroid="transparent"
            value={value}
            onBlur={() => {
              if (disabled) return;
              if (!isHandledByModal) {
                setFocused(false);
              }
              if (onBlur) {
                onBlur(value ?? "");
              }
            }}
            onChangeText={onChange}
            onContentSizeChange={(event) => {
              if (!grow) {
                return;
              }
              setHeight(event.nativeEvent.contentSize.height);
            }}
            onFocus={() => {
              if (!isHandledByModal) {
                setFocused(true);
              }
            }}
            onSubmitEditing={() => {
              if (onEnter) {
                onEnter();
              }
              if (onSubmitEditing) {
                onSubmitEditing();
              }
            }}
          />
          {Boolean(iconName) && (
            <Pressable accessibilityRole="button" onPress={onIconClick}>
              <Icon iconName={iconName!} size="md" />
            </Pressable>
          )}
        </Wrapper>
        {helperText && <FieldHelperText text={helperText} />}
      </Wrapper>
      {/* {type === "numberRange" && value && (
        <NumberPickerActionSheet
          actionSheetRef={numberRangeActionSheetRef}
          max={max || (min || 0) + 100}
          min={min || 0}
          value={value}
          onChange={(result) => onChange(result)}
        />
      )}
      {type === "decimalRange" && value && (
        <DecimalRangeActionSheet
          actionSheetRef={decimalRangeActionSheetRef}
          max={max || (min || 0) + 100}
          min={min || 0}
          value={value}
          onChange={(result) => onChange(result)}
        />
      )} */}
      {/* {type === "height" && (
        <HeightActionSheet
          actionSheetRef={weightActionSheetRef}
          value={value}
          onChange={(result) => {
            onChange(result);
          }}
        />
      )} */}
    </View>
  );
};
