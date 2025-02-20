import React, {FC} from "react";

import {AddressField} from "./AddressField";
import {BooleanField} from "./BooleanField";
import {
  AddressFieldProps,
  BooleanFieldProps,
  CustomSelectFieldProps,
  DateTimeFieldProps,
  EmailFieldProps,
  FieldProps,
  MultiselectFieldProps,
  NumberFieldProps,
  PhoneNumberFieldProps,
  SelectFieldProps,
  SignatureFieldProps,
  TextAreaProps,
  TextFieldProps,
  TextFieldType,
} from "./Common";
import {CustomSelectField} from "./CustomSelectField";
import {DateTimeField} from "./DateTimeField";
import {EmailField} from "./EmailField";
import {MultiselectField} from "./MultiselectField";
import {NumberField} from "./NumberField";
import {PhoneNumberField} from "./PhoneNumberField";
import {SelectField} from "./SelectField";
import {Signature} from "./Signature";
import {TextArea} from "./TextArea";
import {TextField} from "./TextField";

// TODO: put onblur back in any fields that need it
export const Field: FC<FieldProps> = ({type, ...rest}) => {
  if (type === "select") {
    return (
      <SelectField
        {...(rest as SelectFieldProps)}
        // onChange={(result) => {
        //   rest.onChange?.(result);
        //   rest.onBlur?.(result);
        // }}
      />
    );
  } else if (type === "multiselect") {
    return <MultiselectField {...(rest as MultiselectFieldProps)} />;
  } else if (type === "textarea") {
    return <TextArea {...(rest as TextAreaProps)} />;
  } else if (type === "boolean") {
    return <BooleanField {...(rest as BooleanFieldProps)} />;
  } else if (type && ["date", "time", "datetime"].includes(type)) {
    return (
      <DateTimeField
        {...(rest as DateTimeFieldProps as any)}
        type={type as "date" | "time" | "datetime"}
      />
    );
  } else if (type === "address") {
    return <AddressField {...(rest as AddressFieldProps)} />;
  } else if (type === "customSelect") {
    return (
      <CustomSelectField
        {...(rest as CustomSelectFieldProps)}
        // onChange={(result) => {
        //   rest.onChange(result);
        //   rest.onBlur && rest.onBlur(result);
        // }}
      />
    );
  } else if (type === "number") {
    return <NumberField {...(rest as NumberFieldProps)} />;
  } else if (type === "signature") {
    return <Signature {...(rest as SignatureFieldProps)} />;
  } else if (type === "email") {
    return <EmailField {...(rest as EmailFieldProps)} />;
  } else if (type === "phoneNumber") {
    return <PhoneNumberField {...(rest as PhoneNumberFieldProps)} />;
  } else {
    let tfType: TextFieldType = "text";
    let autoComplete: "on" | "current-password" | "username" = "on";
    if (type && ["password", "url"].includes(type)) {
      tfType = type as TextFieldType;
      // } else if (type === "percent" || type === "currency") {
      // TODO: Implement percent and currency fields
      // tfType = "text";
      // }
      if (tfType === "password") {
        autoComplete = "current-password";
      } else if (tfType === "email") {
        autoComplete = "username";
      }
    }

    return (
      <TextField
        autoComplete={autoComplete}
        type={tfType as "email" | "password" | "phoneNumber" | "text" | "url"}
        {...(rest as TextFieldProps)}
      />
    );
  }
};
