import React from "react";
import {Platform} from "react-native";

import {FieldWithLabelsProps, StyleProp} from "./Common";
import {Icon} from "./Icon";
import {RNPickerSelect} from "./PickerSelect";
import {Unifier} from "./Unifier";
import {WithLabel} from "./WithLabel";

// Use "" if you want to have an "unset" value.
export type SelectListOptions = {label: string; value: string}[];
export interface SelectListProps extends FieldWithLabelsProps {
  id?: string;
  name?: string;
  options: SelectListOptions;
  onChange: (value: string) => void;
  value?: string;
  disabled?: boolean;
  size?: "md" | "lg";
  // TODO: Implement placeholder prop for Select Field for both Android and iOS
  placeholder?: string;
  style?: StyleProp;
}

export function SelectList({
  options,
  value,
  onChange,
  label,
  labelColor,
  style,
  placeholder,
}: SelectListProps) {
  const withLabelProps = {label, labelColor};

  return (
    <WithLabel {...withLabelProps}>
      <RNPickerSelect
        // Icon only needed for iOs, web and android use default icons
        Icon={() => {
          return Platform.OS === "ios" ? (
            <Icon color="darkGray" name="angle-down" size="md" />
          ) : null;
        }}
        items={options}
        placeholder={placeholder ? {label: placeholder, value: ""} : {}}
        style={{
          viewContainer: {
            flexDirection: style?.flexDirection || "row",
            justifyContent: style?.justifyContent || "center",
            alignItems: style?.alignItems || "center",
            minHeight: style?.minHeight || 50,
            width: style?.width || "100%",
            borderColor: style?.borderColor || Unifier.theme.gray,
            borderWidth: style?.borderWidth || 1,
            borderRadius: style?.borderRadius || 5,
            backgroundColor: style?.backgroundColor || Unifier.theme.white,
          },
          inputIOS: {
            paddingVertical: 12,
            paddingHorizontal: 10,
            paddingRight: 30,
          },
          iconContainer: {
            top: 13,
            right: 10,
            bottom: 12,
            paddingLeft: 40,
          },
          inputWeb: {
            // Add padding so the border doesn't mess up layouts
            paddingHorizontal: style?.paddingHorizontal || 6,
            paddingVertical: style?.paddingVertical || 4,
            borderRadius: style?.borderRadius || 5,
          },
        }}
        value={value}
        onValueChange={onChange}
      />
    </WithLabel>
  );
}
