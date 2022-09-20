import React, {useState} from "react";

import {Box} from "./Box";
import {AddressInterface, FieldWithLabelsProps, TextFieldType} from "./Common";
import {USSTATESLIST} from "./Constants";
import {FieldWithLabels} from "./FieldWithLabels";
import {SelectList, SelectListOptions} from "./SelectList";
import {Switch} from "./Switch";
import {Text} from "./Text";
import {TextArea} from "./TextArea";
import {TextField} from "./TextField";

export interface FieldProps extends FieldWithLabelsProps {
  name: string;
  label?: string;
  subLabel?: string;
  initialValue?: any;
  handleChange: any;
  height?: number;
  // Additional validation
  validate?: (value: any) => boolean;
  validateErrorMessage?: string;
  type?:
    | "boolean"
    | "email"
    | "text"
    | "textarea"
    | "number"
    | "currency"
    | "percent"
    | "select"
    | "password"
    | "url"
    | "date"
    | "multiselect"
    | "address";
  rows?: number;
  options?: SelectListOptions;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Field is a fully uncontrolled component for creating various inputs. Fully uncontrolled means Field manages its own
 * state for the TextFields/Switches/etc, not the parent component. When values are updated, Field will pass the data to
 * the parent through the handleChange prop. You can set an initialValue, but you should not update initialValue
 * this prop with the result of handleChange.
 *
 * Note: You MUST set a key={} prop for this component, otherwise you may wind up with stale data. Just changing
 * initialValue will not work.
 *
 */
export function Field(props: FieldProps) {
  const [value, setValue] = useState(props.initialValue || "");
  const [multiselectValue, setMultiselectValue] = useState(props.initialValue ?? []);

  const handleChange = (newValue: string) => {
    if (props.type === "currency") {
      newValue = newValue.replace("$", "");
    } else if (props.type === "percent") {
      newValue = newValue.replace("%", "");
    }
    setValue(newValue);
    if (props.handleChange) {
      props.handleChange(props.name, newValue);
    }
  };

  const handleAddressChange = (field: string, newValue: string) => {
    setValue({...value, [field]: newValue});
    if (props.handleChange) {
      props.handleChange(props.name, {...value, [field]: newValue});
    }
  };

  const handleSwitchChange = (switchValue: boolean) => {
    setValue(switchValue);
    if (props.handleChange) {
      props.handleChange(props.name, switchValue);
    }
  };

  const renderField = () => {
    if (props.type === "select") {
      if (!props.options) {
        console.error("Field with type=select require options");
        return null;
      }
      return (
        <SelectList
          disabled={props.disabled}
          id={props.name}
          options={props.options}
          value={value}
          onChange={handleChange}
        />
      );
    } else if (props.type === "multiselect") {
      if (!props.options) {
        console.error("Field with type=multiselect require options");
        return null;
      }
      return (
        <Box width="100%">
          {props.options.map((o) => (
            <Box key={o.label + o.value} direction="row" justifyContent="between" width="100%">
              <Box flex="shrink" marginRight={2}>
                <Text weight="bold">{o.label}</Text>
              </Box>
              <Box>
                <Switch
                  key={o.label + o.value}
                  disabled={props.disabled}
                  id={props.name}
                  name={props.name}
                  switched={(multiselectValue ?? []).includes(o.value)}
                  onChange={(result) => {
                    let newValue;
                    if (result) {
                      if (multiselectValue.includes(o.value)) {
                        console.warn(`Tried to add value that already exists: ${o.value}`);
                        return;
                      }
                      newValue = [...multiselectValue, o.value];
                    } else {
                      newValue = multiselectValue.filter((v: string) => v !== o.value);
                    }
                    setMultiselectValue(newValue);
                    if (props.handleChange) {
                      props.handleChange(props.name, newValue);
                    }
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      );
    } else if (props.type === "textarea") {
      return (
        <TextArea
          disabled={props.disabled}
          height={props.height}
          id={props.name}
          placeholder={Boolean(value) ? "" : props.placeholder}
          rows={props.rows}
          value={String(value)}
          onChange={(result) => handleChange(result.value)}
        />
      );
    } else if (props.type === "boolean") {
      return (
        <Switch
          disabled={props.disabled}
          id={props.name}
          name={props.name}
          switched={Boolean(value)}
          onChange={(result) => handleSwitchChange(result)}
        />
      );
    } else if (props.type === "date") {
      return (
        <TextField
          disabled
          id={props.name}
          placeholder={props.placeholder}
          type="date"
          // TODO: allow editing with a date picker
          value={value}
          onChange={(result) => handleChange(result.value)}
        />
      );
    } else if (props.type === "address") {
      const {
        address1 = "",
        address2 = "",
        city = "",
        state = "",
        zipcode = "",
      }: AddressInterface = value;
      return (
        <>
          <TextField
            id="address1"
            label="Street Address"
            type="text"
            value={address1}
            onChange={(result) => handleAddressChange("address1", result.value)}
          />
          <TextField
            id="address2"
            label="Apt, suite, etc"
            type="text"
            value={address2}
            onChange={(result) => handleAddressChange("address2", result.value)}
          />
          <TextField
            id="city"
            label="City"
            type="text"
            value={city}
            onChange={(result) => handleAddressChange("city", result.value)}
          />
          <SelectList
            id="state"
            label="State"
            options={USSTATESLIST}
            placeholder="Select state"
            style={{borderRadius: 16}}
            value={state}
            onChange={(result) => handleAddressChange("state", result)}
          />
          <TextField
            id="zipcode"
            label="Zipcode"
            type="text"
            value={zipcode}
            onChange={(result) => handleAddressChange("zipcode", result.value)}
          />
        </>
      );
    } else {
      let type: TextFieldType = "text";
      // Number is supported differently because we need fractional numbers and they don't work
      // well on iOS.
      if (props.type && ["date", "email", "password", "url"].indexOf(props.type) > -1) {
        type = props.type as TextFieldType;
      } else if (props.type === "percent" || props.type === "currency") {
        type = "text";
      }
      let autoComplete: "on" | "current-password" | "username" = "on";
      if (type === "password") {
        autoComplete = "current-password";
      } else if (type === "email") {
        autoComplete = "username";
      }
      const stringValue = String(value);
      // if (props.type === "percent") {
      //   value = `${Number(value).toFixed(0)}%`;
      // } else if (props.type === "currency") {
      //   value = `$${Number(value).toFixed(2)}`;
      // }
      // console.log("VAL", value);
      return (
        <TextField
          autoComplete={autoComplete}
          disabled={props.disabled}
          id={props.name}
          placeholder={props.placeholder}
          type={type as "date" | "email" | "number" | "password" | "text" | "url"}
          value={stringValue}
          onChange={(result) => handleChange(result.value)}
        />
      );
    }
  };

  const children = renderField();
  const {errorMessage, errorMessageColor, helperText, helperTextColor, label, labelColor} = props;
  return (
    <Box marginBottom={5}>
      <FieldWithLabels
        {...{
          errorMessage,
          errorMessageColor,
          helperText,
          helperTextColor,
          label,
          labelColor,
        }}
      >
        {children}
      </FieldWithLabels>
    </Box>
  );
}
