import React, {FC, useState} from "react";
import {Pressable} from "react-native";

import {InfoModalIconProps} from "./Common";
import {Heading} from "./Heading";
import {Modal} from "./Modal";

export const InfoModalIcon: FC<InfoModalIconProps> = ({
  infoModalChildren,
  infoModalSubtitle,
  infoModalText,
  infoModalTitle,
}) => {
  const [infoModalVisibleState, setInfoModalVisibleState] = useState(false);
  return (
    <>
      <Modal
        primaryButtonOnClick={() => setInfoModalVisibleState(false)}
        primaryButtonText="Close"
        size="md"
        subtitle={infoModalSubtitle}
        text={infoModalText}
        title={infoModalTitle}
        visible={infoModalVisibleState}
        onDismiss={() => setInfoModalVisibleState(false)}
      >
        {infoModalChildren}
      </Modal>
      <Pressable
        aria-role="button"
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        style={{marginLeft: 8}}
        onPress={() => setInfoModalVisibleState(true)}
      >
        <Heading color="secondaryLight" size="sm">
          ⓘ
        </Heading>
      </Pressable>
    </>
  );
};
