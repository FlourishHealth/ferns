/* eslint-disable react-native-a11y/has-accessibility-hint */
import {FontAwesome6} from "@expo/vector-icons";
import {Picker} from "@react-native-picker/picker";
import {getCalendars} from "expo-localization";
import range from "lodash/range";
import {DateTime} from "luxon";
import React, {useEffect, useMemo, useState} from "react";
import {Platform, Pressable, StyleProp, TextInput, TextStyle, View} from "react-native";
import {Calendar} from "react-native-calendars";

import {Box} from "./Box";
import {DateTimeActionSheetProps, IconName} from "./Common";
import {Heading} from "./Heading";
import {isMobileDevice} from "./MediaQuery";
import {Modal} from "./Modal";
import {SelectField} from "./SelectField";
import {useTheme} from "./Theme";
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
  const {theme} = useTheme();

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
    color: theme.text.primary,
    fontFamily: "text",
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
        borderColor: error ? theme.border.error : theme.border.default,
        borderWidth: focused ? 5 : 1,
        borderRadius: 5,
        backgroundColor: theme.surface.base,
      }}
    >
      <TextInput
        accessibilityHint="Enter a number"
        aria-label="Text input field"
        enterKeyHint="done"
        selectTextOnFocus
        keyboardType="number-pad"
        style={
          {
            ...textInputStyle,
            outline: Platform.select({web: "none"}),
          } as StyleProp<TextStyle>
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

const CalendarButton = ({
  iconName,
  onClick,
  accessibilityLabel,
  accessibilityHint,
}: {
  accessibilityLabel: string;
  accessibilityHint: string;
  iconName: IconName;
  onClick: () => void;
}) => {
  const {theme} = useTheme();
  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      aria-label={accessibilityLabel}
      aria-role="button"
      hitSlop={10}
      onPress={onClick}
    >
      <FontAwesome6 color={theme.surface.secondaryDark} name={iconName} size={16}  selectable={undefined} />
    </Pressable>
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
      <CalendarButton
        accessibilityHint="Decrease the year"
        accessibilityLabel="Previous year button"
        iconName="angles-left"
        onClick={() => {
          addMonth(-12);
        }}
      />
      <CalendarButton
        accessibilityHint="Decrease the month"
        accessibilityLabel="Previous month button"
        iconName="angle-left"
        onClick={() => {
          addMonth(-1);
        }}
      />
      <Heading size="lg">{displayDate}</Heading>
      <CalendarButton
        accessibilityHint="Increase the month"
        accessibilityLabel="Next month button"
        iconName="angle-right"
        onClick={() => {
          addMonth(1);
        }}
      />
      <CalendarButton
        accessibilityHint="Increase the year"
        accessibilityLabel="Next year button"
        iconName="angles-right"
        onClick={() => {
          addMonth(12);
        }}
      />
    </Box>
  );
};

interface TimeProps {
  type: DateTimeActionSheetProps["type"];
  timezone: string | undefined;
  setTimezone: (timezone?: string) => void;
  hour: number;
  setHour: (hour: number) => void;
  minute: number;
  setMinute: (minute: number) => void;
  amPm: "am" | "pm";
  setAmPm: (amPm: "am" | "pm") => void;
}

const MobileTime = ({
  type,
  timezone,
  setTimezone,
  hour,
  setHour,
  minute,
  setMinute,
  amPm,
  setAmPm,
}: TimeProps) => {
  return (
    <Box>
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
      {Boolean(type === "time" || type === "datetime") && (
        <Box paddingY={2}>
          <TimezonePicker hideTitle timezone={timezone} onChange={setTimezone} />
        </Box>
      )}
    </Box>
  );
};

// TODO: Support a typeahead dropdown for time picker, similar to Google Calendar on the web.
const WebTime = ({
  type,
  timezone,
  setTimezone,
  hour,
  setHour,
  minute,
  setMinute,
  amPm,
  setAmPm,
}: TimeProps) => {
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
        <SelectField
          options={[
            {label: "am", value: "am"},
            {label: "pm", value: "pm"},
          ]}
          value={amPm}
          onChange={(result) => {
            setAmPm(result as "am" | "pm");
          }}
        />
      </Box>
      {Boolean(type === "time" || type === "datetime") && (
        <Box>
          <TimezonePicker hideTitle timezone={timezone} onChange={setTimezone} />
        </Box>
      )}
    </Box>
  );
};

const DateCalendar = ({
  type,
  onChange,
  onDismiss,
  date,
  setDate,
  timezone,
}: {
  type: DateTimeActionSheetProps["type"];
  date: string;
  timezone: string | undefined;
  setDate: (date: string) => void;
  onChange: DateTimeActionSheetProps["onChange"];
  onDismiss: DateTimeActionSheetProps["onDismiss"];
}): React.ReactElement => {
  const {theme} = useTheme();

  const markedDates: {
    [id: string]: {selected: boolean; selectedColor: string; customStyles?: any};
  } = {};

  // Check if the date is T00:00:00.000Z (it should be), otherwise treat it as a date in the
  // current timezone.
  const dt = DateTime.fromISO(date);
  let dateString: string;
  if (dt.hour === 0 && dt.minute === 0 && dt.second === 0) {
    dateString = dt.toISO()!;
  } else {
    dateString = dt.setZone().toISO()!;
  }

  if (date) {
    const displayDate = timezone
      ? DateTime.fromISO(dateString).setZone(timezone).toFormat("yyyy-MM-dd")
      : DateTime.fromISO(dateString).toFormat("yyyy-MM-dd");
    markedDates[displayDate] = {
      selected: true,
      selectedColor: theme.text.primary,
      customStyles: {
        container: {
          backgroundColor: theme.surface.secondaryDark,
          borderRadius: 4,
        },
      },
    };
  }
  return (
    <Box width="100%">
      <Box marginBottom={4} width="100%">
        <Calendar
          customHeader={CalendarHeader}
          initialDate={dateString}
          markedDates={markedDates}
          markingType="custom"
          theme={{
            todayTextColor: theme.text.accent,
            dayTextColor: theme.text.primary,
            textDayFontFamily: "text",
            textDayFontWeight: "400",
            textDayFontSize: 16,
          }}
          onDayPress={(day: {dateString: string}) => {
            setDate(day.dateString);
            // If type is just date, we can shortcut and close right away.
            // time and datetime need to wait for the primary button.
            if (type === "date") {
              onChange(day.dateString);
              onDismiss();
            }
          }}
        />
      </Box>
    </Box>
  );
};

// For mobile, renders all components in an action sheet. For web, renders all components in a
// modal. For mobile:
// If type is "time", renders a spinner picker for time picker on both platforms.
// If type is "date", renders our custom calendar on both platforms.
// If type is "datetime",renders a spinner picker for time picker and our custom calendar on both
// platforms.
// For web, renders a simplistic text box for time picker and a calendar for date picker
// in a modal.
// In the future, web time picker should be a typeahead dropdown like Google calendar.
export const DateTimeActionSheet = ({
  type = "datetime",
  value,
  onChange,
  visible,
  onDismiss,
  timezone: tz,
}: DateTimeActionSheetProps) => {
  const calendar = getCalendars()[0];
  const originalTimezone = (tz || calendar?.timeZone) ?? undefined;
  const [timezone, setTimezone] = useState<string | undefined>(originalTimezone);
  if (!timezone) {
    console.error(
      "Could not automatically determine timezone and none was provided to DateTimeActionSheet."
    );
  }

  if (typeof value !== "string" && typeof value !== "undefined") {
    console.error(`Datetime only accepts string or undefined value, not ${typeof value}: $value`);
  }

  // Accept ISO 8601, HH:mm, or hh:mm A formats. We may want only HH:mm or hh:mm A for type=time

  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [amPm, setAmPm] = useState<"am" | "pm">("am");
  const [date, setDate] = useState<string>("");

  // If the value changes in the props, update the state for the date and time.
  useEffect(() => {
    let datetime;
    if (value) {
      datetime = DateTime.fromISO(value).setZone(originalTimezone).set({millisecond: 0, second: 0});
    } else {
      datetime = DateTime.now().setZone(originalTimezone).set({millisecond: 0, second: 0});
    }
    if (!datetime.isValid) {
      console.warn(`Invalid date/time value: $value`);
      return;
    }

    let h = datetime.hour % 12;
    if (h === 0) {
      h = 12;
    }
    setHour(h);
    setMinute(datetime.minute);
    setAmPm(datetime.toFormat("a") === "AM" ? "am" : "pm");
    setDate(datetime.toISO());
    // Reset timezone when the sent date changes.
    setTimezone(originalTimezone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, originalTimezone]);

  // TODO Support 24 hour time for time picker.
  // Note: do not call this if waiting on a state change.
  const sendOnChange = () => {
    let militaryHour = hour;

    if (amPm === "am" && hour === 12) {
      militaryHour = 0;
    } else if (amPm === "pm" && hour !== 12) {
      militaryHour = Number(hour) + 12;
    }

    const dateTime = DateTime.fromISO(date, {zone: timezone});

    if (type === "date") {
      const v = dateTime.set({hour: 0, minute: 0, second: 0, millisecond: 0}).toUTC().toISO();
      if (!v || !DateTime.fromISO(v).isValid) {
        throw new Error(`Invalid date: ${date}`);
      }
      onChange(v);
    } else if (type === "time") {
      const v = dateTime
        .set({hour: militaryHour, minute, second: 0, millisecond: 0})
        .toUTC()
        .toISO();
      if (!v || !DateTime.fromISO(v).isValid) {
        throw new Error(`Invalid date: ${date}`);
      }
      onChange(v);
    } else if (type === "datetime") {
      const v = dateTime
        .set({hour: militaryHour, minute, second: 0, millisecond: 0})
        .toUTC()
        .toISO();
      if (!v || !DateTime.fromISO(v).isValid) {
        throw new Error(`Invalid date: ${date}`);
      }
      onChange(v);
    }
    onDismiss();
  };

  const sendClear = () => {
    onChange("");
    onDismiss();
  };

  const dateProps = useMemo(
    () => ({
      date,
      type,
      timezone,
      setDate,
      onChange,
      onDismiss,
    }),
    [date, type, setDate, onChange, onDismiss, timezone]
  );

  const timeProps = useMemo(
    () => ({
      type,
      timezone,
      setTimezone,
      hour,
      setHour,
      minute,
      setMinute,
      amPm,
      setAmPm,
    }),
    [type, timezone, setTimezone, hour, setHour, minute, setMinute, amPm, setAmPm]
  );

  return (
    <Modal
      primaryButtonOnClick={sendOnChange}
      primaryButtonText="Save"
      secondaryButtonOnClick={sendClear}
      secondaryButtonText="Clear"
      size="sm"
      visible={visible}
      onDismiss={onDismiss}
    >
      <View style={{width: "100%", display: "flex", justifyContent: "center"}}>
        {Boolean(type === "date") && <DateCalendar {...dateProps} />}
        {Boolean(type === "time" && isMobileDevice()) && <MobileTime {...timeProps} />}
        {Boolean(type === "time" && !isMobileDevice()) && <WebTime {...timeProps} />}
        {Boolean(type === "datetime") && (
          <Box>
            <Box marginBottom={2}>
              <DateCalendar {...dateProps} />
            </Box>
            {isMobileDevice() ? <MobileTime {...timeProps} /> : <WebTime {...timeProps} />}
          </Box>
        )}
      </View>
    </Modal>
  );
};
