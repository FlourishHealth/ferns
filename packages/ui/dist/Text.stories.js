import React from "react";
import { Box } from "./Box";
import { Text } from "./Text";
import { storiesOf } from "@storybook/react-native";
import { StorybookContainer } from "./StorybookContainer";
function renderText(text, props) {
    return (React.createElement(Box, { width: "100%", paddingY: 1 },
        React.createElement(Text, Object.assign({}, props), text)));
}
storiesOf("Text", module)
    .add("Texts", () => (React.createElement(StorybookContainer, null,
    React.createElement(Box, { width: "100%", height: "100%", display: "flex", direction: "column" },
        renderText("default", {}),
        renderText("small", { size: "sm" }),
        renderText("large", { size: "lg" }),
        renderText("gray", { color: "gray" }),
        renderText("lightGray", { color: "lightGray" }),
        renderText("primary", { color: "primary" }),
        renderText("secondary", { color: "secondary" }),
        renderText("tertiary", { color: "tertiary" }),
        renderText("accent", { color: "accent" }),
        renderText("red", { color: "red" }),
        renderText("bold", { weight: "bold" }),
        renderText("italic", { italic: true }),
        renderText("center", { align: "center" })))))
    .add("Truncate", () => (React.createElement(StorybookContainer, null,
    React.createElement(Box, { maxWidth: 160 },
        React.createElement(Box, { marginBottom: 2 },
            React.createElement(Text, { weight: "bold" }, "normal:"),
            React.createElement(Text, { overflow: "normal" }, "This is a long and Supercalifragilisticexpialidocious sentence. \u6B21\u306E\u5358\u8A9E\u30B0\u30EC\u30FC\u30C8\u30D6\u30EA\u30C6\u30F3\u304A\u3088\u3073\u5317\u30A2\u30A4\u30EB\u30E9\u30F3\u30C9\u9023\u5408\u738B\u56FD\u3067\u672C\u5F53\u306B\u5927\u304D\u306A\u8A00\u8449'")),
        React.createElement(Box, { marginBottom: 2 },
            React.createElement(Text, { weight: "bold" }, "breakWord:"),
            React.createElement(Text, { overflow: "breakWord" }, "This is a long and Supercalifragilisticexpialidocious sentence. \u6B21\u306E\u5358\u8A9E\u30B0\u30EC\u30FC\u30C8\u30D6\u30EA\u30C6\u30F3\u304A\u3088\u3073\u5317\u30A2\u30A4\u30EB\u30E9\u30F3\u30C9\u9023\u5408\u738B\u56FD\u3067\u672C\u5F53\u306B\u5927\u304D\u306A\u8A00\u8449 \uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57'")),
        React.createElement(Box, { marginBottom: 2 },
            React.createElement(Text, { weight: "bold" }, "truncate:"),
            React.createElement(Text, { truncate: true }, "This is a long and Supercalifragilisticexpialidocious sentence. \u6B21\u306E\u5358\u8A9E\u30B0\u30EC\u30FC\u30C8\u30D6\u30EA\u30C6\u30F3\u304A\u3088\u3073\u5317\u30A2\u30A4\u30EB\u30E9\u30F3\u30C9\u9023\u5408\u738B\u56FD\u3067\u672C\u5F53\u306B\u5927\u304D\u306A\u8A00\u8449 \uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57\uFF57'"))))));
//# sourceMappingURL=Text.stories.js.map