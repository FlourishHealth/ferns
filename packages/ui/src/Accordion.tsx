import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React, {FC, useEffect, useState} from "react";
import {Pressable, View} from "react-native";

import {AccordionProps} from "./Common";
import {Heading} from "./Heading";
import {InfoModalIcon} from "./InfoModalIcon";
import {Text} from "./Text";
import {useTheme} from "./Theme";

export const Accordion: FC<AccordionProps> = ({
  children,
  isCollapsed = false,
  title,
  subtitle,
  includeInfoModal = false,
  infoModalChildren,
  infoModalSubtitle,
  infoModalText,
  infoModalTitle,
}) => {
  const {theme} = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  // The external collapse state should override the internal collapse state.
  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  return (
    <View
      style={{
        padding: 16,
        borderBottomColor: theme.border.default,
        borderTopColor: theme.border.default,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        width: "100%",
      }}
    >
      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <View style={{flexDirection: "column", gap: 4}}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Heading>{title}</Heading>
            {includeInfoModal && infoModalTitle && (
              <InfoModalIcon
                infoModalChildren={infoModalChildren}
                infoModalSubtitle={infoModalSubtitle}
                infoModalText={infoModalText}
                infoModalTitle={infoModalTitle}
              />
            )}
          </View>
          {subtitle && <Text>{subtitle}</Text>}
        </View>
        <View>
          <Pressable
            aria-role="button"
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            onPress={() => setCollapsed(!collapsed)}
          >
            <FontAwesome6
              color={theme.text.link}
              name={collapsed ? "chevron-down" : "chevron-up"}
              selectable={undefined}
              size={16}
            />
          </Pressable>
        </View>
      </View>
      {collapsed ? null : <View style={{marginTop: 8}}>{children}</View>}
    </View>
  );
};
