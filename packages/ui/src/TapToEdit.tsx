import React, {ReactElement, useState} from "react";

import {Box} from "./Box";
import {Button} from "./Button";
import {BoxProps} from "./Common";
import {Field, FieldProps} from "./Field";
import {Icon} from "./Icon";
import {Text} from "./Text";

export interface TapToEditProps extends Omit<FieldProps, "handleChange" | "value"> {
  title: string;
  initialValue: any;
  // Not required if not editable.
  onSave?: (value: any) => void | Promise<void>;
  // Defaults to true
  editable?: boolean;
  // For changing how the non-editing row renders
  rowBoxProps?: Partial<BoxProps>;
  transform?: (value: any) => string;
  fieldComponent?: (setValue: () => void) => ReactElement;
}

export const TapToEdit = ({
  initialValue,
  title,
  onSave,
  editable,
  rowBoxProps,
  transform,
  fieldComponent,
  ...fieldProps
}: TapToEditProps): ReactElement => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  if (editing) {
    return (
      <Box direction="column">
        {fieldComponent ? (
          fieldComponent(setValue as any)
        ) : (
          <Field label={title} setValue={setValue} {...fieldProps} />
        )}
        <Box direction="row">
          <Button
            color="blue"
            inline
            text="Save"
            onClick={async (): Promise<void> => {
              if (!onSave) {
                console.error("No onSave provided for editable TapToEdit");
              } else {
                await onSave(value);
              }
              setEditing(false);
            }}
          />
          <Box marginLeft={2}>
            <Button
              color="red"
              inline
              text="Cancel"
              onClick={(): void => {
                setEditing(false);
              }}
            />
          </Box>
        </Box>
      </Box>
    );
  } else {
    let displayValue = initialValue;
    // If a transform props is present, that takes priority
    if (transform) {
      displayValue = transform(initialValue);
    } else {
      // If no transform, try and display the value reasonably.
      if (fieldProps?.type === "boolean") {
        displayValue = value ? "Yes" : "No";
      } else if (fieldProps?.type === "percent") {
        // Prevent floating point errors from showing up by using parseFloat and precision. Pass through parseFloat again
        // to trim off insignificant zeroes.
        displayValue = `${parseFloat(parseFloat(String(value * 100)).toPrecision(7))}%`;
      } else if (fieldProps?.type === "currency") {
        // TODO: support currencies other than USD in Field and related components.
        const formatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        });
        displayValue = formatter.format(value);
      } else if (fieldProps?.type === "multiselect") {
        // ???
        displayValue = value.join(", ");
      }
    }
    return (
      <Box
        direction="row"
        justifyContent="between"
        paddingX={3}
        paddingY={2}
        width="100%"
        {...rowBoxProps}
      >
        <Box>
          <Text weight="bold">{title}:</Text>
        </Box>
        <Box direction="row">
          <Box>
            <Text overflow="breakWord">{displayValue}</Text>
          </Box>
          {editable && (
            <Box marginLeft={2} onClick={(): void => setEditing(true)}>
              <Icon color="darkGray" name="edit" size="lg" />
            </Box>
          )}
        </Box>
      </Box>
    );
  }
};
