import React, {ReactElement, useEffect, useState} from "react";
import {Linking} from "react-native";

import {Box} from "./Box";
import {Button} from "./Button";
import {AddressInterface, FieldProps, TapToEditProps} from "./Common";
import {Field} from "./Field";
import {Icon} from "./Icon";
// import {useOpenAPISpec} from "./OpenAPIContext";
import {Text} from "./Text";
import {Tooltip} from "./Tooltip";

const TapToEditTitle = ({
  title,
  helperText,
  showHelperTextAsTooltip,
  onlyShowHelperTextWhileEditing,
}: {
  onlyShowHelperTextWhileEditing?: boolean;
  showHelperTextAsTooltip?: boolean;
  title: string;
  helperText?: string;
}): ReactElement => {
  const Title = (
    <Box flex="grow" justifyContent="center">
      <Text bold>{title}:</Text>
      {Boolean(helperText && !showHelperTextAsTooltip && !onlyShowHelperTextWhileEditing) && (
        <Text color="secondaryLight" size="sm">
          {helperText}
        </Text>
      )}
    </Box>
  );
  if (showHelperTextAsTooltip) {
    return (
      <Tooltip idealPosition="top" text={helperText}>
        {Title}
      </Tooltip>
    );
  } else {
    return Title;
  }
};

export function formatAddress(address: AddressInterface, asString = false): string {
  let city = "";
  if (address?.city) {
    city = address?.state || address.zipcode ? `${address.city}, ` : `${address.city}`;
  }

  let state = "";
  if (address?.state) {
    state = address?.zipcode ? `${address.state} ` : `${address.state}`;
  }

  const zip = address?.zipcode || "";

  const countyName = address?.countyName ?? "";

  const countyCode = address?.countyCode ?? "";

  const addressLineOne = address?.address1 ?? "";
  const addressLineTwo = address?.address2 ?? "";
  const addressLineThree = `${city}${state}${zip}`;
  const addressLineFour = `${countyName}${address?.countyCode ? ` (${countyCode})` : ""}`;

  if (!asString) {
    // Only add new lines if lines before and after are not empty to avoid awkward whitespace
    return `${addressLineOne}${
      addressLineOne && (addressLineTwo || addressLineThree) ? `\n` : ""
    }${addressLineTwo}${addressLineTwo && addressLineThree ? `\n` : ""}${addressLineThree}${
      addressLineThree && addressLineFour ? `\n` : ""
    }${addressLineFour}`;
  } else {
    return `${addressLineOne}${
      addressLineOne && (addressLineTwo || addressLineThree) ? `, ` : ""
    }${addressLineTwo}${addressLineTwo && addressLineThree ? `, ` : ""}${addressLineThree}${
      addressLineThree && addressLineFour ? `, ` : ""
    }${addressLineFour}`;
  }
}

export const TapToEdit = ({
  value,
  setValue,
  title,
  onSave,
  editable = true,
  isEditing = false,
  transform,
  withConfirmation = false,
  confirmationText = "Are you sure you want to save your changes?",
  confirmationTitle = "Confirm",
  helperText: propsHelperText,
  showHelperTextAsTooltip = false,
  onlyShowHelperTextWhileEditing = true,
  ...fieldProps
}: TapToEditProps): ReactElement => {
  const [editing, setEditing] = useState(false);
  const [initialValue, setInitialValue] = useState();
  const helperText: string | undefined = propsHelperText;
  // setInitialValue is called after initial render to handle the case where the value is updated
  useEffect(() => {
    setInitialValue(value);
    // do not update if value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (editable && !setValue) {
    throw new Error("setValue is required if editable is true");
  }

  if (editable && (editing || isEditing)) {
    return (
      <Box direction="column" width="100%">
        <Box flex="grow" justifyContent="center">
          <Text bold>{title}</Text>
        </Box>
        <Field
          helperText={helperText}
          type={(fieldProps?.type ?? "text") as NonNullable<FieldProps["type"]>}
          value={value}
          onChange={setValue ?? (() => {})}
          {...(fieldProps as any)}
        />
        {editing && !isEditing && (
          <Box direction="row">
            <Button
              text="Cancel"
              variant="muted"
              onClick={(): void => {
                if (setValue) {
                  setValue(initialValue);
                }
                setEditing(false);
              }}
            />
            <Box marginLeft={2}>
              <Button
                confirmationText={confirmationText}
                modalTitle={confirmationTitle}
                text="Save"
                withConfirmation={withConfirmation}
                onClick={async (): Promise<void> => {
                  if (!onSave) {
                    console.error("No onSave provided for editable TapToEdit");
                  } else {
                    setInitialValue(value);
                    await onSave(value);
                  }
                  setEditing(false);
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    );
  } else {
    let displayValue = value;
    // If a transform props is present, that takes priority
    if (transform) {
      displayValue = transform(value);
    } else {
      // If no transform, try and display the value reasonably.
      if (fieldProps?.type === "boolean") {
        displayValue = value ? "Yes" : "No";
        // TODO: put transform back in after field types are updated
        // } else if (fieldProps?.type === "percent") {
        //   // Prevent floating point errors from showing up by using parseFloat and precision.
        //   // Pass through parseFloat again to trim off insignificant zeroes.
        //   displayValue = `${parseFloat(parseFloat(String(value * 100)).toPrecision(7))}%`;
        // } else if (fieldProps?.type === "currency") {
        //   // TODO: support currencies other than USD in Field and related components.
        //   const formatter = new Intl.NumberFormat("en-US", {
        //     style: "currency",
        //     currency: "USD",
        //     minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //   });
        //   displayValue = formatter.format(value);
      } else if (fieldProps?.type === "multiselect") {
        // ???
        displayValue = value.join(", ");
      } else if (fieldProps?.type === "url") {
        // Show only the domain, full links are likely too long.
        try {
          const url = new URL(value);
          displayValue = url?.hostname ?? value;
        } catch (error) {
          // Don't print an error message for empty values.
          if (value) {
            console.debug(`Invalid URL: $value`);
          }
          displayValue = value;
        }
      } else if (fieldProps?.type === "address") {
        displayValue = formatAddress(value);
      }
    }

    const openLink = async (): Promise<void> => {
      if (fieldProps?.type === "url") {
        await Linking.openURL(value);
      } else if (fieldProps?.type === "address") {
        await Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            formatAddress(value, true)
          )}`
        );
      }
    };
    const isClickable = fieldProps?.type === "url" || fieldProps?.type === "address";

    // For textarea to display correctly, we place the title on its own line, then the text
    // on the next line. This is because the textarea will take up the full width of the row.
    return (
      <Box
        alignItems={fieldProps?.type === "textarea" ? "start" : "center"}
        direction={fieldProps?.type === "textarea" ? "column" : "row"}
        justifyContent="between"
        paddingX={3}
        paddingY={2}
        width="100%"
      >
        <Box direction="row" width="100%">
          <TapToEditTitle
            helperText={helperText}
            onlyShowHelperTextWhileEditing={onlyShowHelperTextWhileEditing}
            showHelperTextAsTooltip={showHelperTextAsTooltip}
            title={title}
          />
          <Box direction="row" flex="grow" justifyContent="end" marginLeft={2}>
            <Box
              accessibilityHint=""
              accessibilityLabel="Link"
              justifyContent="start"
              onClick={isClickable ? openLink : undefined}
            >
              {Boolean(fieldProps?.type !== "textarea") && (
                <Text align="right" underline={isClickable}>
                  {displayValue}
                </Text>
              )}
            </Box>
            {editable && (
              <Box
                accessibilityHint=""
                accessibilityLabel="Edit"
                marginLeft={2}
                width={16}
                onClick={(): void => setEditing(true)}
              >
                <Icon iconName="pencil" size="md" />
              </Box>
            )}
          </Box>
        </Box>
        {fieldProps?.type === "textarea" && (
          <>
            <Box marginTop={2} paddingY={2} width="100%">
              <Text align="left" underline={isClickable}>
                {displayValue}
              </Text>
            </Box>
            {editable && (
              <Box
                accessibilityHint=""
                accessibilityLabel="Edit"
                alignSelf="end"
                marginLeft={2}
                width={16}
                onClick={(): void => setEditing(true)}
              >
                <Icon color="primary" iconName="pencil" size="md" />
              </Box>
            )}
          </>
        )}
      </Box>
    );
  }
};
