import React from "react";
import { Box } from "./Box";
import { Icon, IconExpo } from "./Icon";
import { storiesOf } from "@storybook/react-native";
import { StorybookContainer } from "./StorybookContainer";
storiesOf("Icon", module)
    .add("Solid Icons", () => (React.createElement(StorybookContainer, null,
    React.createElement(Box, { width: "100%", height: "100%", display: "flex", direction: "row", justifyContent: "between" },
        React.createElement(IconExpo, { prefix: "fas", name: "heart" }),
        React.createElement(Icon, { prefix: "fas", name: "plus" }),
        React.createElement(Icon, { prefix: "fas", name: "edit" })))))
    .add("Regular Icons", () => (React.createElement(StorybookContainer, null,
    React.createElement(Box, { width: "100%", height: "100%", display: "flex", direction: "row", justifyContent: "between" },
        React.createElement(Icon, { prefix: "far", name: "heart" }),
        React.createElement(Icon, { prefix: "far", name: "plus" }),
        React.createElement(Icon, { prefix: "far", name: "edit" }),
        React.createElement(Icon, { prefix: "far", name: "heart" })))))
    .add("Icon Sizes", () => (React.createElement(StorybookContainer, null,
    React.createElement(Box, { width: "100%", height: "100%", display: "flex", direction: "row", justifyContent: "between" },
        React.createElement(Icon, { prefix: "fas", name: "heart", size: 8 }),
        React.createElement(Icon, { prefix: "far", name: "heart", size: 8 }),
        React.createElement(Icon, { prefix: "fas", name: "heart", size: 12 }),
        React.createElement(Icon, { prefix: "far", name: "heart", size: 12 }),
        React.createElement(Icon, { prefix: "fas", name: "heart", size: 15 }),
        React.createElement(Icon, { prefix: "far", name: "heart", size: 15 }),
        React.createElement(Icon, { prefix: "fas", name: "heart", size: 22 }),
        React.createElement(Icon, { prefix: "far", name: "heart", size: 22 }),
        React.createElement(Icon, { prefix: "fas", name: "heart", size: 28 }),
        React.createElement(Icon, { prefix: "far", name: "heart", size: 28 })))));
//# sourceMappingURL=Icon.stories.js.map