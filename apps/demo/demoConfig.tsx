import {
  AvatarConfiguration,
  BadgeConfiguration,
  BannerConfiguration,
  BooleanFieldConfiguration,
  BoxConfiguration,
  ButtonConfiguration,
  CardConfiguration,
  CheckBoxConfiguration,
  DateFieldConfiguration,
  DateTimeFieldConfiguration,
  DateTimeModalConfiguration,
  MaskConfiguration,
  ModalConfiguration,
  MultiselectFieldConfiguration,
  PaginationConfiguration,
  PasswordFieldConfiguration,
  PillConfiguration,
  RadioConfiguration,
  RadioFieldConfiguration,
  SegmentedControlConfiguration,
  SelectFieldConfiguration,
  SideDrawerConfiguration,
  SignatureFieldConfiguration,
  SpinnerConfiguration,
  SwitchConfiguration,
  TableBadgeConfiguration,
  TableBooleanConfiguration,
  TableConfiguration,
  TableDateConfiguration,
  TableIconButtonConfiguration,
  TableNumberConfiguration,
  TableTextFieldConfiguration,
  TableTitleConfiguration,
  TapToEditConfiguration,
  TextAreaConfiguration,
  TextFieldConfiguration,
  TimeFieldConfiguration,
  ToastConfiguration,
  TooltipConfiguration,
} from "@stories";
import {FieldProps} from "ferns-ui";
import React from "react";

export type DemoConfigStatus = "planned" | "inProgress" | "ready" | "notSupported";

const PropsJSON = require("./common.json");

interface DemoConfigurationBase {
  name: string;
  component: any; // TODO: make this typing better
  related: string[];
  description: string;
  // Used for the index page if description is long.
  shortDescription?: string;
  a11yNotes: string[];
  category: string[];
  status: {
    documentation: DemoConfigStatus;
    figma: DemoConfigStatus;
    figmaLink?: string;
    ios: DemoConfigStatus;
    android: DemoConfigStatus;
    web: DemoConfigStatus;
  };
  additionalDocumentation?: {name: string; link: string}[];
  // Should match one of the interface names in common.json (children.[0].name)
  interfaceName: string;
  usage: {
    do: string[];
    doNot: string[];
  };
  // Demo is the top component that will show up in the index page and at the top of the page.
  demo: (props: any) => React.ReactElement;
  demoOptions: {
    // On large screens, "md" will either generate a smaller box with controls to the right
    // or just a small box. On small screens, it will be full width with controls below.
    // On small and large screens, "lg" will generate a full width box with controls below (if any).
    // "md" is the default.
    size?: "md" | "lg";
    controls?: {
      [prop: string]: FieldProps & {defaultValue?: any};
    };
  };
  // Stories represent different states of the component and different examples of using it.
  stories: {
    [name: string]: {
      description?: string;
      showInDemo?: boolean; // TODO filter in Demo site
      render: () => React.ReactElement | null;
    };
  };
}

export interface DemoConfigurationProp {
  comment: {
    summary: {
      kind: string;
      text: string;
    }[];
  };
  flags: {
    isOptional: boolean;
  };
  name: string;
  type: {
    name: string;
    type: string;
  };
}

export interface DemoConfiguration extends DemoConfigurationBase {
  props: any;
}

// const ChatBubbleConfiguration: DemoConfiguration = { name: "Chat bubble", component: ChatBubble,
// related: ["Messages"], description: "A chat bubble component in UI design organizes and visually
// represents messages in conversation threads, mimicking speech bubbles for intuitive
// communication.", a11yNotes: [ "Chat bubbles are wonderfully accessible as-is.",
// "Make sure to use colors that are accessible. The current design is accessible.", ], category:
// ["Communication", "Feedback"], status: { documentation: "ready", figma: "ready", figmaLink: "https://www.figma.com/file/ykXj5qjjtFjOYkAvTasu9r/Flourish-Health-Design-System?type=design&node-id=656%3A23454&mode=design&t=AKQ8wyFQBA4qC5eF-1",
// ios: "ready", android: "ready", web: "ready", }, additionalDocumentation: [{name: "Github demo
// link", link: "https://github.com/gestalt/gestalt"}], interfaceName: "ChatBubbleProps", usage: {
// do: [ "Use the appropriate colors for each user group.",
// "Provide dates with messages so that users will know when a message was received.", ], doNot:
// ["Do not create custom bubble styles to use in one-off instances."], }, props: {}, demo:
// (props) => <ChatBubbleDemo {...props} />, demoOptions: {}, stories: {}, testMatrix: {},
// testMatrixDefaultProps: {}, };

// const FilteredItemConfiguration: DemoConfiguration = { name: "Filtered item", component:
// FilteredItem, related: ["Pills"], description: "A component that shows members, pods,
// etc that have been filtered into a list. Users can interact with this component by dismissing it
// (removing the filter) or occasionally, editing it.", a11yNotes: [], category: ["Filter",
// "Utility"], status: { documentation: "ready", figma: "ready", figmaLink: "https://www.figma.com/file/ykXj5qjjtFjOYkAvTasu9r/Flourish-Health-Design-System?type=design&node-id=656%3A23503&mode=design&t=iCiJI3xbrm6rrXPg-1",
// ios: "ready", android: "ready", web: "ready", }, additionalDocumentation: [], interfaceName:
// "FilteredItemProps", usage: { do: [ "Allow 8pt of space between each filtered item.",
// "Use the same component between desktop and mobile.", "Truncate the text if it’s too long.", ],
// doNot: [ "Don’t change the colors on the dismiss or edit icons.", "Filter for long strings (for
// example, whole sentences).", "Wrap the text into two lines.", ], }, props: {}, demo:
// (props) => <FilteredItemDemo {...props} />, demoOptions: {}, stories: {}, testMatrix: {},
// testMatrixDefaultProps: {}, };

// const MessageConfiguration: DemoConfiguration = { name: "Message", component: Message, related:
// ["Avatar", "Chat bubble"], description: "This component allows the user to click into a specific
// chat. There are separate variants for both devices and user groups.", a11yNotes: [], category:
// ["Communication", "Feedback"], status: { documentation: "ready", figma: "ready", figmaLink: "https://www.figma.com/file/ykXj5qjjtFjOYkAvTasu9r/Flourish-Health-Design-System?type=design&node-id=656%3A23418&mode=design&t=IZ8oGBzUmBzUtZMr-1",
// ios: "ready", android: "ready", web: "ready", }, additionalDocumentation: [], interfaceName:
// "MessageProps", usage: { do: [ "Use the patient variant for the member portal,
// and the staff variant for the staff portal.", "Use the appropriate icons for the user groups in
// the staff portal.", ], doNot: ["Do not create a new user group icon without checking with the
// head of product first."], }, props: {}, demo: (props) => <MessageDemo {...props} />, demoOptions:
// {}, stories: {}, testMatrix: {}, testMatrixDefaultProps: {}, };

const Config: DemoConfigurationBase[] = [
  AvatarConfiguration,
  BadgeConfiguration,
  BannerConfiguration,
  BooleanFieldConfiguration,
  BoxConfiguration,
  ButtonConfiguration,
  CardConfiguration,
  // ChatBubbleConfiguration,
  CheckBoxConfiguration,
  DateTimeModalConfiguration,
  DateTimeFieldConfiguration,
  DateFieldConfiguration,
  // FilteredItemConfiguration,
  MaskConfiguration,
  // MessageConfiguration,
  ModalConfiguration,
  MultiselectFieldConfiguration,
  PaginationConfiguration,
  PasswordFieldConfiguration,
  PillConfiguration,
  RadioConfiguration,
  RadioFieldConfiguration,
  SegmentedControlConfiguration,
  SelectFieldConfiguration,
  SideDrawerConfiguration,
  SignatureFieldConfiguration,
  SpinnerConfiguration,
  SwitchConfiguration,
  TableConfiguration,
  TableBadgeConfiguration,
  TableBooleanConfiguration,
  TableDateConfiguration,
  TableIconButtonConfiguration,
  TableNumberConfiguration,
  TableTextFieldConfiguration,
  TableTitleConfiguration,
  TapToEditConfiguration,
  TextAreaConfiguration,
  TextFieldConfiguration,
  TimeFieldConfiguration,
  ToastConfiguration,
  TooltipConfiguration,
];

export const DemoConfig = Config.map((c) => ({
  ...c,
  props: PropsJSON.children.find((json: any) => json.name === c.interfaceName),
}));
