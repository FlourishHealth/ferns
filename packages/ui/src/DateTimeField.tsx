import {DateTime} from "luxon";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {TextInput, View} from "react-native";

import {Box} from "./Box";
import {DateTimeFieldProps, IconName} from "./Common";
import {DateTimeActionSheet} from "./DateTimeActionSheet";
import {IconButton} from "./IconButton";
import {isMobileDevice} from "./MediaQuery";
import {SelectField} from "./SelectField";
import {Text} from "./Text";
import {useTheme} from "./Theme";
import {TimezonePicker} from "./TimezonePicker";

interface SeparatorProps {
  type: "date" | "time";
}

const Separator: React.FC<SeparatorProps> = ({type}) => {
  return (
    <View>
      <Text>{type === "time" ? ":" : "/"}</Text>
    </View>
  );
};

interface DateTimeSegmentProps {
  config: FieldConfig;
  disabled?: boolean;
  getFieldValue: (index: number) => string;
  handleFieldChange: (index: number, text: string, config: FieldConfig) => void;
  onBlur: (override?: {amPm?: "am" | "pm"; timezone?: string}) => void;
  onRef: (ref: TextInput | null, index: number) => void;
  index: number;
}

const DateTimeSegment: React.FC<DateTimeSegmentProps> = ({
  disabled,
  getFieldValue,
  handleFieldChange,
  onBlur,
  onRef,
  index,
  config,
}): React.ReactElement => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: config.width,
        borderColor: "transparent",
        backgroundColor: "transparent",
        overflow: "hidden",
        padding: 0,
        flexShrink: 1,
        height: 40,
      }}
    >
      <TextInput
        ref={(el) => onRef(el, index)}
        accessibilityHint={`Enter the ${config.placeholder}`}
        aria-label="Text input field"
        inputMode="numeric"
        placeholder={config.placeholder}
        readOnly={disabled}
        selectTextOnFocus
        style={{width: config.width - 2, textAlign: "center"}}
        value={getFieldValue(index)}
        onBlur={() => onBlur()}
        onChangeText={(text) => {
          handleFieldChange(index, text, config);
        }}
      />
    </View>
  );
};

interface DateTimeProps extends Omit<DateTimeSegmentProps, "index" | "config"> {
  fieldConfigs: FieldConfig[];
  type: "date" | "datetime" | "time";
}

const DateField: React.FC<DateTimeProps> = (segmentProps) => {
  return (
    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
      <DateTimeSegment {...segmentProps} config={segmentProps.fieldConfigs[0]} index={0} />
      <Separator type="date" />
      <DateTimeSegment {...segmentProps} config={segmentProps.fieldConfigs[1]} index={1} />
      <Separator type="date" />
      <DateTimeSegment {...segmentProps} config={segmentProps.fieldConfigs[2]} index={2} />
    </View>
  );
};

const TimeField: React.FC<DateTimeProps> = ({
  type,
  onBlur,

  ...segmentProps
}) => {
  return (
    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
      <DateTimeSegment
        {...segmentProps}
        config={segmentProps.fieldConfigs[0]}
        index={type === "time" ? 0 : 3}
        onBlur={onBlur}
      />
      <Separator type="time" />
      <DateTimeSegment
        {...segmentProps}
        config={segmentProps.fieldConfigs[1]}
        index={type === "time" ? 1 : 4}
        onBlur={onBlur}
      />
    </View>
  );
};

type FieldConfig = {
  maxLength: number;
  placeholder: string;
  width: number;
};

export const DateTimeField: React.FC<DateTimeFieldProps> = ({
  type,
  value,
  onChange,
  timezone: providedTimezone,
  onTimezoneChange,
  errorText,
  disabled,
}): React.ReactElement => {
  const {theme} = useTheme();
  const dateActionSheetRef: React.RefObject<any> = React.createRef();
  const [amPm, setAmPm] = useState<"am" | "pm">("am");
  const [showDate, setShowDate] = useState(false);
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [localTimezone, setLocalTimezone] = useState(
    providedTimezone ?? DateTime.local().zoneName ?? "UTC"
  );

  // Use provided timezone if available, otherwise use local
  const timezone = providedTimezone ?? localTimezone;
  const lastTimezoneRef = useRef(timezone);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  let iconName: IconName | undefined;
  if (disabled) {
    iconName = undefined;
  } else if (type === "time") {
    iconName = "clock";
  } else {
    iconName = "calendar";
  }

  let borderColor = theme.border.dark;
  if (disabled) {
    borderColor = theme.border.activeNeutral;
  } else if (errorText) {
    borderColor = theme.border.error;
  }

  const getFieldConfigs = useCallback((): FieldConfig[] => {
    const configs: FieldConfig[] = [];
    if (type === "date" || type === "datetime") {
      configs.push(
        {maxLength: 2, placeholder: "MM", width: 40},
        {maxLength: 2, placeholder: "DD", width: 30},
        {maxLength: 4, placeholder: "YYYY", width: 50}
      );
    }
    if (type === "time" || type === "datetime") {
      configs.push(
        {maxLength: 2, placeholder: "HH", width: 30},
        {maxLength: 2, placeholder: "MM", width: 30}
      );
    }
    return configs;
  }, [type]);

  // Set the inputRefs array to the correct length
  useEffect(() => {
    const configs = getFieldConfigs();
    inputRefs.current = configs.map(() => null);
  }, [getFieldConfigs]);

  const getISOFromFields = useCallback(
    (override?: {amPm?: "am" | "pm"; timezone?: string; minute?: string}): string | undefined => {
      const ampPmVal = override?.amPm ?? amPm;
      const minuteVal = override?.minute ?? minute;
      let date;
      if (type === "datetime") {
        if (!month || !day || !year || !hour || !minuteVal) {
          return undefined;
        }
        let hourNum = parseInt(hour);
        if (ampPmVal === "pm" && hourNum !== 12) {
          hourNum += 12;
        } else if (ampPmVal === "am" && hourNum === 12) {
          hourNum = 0;
        }
        date = DateTime.fromObject(
          {
            year: parseInt(year),
            month: parseInt(month),
            day: parseInt(day),
            hour: hourNum,
            minute: parseInt(minuteVal),
          },
          {
            zone: override?.timezone ?? timezone,
          }
        );
      } else if (type === "date") {
        if (!month || !day || !year) {
          return undefined;
        }
        date = DateTime.fromObject(
          {
            year: parseInt(year),
            month: parseInt(month),
            day: parseInt(day),
          },
          {
            zone: override?.timezone ?? timezone,
          }
        );
      } else {
        if (!hour || !minuteVal) {
          return undefined;
        }
        let hourNum = parseInt(hour);
        if (ampPmVal === "pm" && hourNum !== 12) {
          hourNum += 12;
        } else if (ampPmVal === "am" && hourNum === 12) {
          hourNum = 0;
        }
        date = DateTime.fromObject(
          {
            hour: hourNum,
            minute: parseInt(minuteVal),
          },
          {
            zone: override?.timezone ?? timezone,
          }
        );
      }

      if (date.isValid) {
        // Always return UTC ISO string
        return date.toUTC().toISO();
      }
      return undefined;
    },
    [amPm, month, day, year, hour, minute, timezone, type]
  );

  const handleFieldChange = useCallback(
    (index: number, text: string, config: FieldConfig) => {
      const numericValue = text.replace(/[^0-9]/g, "");

      // For minutes, just ensure it's at most 2 digits and valid (0-59)
      if ((type === "time" && index === 1) || (type === "datetime" && index === 4)) {
        // For minutes, take the last two digits and remove leading zeros unless it would be empty
        const finalValue = numericValue.slice(-2).replace(/^0+(?=\d)/, "");
        const minuteNum = parseInt(finalValue);

        // Only update if it's a valid minute value
        if (!isNaN(minuteNum) && minuteNum >= 0 && minuteNum <= 59) {
          setMinute(finalValue);

          // Pass the new minute value directly to getISOFromFields
          const result = getISOFromFields({minute: finalValue});
          if (result) {
            const currentValueUTC = value ? DateTime.fromISO(value).toUTC().toISO() : undefined;
            if (result !== currentValueUTC) {
              onChange(result);
            }
          }
        }

        // Auto-advance to next field if current field is full
        const configs = getFieldConfigs();
        if (finalValue.length === config.maxLength && index < configs.length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
        return;
      }

      // For other fields, handle leading zeros
      const finalValue =
        numericValue.length > config.maxLength
          ? numericValue.replace(/^0+/, "").slice(0, config.maxLength)
          : numericValue;

      if (type === "date" || type === "datetime") {
        if (index === 0) setMonth(finalValue);
        if (index === 1) setDay(finalValue);
        if (index === 2) setYear(finalValue);
      }

      if (type === "time") {
        if (index === 0) setHour(finalValue);
      }

      if (type === "datetime") {
        if (index === 3) setHour(finalValue);
      }

      // We use getISOFromFields to ensure the value is valid and current
      const result = getISOFromFields();
      if (result) {
        const currentValueUTC = value ? DateTime.fromISO(value).toUTC().toISO() : undefined;
        if (result !== currentValueUTC) {
          onChange(result);
        }
      }

      // Auto-advance to next field if current field is full
      const configs = getFieldConfigs();
      if (finalValue.length === config.maxLength && index < configs.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [type, getFieldConfigs, getISOFromFields, onChange, value]
  );

  const onActionSheetChange = useCallback(
    (inputDate: string) => {
      const parsedDate = DateTime.fromISO(inputDate);
      if (!parsedDate.isValid) {
        console.warn("Invalid date passed to DateTimeField", inputDate);
        return;
      }
      setAmPm(parsedDate.hour >= 12 ? "pm" : "am");

      if (type === "date" || type === "datetime") {
        setMonth(parsedDate.month.toString().padStart(2, "0"));
        setDay(parsedDate.day.toString().padStart(2, "0"));
        setYear(parsedDate.year.toString());
      }

      if (type === "time" || type === "datetime") {
        let hourNum = parsedDate.hour % 12;
        hourNum = hourNum === 0 ? 12 : hourNum;
        setHour(hourNum.toString().padStart(2, "0"));
        setMinute(parsedDate.minute.toString().padStart(2, "0"));
      }
      onChange(inputDate);
      setShowDate(false);
    },
    [onChange, type]
  );

  // When fields change, send the value to onChange
  const onBlur = useCallback(
    (override?: {amPm?: "am" | "pm"}) => {
      const iso = getISOFromFields(override);
      // Compare in UTC to avoid timezone issues
      const currentValueUTC = value ? DateTime.fromISO(value).toUTC().toISO() : undefined;
      if (iso && iso !== currentValueUTC) {
        onChange(iso);
      }
    },
    [getISOFromFields, onChange, value]
  );

  // Handle external value changes
  useEffect(() => {
    if (!value) {
      return;
    }

    // // If only timezone changed, don't recalculate fields
    const isOnlyTimezoneChange =
      lastTimezoneRef.current !== timezone &&
      DateTime.fromISO(value).toUTC().toISO() ===
        DateTime.fromISO(value).setZone(timezone).toUTC().toISO();

    lastTimezoneRef.current = timezone;

    if (isOnlyTimezoneChange) {
      return;
    }

    const parsedDate = DateTime.fromISO(value).setZone(timezone);
    if (!parsedDate.isValid) {
      console.warn("Invalid date passed to DateTimeField", value);
      return;
    }
    setAmPm(parsedDate.hour >= 12 ? "pm" : "am");

    if (type === "date" || type === "datetime") {
      setMonth(parsedDate.month.toString().padStart(2, "0"));
      setDay(parsedDate.day.toString().padStart(2, "0"));
      setYear(parsedDate.year.toString());
    }

    if (type === "time" || type === "datetime") {
      let hourNum = parsedDate.hour % 12;
      hourNum = hourNum === 0 ? 12 : hourNum;
      setHour(hourNum.toString().padStart(2, "0"));
      setMinute(parsedDate.minute.toString().padStart(2, "0"));
    }
  }, [value, type, timezone]);

  // JOSH: This is where the infinite loop is happening
  // We update the value of the date according to the zone and then this get triggered
  // and we update the value of the date according to the zone again
  const getFieldValue = useCallback(
    (index: number): string => {
      if (type === "date" || type === "datetime") {
        if (index === 0) return month;
        if (index === 1) return day;
        if (index === 2) return year;
      }

      if (type === "time") {
        if (index === 0) return hour;
        if (index === 1) return minute;
      }

      if (type === "datetime") {
        if (index === 3) return hour;
        if (index === 4) return minute;
      }

      return "";
    },
    [type, month, day, year, hour, minute]
  );

  const fieldConfigs = getFieldConfigs();

  const segmentProps = {
    disabled,
    getFieldValue,
    handleFieldChange,
    onBlur,
    fieldConfigs,
    onRef: (el: TextInput | null, i: number) => (inputRefs.current[i] = el),
  };

  return (
    <>
      <View
        style={{
          flexDirection: isMobileDevice() ? "column" : "row",
          borderColor,
          backgroundColor: theme.surface.base,
          borderWidth: 1,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 4,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {(type === "date" || type === "datetime") && (
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <DateField {...segmentProps} type={type} />
            {!disabled && type === "date" && (
              <IconButton
                accessibilityHint="Opens the calendar to select a date and time"
                accessibilityLabel="Show calendar"
                iconName={iconName!}
                variant="muted"
                onClick={() => setShowDate(true)}
              />
            )}
          </View>
        )}

        <View style={{flexDirection: "row", alignItems: "center"}}>
          {(type === "time" || type === "datetime") && <TimeField {...segmentProps} type={type} />}
          {Boolean(type === "datetime" || type === "time") && (
            <>
              <Box direction="column" marginLeft={2} marginRight={2} width={60}>
                <SelectField
                  disabled={disabled}
                  options={[
                    {label: "am", value: "am"},
                    {label: "pm", value: "pm"},
                  ]}
                  requireValue
                  value={amPm}
                  onChange={(result) => {
                    setAmPm(result as "am" | "pm");
                    // We need to call onBlur manually because the SelectField doesn't support it
                    onBlur({amPm: result as "am" | "pm"});
                  }}
                />
              </Box>
              <Box direction="column" marginRight={2} width={70}>
                <TimezonePicker
                  disabled={disabled}
                  hideTitle
                  shortTimezone
                  timezone={timezone}
                  onChange={(t) => {
                    if (onTimezoneChange) {
                      onTimezoneChange(t);
                    } else {
                      setLocalTimezone(t);
                    }
                    const iso = getISOFromFields({timezone: t});
                    // Compare in UTC to avoid timezone issues
                    const currentValueUTC = value
                      ? DateTime.fromISO(value).toUTC().toISO()
                      : undefined;
                    if (iso && iso !== currentValueUTC) {
                      onChange(iso);
                    }
                  }}
                />
              </Box>
            </>
          )}

          {!disabled && type === "datetime" && (
            <IconButton
              accessibilityHint="Opens the calendar to select a date and time"
              accessibilityLabel="Show calendar"
              iconName={iconName!}
              variant="muted"
              onClick={() => setShowDate(true)}
            />
          )}
        </View>
      </View>

      {!disabled && (
        <DateTimeActionSheet
          actionSheetRef={dateActionSheetRef}
          timezone={timezone}
          type={type}
          value={value}
          visible={showDate}
          onChange={onActionSheetChange}
          onDismiss={() => setShowDate(false)}
        />
      )}
    </>
  );
};
