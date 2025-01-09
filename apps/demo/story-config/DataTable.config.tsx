import {DemoConfiguration} from "@config";
import {DataTable} from "ferns-ui";

import {StandardDataTable} from "../stories";

export const DataTableConfiguration: DemoConfiguration = {
  name: "DataTable",
  component: DataTable,
  related: [],
  description:
    "DataTable takes arrays of arrays of data and handles them correctly to build a table. It supports pinnable columns unlike Table, but is less flexible.",
  a11yNotes: [
    "Use a label to announce the content of the table.",
    "Don’t include the word 'table' in that label, as it’s redundant.",
    "The tab key should place focus on interactive elements, including sortable headers.",
  ],
  category: "Pattern",
  status: {
    documentation: "ready",
    figma: "ready",
    figmaLink:
      "https://www.figma.com/file/ykXj5qjjtFjOYkAvTasu9r/Flourish-Health-Design-System?type=design&node-id=656%3A24283&mode=design&t=iCiJI3xbrm6rrXPg-1",
    ios: "ready",
    android: "ready",
    web: "ready",
  },
  additionalDocumentation: [{name: "NN/g article", link: "https://www.nngroup.com/articles/"}],
  interfaceName: "DataTableProps",
  usage: {
    do: [
      "Display structured data in a scannable way.",
      "Allow users to compare information in rows and columns.",
      "Keep scannability in mind whenever designing new components for this pattern.",
    ],
    doNot: [
      "Don’t use this if there will never be enough data to populate more than two rows.",
      "Display content that can’t be reasonably sorted and compared.",
    ],
  },
  props: {},
  demo: StandardDataTable,
  demoOptions: {},
  stories: {
    StandardDataTable: {render: StandardDataTable},
  },
};
