import {Box, Button, CellData, DataTable, DataTableColumn, Text} from "ferns-ui";
import React, {useState} from "react";

const CustomColumnComponent: React.FC<{column: DataTableColumn; cellData: CellData}> = ({
  cellData,
}) => {
  return <Text>Custom: {cellData?.value.text}</Text>;
};

const MoreModalContent: React.FC<{column: DataTableColumn; rowData: any[]; rowIndex: number}> = ({
  rowIndex,
}) => {
  return (
    <Box paddingY={8}>
      <Text>Drawer contents for row {rowIndex}</Text>
      <Button text="Console.log()" onClick={() => console.info("Button clicked")} />
    </Box>
  );
};

export const StandardDataTable = (): React.ReactElement => {
  const [allRows] = useState([
    [
      {value: "Data 1 has some data in it"},
      {value: "Data 2 has some longer data in it"},
      {value: 5, highlight: "successLight"},
      {value: 1000.4, highlight: "errorLight"},
      {value: "2024-01-01", highlight: "warningLight"},
      {value: true, highlight: "successLight"},
      {value: {text: "Custom text"}},
    ],
    [
      {value: "Row 2 short"},
      {value: "Row 2 long"},
      {value: 10},
      {value: 2000.0},
      {value: "2024-01-02"},
      {value: false},
      {value: {text: "Custom text"}},
    ],
    [
      {
        value:
          "Row 3 very long, lots of overflow here, wow is this still going? I hope it all fits!",
        highlight: "warningLight",
      },
      {value: "Row 3 long"},
      {value: 1},
      {value: 2},
      {value: "2024-01-03"},
      {value: true},
      {value: {text: "Custom text"}},
    ],
    [
      {value: "Row 4"},
      {value: "Row 4"},
      {value: 1},
      {value: 2},
      {value: "2024-01-04"},
      {value: false},
      {value: {text: "Custom text"}},
    ],
    [
      {value: "Row 5", highlight: "error"},
      {value: "Row 5"},
      {value: 1},
      {value: 2},
      {value: "2024-01-05"},
      {value: true},
      {value: {text: "Custom text"}},
    ],
    [
      {value: "Row 6"},
      {value: "Row 6"},
      {value: 1},
      {value: 2},
      {value: "2024-01-06"},
      {value: false},
      {value: {text: "Custom text"}},
    ],
    [
      {value: "Row 7"},
      {value: "Row 7"},
      {value: 1},
      {value: 2},
      {value: "2024-01-07"},
      {value: true},
      {value: {text: "Custom text"}},
    ],
    [
      {value: "Row 8"},
      {value: "Row 8"},
      {value: 1},
      {value: 2},
      {value: "2024-01-08"},
      {value: false},
      {value: {text: "Custom text"}},
    ],
    [
      {value: "Row 9"},
      {value: "Row 9"},
      {value: 1},
      {value: 2},
      {value: "2024-01-09"},
      {value: true},
      {value: {text: "Custom text"}},
    ],
    [
      {value: "Row 10"},
      {value: "Row 10"},
      {value: 1},
      {value: 2},
      {value: "2024-01-10"},
      {value: false},
      {value: {text: "Custom text"}},
    ],
    [
      {value: "Row 11"},
      {value: "Row 11"},
      {value: 1},
      {value: 2},
      {value: "2024-01-11"},
      {value: true},
      {value: {text: "Custom text"}},
    ],
    [
      {value: "Row 12"},
      {value: "Row 12"},
      {value: 1},
      {value: 2},
      {value: "2024-01-12"},
      {value: false},
      {value: {text: "Custom text"}},
    ],
    [
      {value: "Row 13"},
      {value: "Row 13"},
      {value: 1},
      {value: 2},
      {value: "2024-01-13"},
      {value: false},
      {value: {text: "Custom text"}},
    ],
    [
      {value: "Row 14"},
      {value: "Row 14"},
      {value: 1},
      {value: 2},
      {value: "2024-01-14"},
      {value: true},
      {value: {text: "Custom text"}},
    ],
    [
      {value: "Row 15"},
      {value: "Row 15"},
      {value: 1},
      {value: 2},
      {value: "2024-01-15"},
      {value: false},
      {value: {text: "Custom text"}},
    ],
  ]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const rows = allRows.slice((page - 1) * rowsPerPage, page * rowsPerPage) as CellData[][];

  const [sortColumn, setSortColumn] = useState<
    {column: number; direction: "asc" | "desc"} | undefined
  >();

  const columns: DataTableColumn[] = [
    {
      title: "Column 1",
      width: 200,
      columnType: "text",
      sortable: true,
      infoModalText: `# This is a tooltip\n\nHello, this is some *italic text* and **bold text**.`,
    },
    {title: "Column 2", width: 200, columnType: "text", sortable: false},
    {title: "Column 3", width: 200, columnType: "number", sortable: true},
    {title: "Column 4", width: 200, columnType: "number", sortable: false},
    {title: "Column 5", width: 200, columnType: "date", sortable: true},
    {title: "Checked", width: 200, columnType: "boolean", sortable: false},
    {title: "Custom", width: 200, columnType: "custom", sortable: false},
  ];

  return (
    <Box color="base" direction="column" height="100%" maxHeight={400} maxWidth={600} scroll>
      <DataTable
        alternateRowBackground
        columns={columns}
        customColumnComponentMap={{custom: CustomColumnComponent}}
        data={rows}
        defaultTextSize="sm"
        moreContentComponent={MoreModalContent}
        page={page}
        pinnedColumns={1}
        rowHeight={80}
        setPage={setPage}
        setSortColumn={setSortColumn}
        sortColumn={sortColumn}
        totalPages={Math.ceil(allRows.length / rowsPerPage)}
      />
    </Box>
  );
};
