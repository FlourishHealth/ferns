/* eslint-disable react-native-a11y/has-accessibility-hint */
// accessibility hint handled in IconButton.tsx

import React, {FC} from "react";

import {IconButtonProps, IconName} from "..";
import {TableIconButtonProps} from "../Common";
import {IconButton} from "../IconButton";
export const TableIconButton: FC<TableIconButtonProps> = ({tableIconButtonName, onClick}) => {
  const iconButtonMap: Record<
    string,
    {iconName: IconName; variant: IconButtonProps["variant"]; accessibilityLabel: string}
  > = {
    edit: {iconName: "pen-to-square", variant: "muted", accessibilityLabel: "Edit"},
    saveAndClose: {iconName: "check", variant: "secondary", accessibilityLabel: "Save and close"},
    insert: {iconName: "plus", variant: "primary", accessibilityLabel: "Insert Data"},
    drawerOpen: {
      iconName: "chevron-down",
      variant: "muted",
      accessibilityLabel: "Open Drawer for more Data",
    },
    drawerClose: {
      iconName: "chevron-up",
      variant: "secondary",
      accessibilityLabel: "Close Drawer for more Data",
    },
  };

  return (
    <IconButton
      accessibilityLabel={iconButtonMap[tableIconButtonName].accessibilityLabel}
      iconName={iconButtonMap[tableIconButtonName].iconName}
      variant={iconButtonMap[tableIconButtonName].variant}
      onClick={onClick}
    />
  );
};
