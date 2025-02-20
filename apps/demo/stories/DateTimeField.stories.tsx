import {
  Box,
  Button,
  DateTimeField,
  DateTimeFieldProps,
  Heading,
  printDateAndTime,
  Text,
} from "ferns-ui";
import React, {ReactElement, useState} from "react";

export const DateTimeFieldDemo = (props: Partial<DateTimeFieldProps>): ReactElement => {
  const [value, setValue] = useState("");
  return (
    <Box maxWidth={500}>
      <DateTimeField
        helperText="Supporting helper text"
        title="Date and Time Field"
        type="datetime"
        value={value}
        onChange={(v) => {
          setValue(v);
        }}
        {...props}
      />
    </Box>
  );
};

export const DateTimeFieldStory = (): ReactElement => {
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");

  const [disabled, setDisabled] = useState(false);
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  return (
    <Box gap={2} maxWidth={500}>
      <Box padding={2}>
        <Heading>DateTimeField with timezone handling</Heading>
      </Box>
      <DateTimeField
        disabled={disabled}
        helperText={disabled ? "Tell the user why this is disabled." : undefined}
        timezone={timezone}
        title="type datetime"
        type="datetime"
        value={value}
        onChange={(v) => {
          setValue(v);
        }}
        onTimezoneChange={setTimezone}
      />
      <Box padding={2}>
        <Text>
          Current value: {value || "No date selected"}, TZ: {timezone}
        </Text>
        <Text>Formatted: {value ? printDateAndTime(value) : "No date selected"}</Text>
      </Box>

      <Button text="Toggle Disabled" onClick={() => setDisabled(!disabled)} />

      <Box padding={2}>
        <Heading>DateTimeField without timezone handling</Heading>
      </Box>
      <DateTimeField
        title="datetime without timezone handling"
        type="datetime"
        value={value2}
        onChange={(v) => {
          setValue2(v);
        }}
      />
      <Box padding={2}>
        <Text>Current value: {value2 || "No date selected"}</Text>
        <Text>Formatted: {value2 ? printDateAndTime(value2) : "No date selected"}</Text>
      </Box>
    </Box>
  );
};

export const DateTimeFieldTypes = (): ReactElement => {
  const [datetimeValue, setDatetimeValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [disabled, setDisabled] = useState(false);

  return (
    <Box gap={2} maxWidth={500}>
      <Box padding={3}>
        <DateTimeField
          disabled={disabled}
          title="type datetime"
          type="datetime"
          value={datetimeValue}
          onChange={(v) => {
            setDatetimeValue(v);
          }}
        />
      </Box>
      <Box padding={3}>
        <DateTimeField
          disabled={disabled}
          title="type date"
          type="date"
          value={dateValue}
          onChange={(v) => {
            setDateValue(v);
          }}
        />
      </Box>
      <Box padding={3}>
        <DateTimeField
          disabled={disabled}
          title="type time"
          type="time"
          value={timeValue}
          onChange={(v) => {
            setTimeValue(v);
          }}
        />
      </Box>
      <Box width={200}>
        <Button text="Toggle Disabled" onClick={() => setDisabled(!disabled)} />
      </Box>
      <Box paddingY={4}>
        <Text bold>Datetime: {datetimeValue}</Text>
        <Text bold>Date: {dateValue}</Text>
        <Text bold>Time: {timeValue}</Text>
      </Box>
    </Box>
  );
};
