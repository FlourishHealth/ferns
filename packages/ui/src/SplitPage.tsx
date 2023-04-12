import React, {Children, useCallback, useEffect, useState} from "react";
import {Dimensions, ListRenderItemInfo, ScrollView, View} from "react-native";
import {SwiperFlatList} from "react-native-swiper-flatlist";

import {Box} from "./Box";
import {SPACING, SplitPageProps} from "./Common";
import {FlatList} from "./FlatList";
import {IconButton} from "./IconButton";
import {mediaQueryLargerThan} from "./MediaQuery";
import {SegmentedControl} from "./SegmentedControl";
import {Spinner} from "./Spinner";
import {Unifier} from "./Unifier";

// A component for rendering a list on one side and a details view on the right for large screens,
// and a scrollable list where clicking an item takes you the details view.
export const SplitPage = ({
  children,
  tabs = [],
  loading = false,
  color,
  keyboardOffset,
  renderListViewItem,
  renderListViewHeader,
  renderContent,
  onSelectionChange = () => {},
  listViewData,
  listViewExtraData,
  listViewWidth,
  bottomNavBarHeight,
  showItemList,
}: SplitPageProps) => {
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [activeTabs, setActiveTabs] = useState<number[]>(tabs.length > 2 ? [0, 1] : []);
  const {width} = Dimensions.get("window");

  const isMobileDevice = !mediaQueryLargerThan("sm");

  const elementArray = Children.toArray(children);

  const onItemSelect = useCallback(
    (item: ListRenderItemInfo<any>) => {
      setSelectedId(item.index);
      onSelectionChange(item);
    },
    [onSelectionChange]
  );

  const onItemDeselect = useCallback(() => {
    setSelectedId(undefined);
    onSelectionChange(undefined);
  }, [onSelectionChange]);

  useEffect(() => {
    if (showItemList) {
      onItemDeselect();
    }
  }, [showItemList, onItemDeselect]);

  if (!children && !renderContent) {
    console.warn("A child node is required");
    return null;
  }

  if (Children.count(children) > 2 && Children.count(children) !== tabs.length) {
    console.warn("There must be a tab for each child");
    return null;
  }

  const renderItem = (itemInfo: ListRenderItemInfo<any>) => {
    return (
      <Box
        onClick={() => {
          onItemSelect(itemInfo);
        }}
      >
        {renderListViewItem(itemInfo)}
      </Box>
    );
  };

  const renderList = () => {
    return (
      <View
        style={{
          width: listViewWidth ?? 300,
          maxWidth: listViewWidth ?? 300,
          flexGrow: 1,
          flexShrink: 0,
          display: "flex",
          paddingTop: "12px",
          paddingBottom: "12px",
          flexDirection: "column",
        }}
      >
        {renderListViewHeader && renderListViewHeader()}
        <FlatList
          data={listViewData}
          extraData={listViewExtraData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
    );
  };

  const renderMobileList = () => {
    if (isMobileDevice && selectedId !== undefined) {
      return null;
    }

    return (
      <View
        style={{
          width: "100%",
          maxWidth: "100%",
          flexGrow: 1,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          // paddingBottom: bottomNavBarHeight,
        }}
      >
        {renderListViewHeader && renderListViewHeader()}
        <FlatList
          data={listViewData}
          extraData={listViewExtraData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
    );
  };

  const renderListContent = () => {
    return (
      <Box flex="grow" padding={2}>
        {renderContent && renderContent(selectedId)}
      </Box>
    );
  };

  const renderMobileListContent = () => {
    if (isMobileDevice && selectedId === undefined) {
      return null;
    }

    return (
      <Box flex="grow" padding={2}>
        {isMobileDevice && (
          <Box width="100%">
            <IconButton
              accessibilityLabel="close"
              icon="times"
              iconColor="darkGray"
              onClick={() => onItemDeselect()}
            />
          </Box>
        )}
        {renderContent && renderContent(selectedId)}
      </Box>
    );
  };

  const renderChildrenContent = () => {
    if (Array.isArray(children) && children.length > 2) {
      return (
        <View
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            alignItems: "center",
          }}
        >
          <Box paddingX={4} paddingY={2} width="100%">
            <SegmentedControl
              items={tabs}
              multiselect
              selectLimit={tabs.length}
              selectedItemIndexes={activeTabs}
              onChange={(index) => {
                setActiveTabs([...(index.activeIndex as number[])]);
              }}
            />
          </Box>
          <Box
            direction="row"
            flex="grow"
            height="100%"
            paddingX={2}
            width={activeTabs.length > 1 ? "100%" : "60%"}
          >
            {activeTabs.map((tabIndex) => {
              return (
                <ScrollView
                  key={tabIndex}
                  contentContainerStyle={{
                    flex: 1,
                  }}
                  style={{
                    flex: 1,
                    width: "60%",
                    padding: 3 * SPACING,
                    height: "100%",
                  }}
                >
                  {elementArray[tabIndex]}
                </ScrollView>
              );
            })}
          </Box>
        </View>
      );
    } else {
      return (
        <Box alignItems="center" direction="row" flex="grow" justifyContent="center" paddingX={2}>
          {elementArray.map((element, index) => {
            return (
              <ScrollView
                key={index}
                contentContainerStyle={{
                  flex: 1,
                }}
                style={{
                  flex: 1,
                  width: "60%",
                  padding: 3 * SPACING,
                  height: "100%",
                }}
              >
                {element}
              </ScrollView>
            );
          })}
        </Box>
      );
    }
  };

  const renderMobileChildrenContent = () => {
    if (selectedId === undefined) {
      return null;
    }
    return (
      <SwiperFlatList nestedScrollEnabled renderAll showPagination style={{width: "100%"}}>
        {elementArray.map((element, i) => {
          return (
            <View
              key={i}
              style={{width, height: elementArray.length > 1 ? "95%" : "100%", padding: 4}}
            >
              {element}
            </View>
          );
        })}
      </SwiperFlatList>
    );
  };

  const renderSplitPage = () => {
    return (
      <>
        {renderList()}
        {renderContent ? renderListContent() : renderChildrenContent()}
      </>
    );
  };

  const renderMobileSplitPage = () => {
    return (
      <>
        {renderMobileList()}
        {renderContent ? renderMobileListContent() : renderMobileChildrenContent()}
      </>
    );
  };

  return (
    <Box
      avoidKeyboard
      color={color || "lightGray"}
      direction="row"
      display="flex"
      // flex="grow"
      height="100%"
      keyboardOffset={keyboardOffset}
      padding={2}
      width="100%"
    >
      {loading === true && <Spinner color={Unifier.theme.darkGray as any} size="md" />}
      {Boolean(isMobileDevice) ? renderMobileSplitPage() : renderSplitPage()}
    </Box>
  );
};
