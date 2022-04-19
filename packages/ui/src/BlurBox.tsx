import React from "react";

import {Box} from "./Box";
import {BlurBoxProps} from "./Common";
import {mergeInlineStyles} from "./Utilities";

export class BlurBox extends React.Component<BlurBoxProps, {}> {
  render() {
    const {marginBottom, marginTop, margin, ...props} = this.props;

    return (
      <Box
        {...this.props}
        dangerouslySetInlineStyle={mergeInlineStyles(this.props.dangerouslySetInlineStyle, {
          // filter: "blur(4px)",
          backdropFilter: "blur(4px)",
          backgroundColor: "#111",
          opacity: 0.8,
          borderRadius: 12,
        })}
        margin={margin || 0}
        marginBottom={marginBottom || 4}
        marginTop={marginTop || 0}
      >
        <Box paddingX={4} {...props}>
          {this.props.children}
        </Box>
      </Box>
    );
  }
}
