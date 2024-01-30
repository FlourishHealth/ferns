import {Picker} from "@react-native-picker/picker";
import {getCalendars} from "expo-localization";
import range from "lodash/range";
import {DateTime} from "luxon";
import React, {useContext, useEffect, useState} from "react";
import {Platform, StyleProp, TextInput, TextStyle, View} from "react-native";
import {Calendar} from "react-native-calendars";

import {Box} from "./Box";
import {DateTimeActionSheetProps} from "./Common";
import {Heading} from "./Heading";
import {IconButton} from "./IconButton";
import {isMobileDevice} from "./MediaQuery";
import {Modal} from "./Modal";
import {SelectList} from "./SelectList";
import {ThemeContext} from "./Theme";
import {TimezonePicker} from "./TimezonePicker";

const TIME_PICKER_HEIGHT = 104;
const INPUT_HEIGHT = 40;

const hours = range(1, 13).map((n) => String(n));
// TODO: support limited picker minutes, e.g. 5 or 15 minute increments.
const minutes = range(0, 60).map((n) => String(n).padStart(2, "0"));
const minutesOptions = [...minutes, "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const TimeInput = ({
  type,
  value,
  onChange,
}: {
  type: "hour" | "minute";
  value: number;
  onChange: (value: number) => void;
}): React.ReactElement => {
  const {theme} = useContext(ThemeContext);

  const defaultText = type === "minute" ? String(value).padStart(2, "0") : String(value);
  const [text, setText] = useState(defaultText);
  const [focused, setFocused] = useState(false);
  let error = false;
  if (type === "hour") {
    error = !hours.includes(String(Number(text)));
  } else if (type === "minute") {
    error = !minutesOptions.includes(String(Number(text)));
  }

  // Broken out because types don't think "outline" is a valid style.
  const textInputStyle: StyleProp<TextStyle> = {
    flex: 1,
    paddingTop: 4,
    paddingRight: 4,
    paddingBottom: 4,
    paddingLeft: 0,
    height: INPUT_HEIGHT,
    width: "100%",
    color: theme.darkGray,
    fontFamily: theme.primaryFont,
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: INPUT_HEIGHT,
        width: "100%",
        // Add padding so the border doesn't mess up layouts
        paddingHorizontal: focused ? 10 : 14,
        paddingVertical: focused ? 0 : 4,
        borderColor: error ? theme.red : theme.blue,
        borderWidth: focused ? 5 : 1,
        borderRadius: 5,
        backgroundColor: theme.white,
      }}
    >
      <TextInput
        keyboardType="number-pad"
        returnKeyType="done"
        style={
          {
            ...textInputStyle,
            outline: Platform.select({web: "none"}),
          } as any
        }
        textContentType="none"
        underlineColorAndroid="transparent"
        value={text}
        onBlur={() => {
          setFocused(false);
        }}
        onChangeText={(t) => {
          setText(t);
          onChange(Number(t));
        }}
        onFocus={() => {
          setFocused(true);
        }}
      />
    </View>
  );
};

const CalendarHeader = ({
  addMonth,
  month,
}: {
  addMonth: (num: number) => void;
  month: Date[];
}): React.ReactElement => {
  const displayDate = DateTime.fromJSDate(month[0]).toFormat("MMM yyyy");
  return (
    <Box alignItems="center" direction="row" height={40} justifyContent="between" width="100%">
      <IconButton
        accessibilityLabel="arrow"
        bgColor="white"
        icon="angle-double-left"
        iconColor="primary"
        size="md"
        onClick={() => {
          addMonth(-12);
        }}
      />
      <IconButton
        accessibilityLabel="arrow"
        bgColor="white"
        icon="angle-left"
        iconColor="primary"
        size="md"
        onClick={() => {
          addMonth(-1);
        }}
      />
      <Heading size="sm">{displayDate}</Heading>
      <IconButton
        accessibilityLabel="arrow"
        bgColor="white"
        icon="angle-right"
        iconColor="primary"
        size="md"
        onClick={() => {
          addMonth(1);
        }}
      />
      <IconButton
        accessibilityLabel="arrow"
        bgColor="white"
        icon="angle-double-right"
        iconColor="primary"
        size="md"
        onClick={() => {
          addMonth(12);
        }}
      />
    </Box>
  );
};

// For mobile, renders all components in an action sheet. For web, renders all components in a
// modal. For mobile:
// If mode is "time", renders a spinner picker for time picker on both platforms.
// If mode is "date", renders our custom calendar on both platforms.
// If mode is "datetime",renders a spinner picker for time picker and our custom calendar on both
// platforms.
// For web, renders a simplistic text box for time picker and a calendar for date picker
// in a modal In the future, web time picker should be a typeahead dropdown like Google calendar.
export const DateTimeActionSheet = ({
  // actionSheetRef,
  mode,
  value,
  onChange,
  visible,
  onDismiss,
  transformValue,
}: DateTimeActionSheetProps) => {
  const {theme} = useContext(ThemeContext);

  const calendar = getCalendars()[0];
  const [timezone, setTimezone] = useState<string | undefined>(
    transformValue?.options?.timezone || calendar?.timeZone
  );
  if (!timezone) {
    console.error(
      "Could not automatically determine timezone and none was provided to DateTimeActionSheet."
    );
  }

  if (typeof value !== "string" && typeof value !== "undefined") {
    console.error(`Datetime only accepts string or undefined value, not ${typeof value}: ${value}`);
  }

  // Accept ISO 8601, HH:mm, or hh:mm A formats. We may want only HH:mm or hh:mm A for mode=time

  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [amPm, setAmPm] = useState<"am" | "pm">("am");
  const [date, setDate] = useState<string>("");

  // If the value changes in the props, update the state for the date and time.
  useEffect(() => {
    let datetime;
    if (value) {
      datetime = DateTime.fromISO(value).setZone(timezone).set({millisecond: 0, second: 0});
    } else {
      datetime = DateTime.now().setZone(timezone).set({millisecond: 0, second: 0});
    }
    if (!datetime.isValid) {
      throw new Error(
        `Invalid date/time value ${value}, datetime ${datetime} timezone: ${timezone}`
      );
    }

    let h = datetime.hour % 12;
    if (h === 0) {
      h = 12;
    }
    setHour(h);
    setMinute(datetime.minute);
    setAmPm(datetime.toFormat("a") === "am" ? "am" : "pm");
    setDate(datetime.toISO());
  }, [value, transformValue, timezone]);

  // TODO Support 24 hour time for time picker.
  const renderMobileTime = () => {
    return (
      <Box direction="row" width="100%">
        <Box paddingY={2} width="35%">
          <Picker
            itemStyle={{
              height: TIME_PICKER_HEIGHT,
            }}
            selectedValue={hour}
            style={{
              height: TIME_PICKER_HEIGHT,
              backgroundColor: "#FFFFFF",
            }}
            onValueChange={(itemValue) => setHour(itemValue)}
          >
            {hours.map((n) => (
              <Picker.Item key={String(n)} label={String(n)} value={String(n)} />
            ))}
          </Picker>
        </Box>
        <Box paddingY={2} width="35%">
          <Picker
            itemStyle={{
              height: TIME_PICKER_HEIGHT,
            }}
            selectedValue={minute}
            style={{
              height: TIME_PICKER_HEIGHT,
              backgroundColor: "#FFFFFF",
            }}
            onValueChange={(itemValue) => setMinute(itemValue)}
          >
            {minutes.map((n) => (
              <Picker.Item key={String(n)} label={String(n)} value={String(n)} />
            ))}
          </Picker>
        </Box>
        <Box paddingY={2} width="30%">
          <Picker
            itemStyle={{
              height: TIME_PICKER_HEIGHT,
            }}
            selectedValue={amPm}
            style={{
              height: TIME_PICKER_HEIGHT,
              backgroundColor: "#FFFFFF",
            }}
            onValueChange={(itemValue) => setAmPm(itemValue)}
          >
            <Picker.Item key="am" label="am" value="am" />
            <Picker.Item key="pm" label="pm" value="pm" />
          </Picker>
        </Box>
      </Box>
    );
  };

  // TODO: Support a typeahead dropdown for time picker, similar to Google Calendar on the web.
  const renderWebTime = () => {
    return (
      <Box direction="row" justifyContent="center" width="100%">
        <Box width={60}>
          <TimeInput type="hour" value={hour} onChange={(v) => setHour(v)} />
        </Box>
        <Box
          alignItems="center"
          height={INPUT_HEIGHT}
          justifyContent="center"
          marginLeft={2}
          marginRight={2}
        >
          <Heading size="md">:</Heading>
        </Box>
        <Box marginRight={2} width={60}>
          <TimeInput type="minute" value={minute} onChange={(v) => setMinute(v)} />
        </Box>

        <Box marginRight={2} width={60}>
          <SelectList
            options={[
              {label: "am", value: "am"},
              {label: "pm", value: "pm"},
            ]}
            style={{minHeight: INPUT_HEIGHT}}
            value={amPm}
            onChange={(result) => {
              setAmPm(result as "am" | "pm");
            }}
          />
        </Box>
        <Box>
          <TimezonePicker showLabel={false} timezone={timezone} onChange={setTimezone} />
        </Box>
      </Box>
    );
  };

  const renderDateTime = (): React.ReactElement => {
    return (
      <Box>
        <Box marginBottom={2}>{renderDateCalendar()}</Box>
        {isMobileDevice() ? renderMobileTime() : renderWebTime()}
      </Box>
    );
  };

  // Note: do not call this if waiting on a state change.
  const sendOnChange = () => {
    const militaryHour = amPm === "pm" && hour !== 12 ? Number(hour) + 12 : Number(hour);
    console.log("sendOnChange", {date, hour, hourChange: militaryHour, minute, amPm, timezone});

    if (mode === "date") {
      onChange({
        value: DateTime.fromISO(date)
          .setZone("UTC")
          .set({hour: 0, minute: 0, second: 0, millisecond: 0})
          .toISO()!,
      });
    } else if (mode === "time") {
      onChange({
        value: DateTime.fromISO(date)
          .setZone(timezone)
          .set({hour: militaryHour, minute, second: 0, millisecond: 0})
          .setZone("UTC")
          .toISO()!,
      });
    } else if (mode === "datetime") {
      onChange({
        value: DateTime.fromISO(date)
          .setZone(timezone)
          .set({hour: militaryHour, minute, second: 0, millisecond: 0})
          .setZone("UTC")
          .toISO()!,
      });
    }
    onDismiss();
  };

  const sendClear = () => {
    onChange({
      value: "",
    });
    onDismiss();
  };

  // Renders our custom calendar component on mobile or web.
  const renderDateCalendar = () => {
    const markedDates: {[id: string]: {selected: boolean; selectedColor: string}} = {};
    if (date) {
      markedDates[DateTime.fromISO(date).toFormat("YYYY-MM-DD")] = {
        selected: true,
        selectedColor: theme.primary,
      };
    }
    return (
      <Box width="100%">
        <Box marginBottom={4} width="100%">
          <Calendar
            customHeader={CalendarHeader}
            initialDate={DateTime.fromISO(date).toFormat("YYYY-MM-DD")}
            markedDates={markedDates}
            onDayPress={(day) => {
              setDate(day.dateString);
              // If mode is just date, we can shortcut and close right away.
              // time and datetime need to wait for the primary button.
              if (mode === "date") {
                onChange({value: day.dateString});
                onDismiss();
              }
            }}
          />
        </Box>
        <TimezonePicker timezone={timezone} onChange={setTimezone} />
      </Box>
    );
  };

  const renderContent = (): React.ReactElement => {
    if (isMobileDevice()) {
      if (mode === "date") {
        return renderDateCalendar();
      } else if (mode === "time") {
        return renderMobileTime();
      } else {
        return renderDateTime();
      }
    } else {
      if (mode === "date") {
        return renderDateCalendar();
      } else if (mode === "time") {
        return renderWebTime();
      } else {
        return renderDateTime();
      }
    }
  };

  return (
    <Modal
      primaryButtonOnClick={sendOnChange}
      primaryButtonText="Save"
      secondaryButtonOnClick={sendClear}
      secondaryButtonText="Clear"
      showClose
      visible={visible}
      onDismiss={onDismiss}
    >
      {renderContent()}
    </Modal>
  );
};
