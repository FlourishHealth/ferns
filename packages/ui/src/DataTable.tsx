import {FontAwesome6} from "@expo/vector-icons";
import React, {useCallback, useMemo, useRef, useState} from "react";
import {NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, View} from "react-native";
// @ts-ignore
import Markdown from "react-native-markdown-display";

import {Box} from "./Box";
import {
  ColumnSortInterface,
  DataTableCellData,
  DataTableCellProps,
  DataTableColumn,
  DataTableCustomComponentMap,
  DataTableProps,
  SurfaceColor,
} from "./Common";
import {Icon} from "./Icon";
import {InfoModalIcon} from "./InfoModalIcon";
import {Modal} from "./Modal";
import {Pagination} from "./Pagination";
import {TableTitle} from "./table/TableTitle";
import {Text} from "./Text";
import {useTheme} from "./Theme";

const TextCell: React.FC<{
  cellData: {value: string; textSize?: "sm" | "md" | "lg"};
  column: DataTableColumn;
}> = ({cellData}) => {
  return (
    <Box flex="grow" justifyContent="center" paddingX={2}>
      <Text size={cellData.textSize || "md"}>{cellData.value}</Text>
    </Box>
  );
};

const CheckedCell: React.FC<{cellData: {value: boolean}; column: DataTableColumn}> = ({
  cellData,
}) => {
  return (
    <Box flex="grow" justifyContent="center" width="100%">
      <Icon
        color={cellData.value ? "success" : "secondaryDark"}
        iconName={cellData.value ? "check" : "x"}
      />
    </Box>
  );
};

const DataTableCell: React.FC<DataTableCellProps> = ({
  value,
  columnDef,
  colIndex,
  isPinnedHorizontal,
  pinnedColumns,
  columnWidths,
  customColumnComponentMap,
  backgroundColor,
  height,
  textSize = "md",
}) => {
  const {theme} = useTheme();
  const isLastPinnedColumn = isPinnedHorizontal && colIndex === pinnedColumns - 1;

  // Default to TextCell
  let Component: React.ComponentType<{
    column: DataTableColumn;
    cellData: {value: any; highlight?: SurfaceColor};
  }> = TextCell;
  if (customColumnComponentMap?.[columnDef.columnType]) {
    Component = customColumnComponentMap[columnDef.columnType];
  } else if (columnDef.columnType === "boolean") {
    Component = CheckedCell;
  }

  return (
    <View
      style={{
        padding: 16,
        justifyContent: "center",
        height,
        width: columnDef.width,
        backgroundColor,
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.default,
        // For pinned columns: use absolute positioning to stay fixed while scrolling horizontally
        ...(isPinnedHorizontal && {
          position: "absolute",
          // Position each pinned column by summing widths of all previous columns
          left: columnWidths.slice(0, colIndex).reduce((sum, width) => sum + width, 0),
          // Higher z-index keeps pinned columns above scrollable ones, decreasing by column index
          zIndex: 10 - colIndex,
        }),
        // Visual separator after last pinned column
        ...(isLastPinnedColumn && {
          borderRightWidth: 3,
          borderRightColor: theme.border.default,
        }),
      }}
    >
      <Component cellData={{...value, textSize}} column={columnDef} />
    </View>
  );
};

interface DataTableRowProps {
  rowData: DataTableCellData[];
  rowIndex: number;
  columns: DataTableColumn[];
  pinnedColumns: number;
  columnWidths: number[];
  alternateRowBackground: boolean;
  customColumnComponentMap?: DataTableCustomComponentMap;
  rowHeight: number;
}

const DataTableRow: React.FC<DataTableRowProps> = ({
  rowData,
  rowIndex,
  columns,
  pinnedColumns,
  columnWidths,
  alternateRowBackground,
  customColumnComponentMap,
  rowHeight,
}) => {
  const {theme} = useTheme();
  const backgroundColor =
    alternateRowBackground && rowIndex % 2 === 1 ? theme.surface.neutralLight : theme.surface.base;

  return (
    <View
      style={{
        flexDirection: "row",
        height: rowHeight,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.default,
      }}
    >
      {rowData.map((cell, colIndex) => (
        <DataTableCell
          key={colIndex}
          backgroundColor={
            cell.highlight ? theme.surface[cell.highlight as SurfaceColor] : backgroundColor
          }
          colIndex={colIndex}
          columnDef={columns[colIndex]}
          columnWidths={columnWidths}
          customColumnComponentMap={customColumnComponentMap}
          height={rowHeight}
          isPinnedHorizontal={colIndex < pinnedColumns}
          pinnedColumns={pinnedColumns}
          textSize={cell.textSize}
          value={cell}
        />
      ))}
    </View>
  );
};

interface MoreButtonCellProps {
  rowIndex: number;
  alternateRowBackground: boolean;
  onClick: (rowIndex: number) => void;
  column: DataTableColumn;
  rowHeight: number;
}

const MoreButtonCell: React.FC<MoreButtonCellProps> = ({
  rowIndex,
  alternateRowBackground,
  onClick,
  rowHeight,
}) => {
  const {theme} = useTheme();

  return (
    <View
      style={{
        width: 48,
        height: rowHeight ?? 54,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:
          alternateRowBackground && rowIndex % 2 === 1
            ? theme.surface.neutralLight
            : theme.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.default,
      }}
    >
      <Pressable
        accessibilityHint="View details"
        accessibilityLabel="Open modal"
        accessibilityRole="button"
        style={{
          borderRadius: theme.radius.rounded,
          backgroundColor:
            alternateRowBackground && rowIndex % 2 === 1
              ? theme.surface.base
              : theme.surface.neutralLight,
          width: 32,
          height: 32,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => onClick(rowIndex)}
      >
        <Icon color="secondaryDark" iconName="info" size="md" />
      </Pressable>
    </View>
  );
};

interface DataTableHeaderCellProps {
  column: DataTableColumn;
  index: number;
  isPinnedHorizontal: boolean;
  isPinnedRow?: boolean;
  columnWidths: number[];
  sortColumn?: ColumnSortInterface;
  onSort: (index: number) => void;
  rowHeight: number;
}

const DataTableHeaderCell: React.FC<DataTableHeaderCellProps> = ({
  column,
  index,
  isPinnedHorizontal,
  columnWidths,
  sortColumn,
  onSort,
  rowHeight,
}) => {
  const {theme} = useTheme();
  const sort = sortColumn?.column === index ? sortColumn.direction : undefined;

  return (
    <View
      style={{
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: rowHeight ?? 54,
        width: column.width,
        backgroundColor: theme.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.default,
        ...(isPinnedHorizontal && {
          position: "absolute",
          left: columnWidths.slice(0, index).reduce((sum, width) => sum + width, 0),
          zIndex: 10 - index,
        }),
      }}
    >
      {Boolean(column.title) && <TableTitle align="left" title={column.title!} />}
      <View style={{flexDirection: "row", alignItems: "center"}}>
        {column.infoModalText && (
          <InfoModalIcon infoModalChildren={<Markdown>{column.infoModalText}</Markdown>} />
        )}
        {column.sortable && (
          <Pressable hitSlop={16} onPress={() => onSort(index)}>
            <View
              style={{
                alignItems: "center",
                backgroundColor: sort ? theme.surface.primary : theme.surface.neutralLight,
                borderRadius: theme.radius.rounded,
                justifyContent: "center",
                height: 16,
                width: 16,
                marginLeft: 8,
              }}
            >
              <FontAwesome6
                color={theme.text.inverted}
                name={
                  sort === "asc" ? "arrow-down" : sort === "desc" ? "arrow-up" : "arrows-up-down"
                }
                selectable={undefined}
                size={10}
                solid
              />
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
};

interface DataTableHeaderProps {
  columns: DataTableColumn[];
  hasMoreContent: boolean;
  pinnedColumns: number;
  columnWidths: number[];
  headerScrollRef: React.RefObject<ScrollView>;
  sortColumn?: ColumnSortInterface;
  onSort: (index: number) => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>, isHeader: boolean) => void;
  rowHeight: number;
}

const DataTableHeader: React.FC<DataTableHeaderProps> = ({
  columns,
  hasMoreContent,
  pinnedColumns,
  columnWidths,
  headerScrollRef,
  sortColumn,
  onSort,
  onScroll,
  rowHeight,
}) => {
  const {theme} = useTheme();

  return (
    <View style={{flexDirection: "row", position: "relative"}}>
      {/* Fixed-width container for "more" content button if present */}
      {hasMoreContent && (
        <View
          style={{
            width: 48,
            height: rowHeight ?? 54,
            backgroundColor: theme.surface.base,
            borderBottomWidth: 1,
            borderBottomColor: theme.border.default,
            zIndex: 11,
          }}
        />
      )}

      {/* Container for pinned header columns - stays fixed during horizontal scroll */}
      {pinnedColumns > 0 && (
        <View
          style={{
            position: "absolute",
            // Offset left position if there's a "more" content button
            left: hasMoreContent ? 48 : 0,
            top: 0,
            zIndex: 10,
          }}
        >
          {columns.slice(0, pinnedColumns).map((column, index) => (
            <DataTableHeaderCell
              key={`pinned-header-${index}`}
              column={column}
              columnWidths={columnWidths}
              index={index}
              isPinnedHorizontal
              rowHeight={rowHeight}
              sortColumn={sortColumn}
              onSort={onSort}
            />
          ))}
        </View>
      )}

      {/* Scrollable container for non-pinned header columns */}
      <ScrollView
        ref={headerScrollRef}
        horizontal
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        style={{
          // Offset scrollable area by total width of pinned columns
          marginLeft: columnWidths.slice(0, pinnedColumns).reduce((sum, width) => sum + width, 0),
        }}
        onScroll={(e) => onScroll(e, true)}
      >
        {columns.slice(pinnedColumns).map((column, index) => (
          <DataTableHeaderCell
            key={`scrollable-header-${index + pinnedColumns}`}
            column={column}
            columnWidths={columnWidths}
            index={index + pinnedColumns}
            isPinnedHorizontal={false}
            rowHeight={rowHeight}
            sortColumn={sortColumn}
            onSort={onSort}
          />
        ))}
      </ScrollView>
    </View>
  );
};

interface DataTableContentProps {
  data: any[][];
  columns: DataTableColumn[];
  pinnedColumns: number;
  alternateRowBackground: boolean;
  columnWidths: number[];
  bodyScrollRef: React.RefObject<ScrollView>;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>, isHeader: boolean) => void;
  moreContentComponent?: React.ComponentType<{
    column: DataTableColumn;
    rowData: any[];
    rowIndex: number;
  }>;
  // Extra props to pass to the more modal, one per row.
  moreContentExtraData?: any[];
  moreContentSize?: "sm" | "md" | "lg";
  customColumnComponentMap?: DataTableCustomComponentMap;
  rowHeight: number;
}

const DataTableContent: React.FC<DataTableContentProps> = ({
  data,
  columns,
  pinnedColumns,
  alternateRowBackground,
  columnWidths,
  bodyScrollRef,
  onScroll,
  customColumnComponentMap,
  moreContentComponent: MoreContentContent,
  moreContentExtraData,
  moreContentSize = "md",
  rowHeight,
}) => {
  const [modalRow, setModalRow] = useState<number | null>(null);
  const {theme} = useTheme();

  return (
    <>
      <ScrollView style={{flex: 1}}>
        <View
          style={{
            flexDirection: "row",
            position: "relative",
          }}
        >
          {/* Fixed-width container for "more" content button if present */}
          {Boolean(MoreContentContent) && (
            <View
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 48,
                zIndex: 1,
                backgroundColor: theme.surface.base,
              }}
            >
              {data.map((_, rowIndex) => (
                <MoreButtonCell
                  key={`expand-${rowIndex}`}
                  alternateRowBackground={alternateRowBackground}
                  column={columns[0]}
                  rowHeight={rowHeight}
                  rowIndex={rowIndex}
                  onClick={setModalRow}
                />
              ))}
            </View>
          )}

          {/* Container for pinned rows - stays fixed during horizontal scroll */}
          {pinnedColumns > 0 && (
            <View
              style={{
                position: "absolute",
                left: Boolean(MoreContentContent) ? 48 : 0,
                top: 0,
                zIndex: 10,
              }}
            >
              {data.map((row, rowIndex) => (
                <DataTableRow
                  key={`pinned-${rowIndex}`}
                  alternateRowBackground={alternateRowBackground}
                  columnWidths={columnWidths}
                  columns={columns.slice(0, pinnedColumns)}
                  customColumnComponentMap={customColumnComponentMap}
                  pinnedColumns={pinnedColumns}
                  rowData={row.slice(0, pinnedColumns)}
                  rowHeight={rowHeight}
                  rowIndex={rowIndex}
                />
              ))}
            </View>
          )}

          {/* Scrollable container for non-pinned rows */}
          <ScrollView
            ref={bodyScrollRef}
            horizontal
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            style={{
              flex: 1,
              marginLeft:
                columnWidths.slice(0, pinnedColumns).reduce((sum, width) => sum + width, 0) +
                (Boolean(MoreContentContent) ? 48 : 0),
            }}
            onScroll={(e) => onScroll(e, false)}
          >
            <View>
              {data.map((row, rowIndex) => (
                <DataTableRow
                  key={`scrollable-${rowIndex}`}
                  alternateRowBackground={alternateRowBackground}
                  columnWidths={columnWidths}
                  columns={columns.slice(pinnedColumns)}
                  customColumnComponentMap={customColumnComponentMap}
                  pinnedColumns={0}
                  rowData={row.slice(pinnedColumns)}
                  rowHeight={rowHeight}
                  rowIndex={rowIndex}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {MoreContentContent && (
        <Modal
          size={moreContentSize}
          visible={modalRow !== null}
          onDismiss={() => setModalRow(null)}
        >
          <MoreContentContent
            column={columns[0]}
            rowData={data[modalRow!]}
            rowIndex={modalRow!}
            {...(moreContentExtraData?.[modalRow!] ?? {})}
          />
        </Modal>
      )}
    </>
  );
};

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  alternateRowBackground = true,
  totalPages = 1,
  page = 0,
  setPage,
  pinnedColumns = 0,
  sortColumn,
  setSortColumn,
  moreContentComponent,
  moreContentExtraData,
  customColumnComponentMap,
  rowHeight = 54,
  defaultTextSize = "md",
}) => {
  const {theme} = useTheme();
  const headerScrollRef = useRef<ScrollView>(null);
  const bodyScrollRef = useRef<ScrollView>(null);

  const columnWidths = useMemo(() => columns.map((col) => col.width), [columns]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>, isHeader: boolean) => {
      const scrollX = event.nativeEvent.contentOffset.x;
      if (isHeader && bodyScrollRef.current) {
        bodyScrollRef.current.scrollTo({x: scrollX, animated: false});
      } else if (!isHeader && headerScrollRef.current) {
        headerScrollRef.current.scrollTo({x: scrollX, animated: false});
      }
    },
    []
  );

  const handleSort = useCallback(
    (columnIndex: number) => {
      if (!setSortColumn || !columns[columnIndex].sortable) {
        return;
      }

      if (sortColumn?.column === columnIndex) {
        if (sortColumn.direction === "asc") {
          setSortColumn({
            column: columnIndex,
            direction: "desc",
          });
        } else {
          setSortColumn(undefined);
        }
      } else {
        setSortColumn({
          column: columnIndex,
          direction: "asc",
        });
      }
    },
    [sortColumn, setSortColumn, columns]
  );

  const processedData = useMemo(() => {
    return data.map((row) =>
      row.map((cell) => ({
        ...cell,
        textSize: cell.textSize || defaultTextSize,
      }))
    );
  }, [data, defaultTextSize]);

  return (
    <View style={{height: "100%", display: "flex", flexDirection: "column"}}>
      <View
        style={{
          flex: 1,
          minHeight: 0,
          borderWidth: 1,
          borderColor: theme.border.default,
          height: "100%",
        }}
      >
        <DataTableHeader
          columnWidths={columnWidths}
          columns={columns}
          hasMoreContent={Boolean(moreContentComponent)}
          headerScrollRef={headerScrollRef}
          pinnedColumns={pinnedColumns}
          rowHeight={rowHeight}
          sortColumn={sortColumn}
          onScroll={handleScroll}
          onSort={handleSort}
        />

        <View style={{flex: 1, minHeight: 0}}>
          <DataTableContent
            alternateRowBackground={alternateRowBackground}
            bodyScrollRef={bodyScrollRef}
            columnWidths={columnWidths}
            columns={columns}
            customColumnComponentMap={customColumnComponentMap}
            data={processedData}
            moreContentComponent={moreContentComponent}
            moreContentExtraData={moreContentExtraData}
            pinnedColumns={pinnedColumns}
            rowHeight={rowHeight}
            onScroll={handleScroll}
          />
        </View>
      </View>

      {Boolean(setPage && totalPages > 1) && (
        <View
          style={{
            height: 60,
            padding: 16,
            alignItems: "center",
          }}
        >
          <Pagination page={page} setPage={setPage!} totalPages={totalPages} />
        </View>
      )}
    </View>
  );
};
