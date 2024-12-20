import {Box, Button, DateTimeField, DateTimeFieldProps, Text} from "ferns-ui";
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
  const [disabled, setDisabled] = useState(false);
  return (
    <Box gap={2} maxWidth={500}>
      <DateTimeField
        disabled={disabled}
        helperText={disabled ? "Tell the user why this is disabled." : undefined}
        title="type datetime"
        type="datetime"
        value={value}
        onChange={(v) => {
          setValue(v);
        }}
      />
      <Button text="Toggle Disabled" onClick={() => setDisabled(!disabled)} />
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
