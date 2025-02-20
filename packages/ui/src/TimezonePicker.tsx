import React from "react";

import {SelectFieldPropsBase} from "./Common";
import {getTimezoneOptions} from "./DateUtilities";
import {SelectField} from "./SelectField";

interface TimezonePickerProps extends Omit<SelectFieldPropsBase, "options"> {
  timezone?: string;
  onChange: (value: string) => void;
  location?: "USA" | "Worldwide";
  hideTitle?: boolean;
  shortTimezone?: boolean;
}

export const TimezonePicker: React.FC<TimezonePickerProps> = ({
  timezone,
  onChange,
  location = "USA",
  hideTitle = false,
  shortTimezone = false,
  ...fieldProps
}: TimezonePickerProps): React.ReactElement => {
  // eslint-disable-next-line react/display-name
  const tzOptions = React.useMemo(
    () => getTimezoneOptions(location, shortTimezone),
    [location, shortTimezone]
  );

  // Check that value is in the list of options
  const valueIndex = tzOptions.findIndex((t) => t.value === timezone);
  if (valueIndex === -1) {
    console.warn(`${timezone} is not a valid timezone`);
  }

  const title = hideTitle ? undefined : "Timezone";

  return (
    <SelectField
      title={title}
      {...fieldProps}
      options={tzOptions}
      value={timezone}
      onChange={onChange}
    />
  );
};
