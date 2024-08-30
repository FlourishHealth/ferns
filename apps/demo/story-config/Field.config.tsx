import {DemoConfiguration} from "@config";
import {
  AddressFieldStory,
  BooleanFieldStory,
  // CurrencyFieldStory,
  CustomSelectFieldStory,
  DateAndTimeFieldStory,
  EmailTextFieldStory,
  FieldWithErrorStory,
  MultiselectFieldStory,
  NumberFieldStory,
  PasswordFieldStory,
  // PercentFieldStory,
  PhoneNumberFieldStory,
  SelectFieldStory,
  TextAreaFieldStory,
  TextFieldStory,
  URLFieldStory,
} from "@stories";
import {Field} from "ferns-ui";

export const FieldConfiguration: DemoConfiguration = {
  name: "Field",
  component: Field,
  related: [],
  description:
    "A higher level component that wraps all input fields, allowing you to pass type and get the correct field.",
  a11yNotes: [],
  category: "Pattern",
  status: {
    documentation: "planned",
    figma: "notSupported",
    ios: "ready",
    android: "ready",
    web: "ready",
  },
  additionalDocumentation: [],
  interfaceName: "FieldProps",
  usage: {
    do: [],
    doNot: [],
  },
  props: {},
  demo: TextFieldStory,
  demoOptions: {},
  stories: {
    "Text Field": {render: TextFieldStory},
    "Boolean Field": {render: BooleanFieldStory},
    "Email Text Field": {render: EmailTextFieldStory},
    "Text Area Field": {render: TextAreaFieldStory},
    "Number Field": {render: NumberFieldStory},
    // "Currency Field": {render: CurrencyFieldStory},
    // "Percent Field": {render: PercentFieldStory},
    "Select Field": {render: SelectFieldStory},
    "Password Field": {render: PasswordFieldStory},
    "Phone Number Field": {render: PhoneNumberFieldStory},
    "URL Field": {render: URLFieldStory},
    "Date And Time Fields": {render: DateAndTimeFieldStory},
    "Multiselect Field": {render: MultiselectFieldStory},
    "Address Field": {render: AddressFieldStory},
    "Custom Select Field": {render: CustomSelectFieldStory},
    "Field With Error Message": {render: FieldWithErrorStory},
    // "Signature Field": {render: SignatureFieldStory},
  },
};
