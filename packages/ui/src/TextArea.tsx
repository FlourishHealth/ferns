import React from "react";

import {TextAreaProps} from "./Common";
import {TextField} from "./TextField";

export function TextArea({height, ...rest}: TextAreaProps): React.ReactElement {
  return <TextField {...rest} height={height ?? 100} multiline />;
}
