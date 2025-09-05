import { TextButton } from "@/components/Buttons";
import FormSection from "@/components/FormSection";
import Header from "@/components/Header";
import { ListSelect, TimeInput } from "@/components/Inputs";
import { View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useContext, useState, useEffect } from "react";
import { TodoContext } from "@/context/TodoContext";
import { EditContext } from "@/context/EditContext";
import { format, parse, addHours } from "date-fns";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TimeOptions() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const todoContext = useContext(TodoContext);
  const editContext = useContext(EditContext);

  // Determine which context to use based on the mode parameter
  const isCreateMode = params.mode === 'create';
  const time = isCreateMode ? todoContext.time : editContext.time;
  const setTime = isCreateMode ? todoContext.setTime : editContext.setTime;
  
  console.log("TimeOptions - Mode:", params.mode);
  console.log("TimeOptions - Current time from context:", time);
  console.log("TimeOptions - Using TodoContext?", isCreateMode);

  // Parse existing time range if it exists
  const parseTimeRange = (timeStr: string | null) => {
    if (!timeStr || timeStr === "all-day") return { start: null, end: null };

    const parts = timeStr.split("-");
    if (parts.length === 2) {
      return {
        start: parts[0].trim(),
        end: parts[1].trim(),
      };
    }
    // If it's just a single time, use it as start
    return { start: timeStr, end: null };
  };

  const existingTimes = parseTimeRange(time);
  const [startTime, setStartTime] = useState(existingTimes.start || format(new Date(), "HH:mm"));
  const [endTime, setEndTime] = useState(
    existingTimes.end || format(addHours(new Date(), 1), "HH:mm"),
  );

  const OPTIONS = {
    type: [
      { key: "interval", value: "interval" },
      { key: "all day", value: "all-day" },
      { key: "none", value: null },
    ],
  };

  // Determine current selection type
  const getSelectionType = () => {
    if (!time) return null;
    if (time === "all-day") return "all-day";
    return "interval";
  };

  const onSelect = (value: string | null) => {
    console.log("onSelect called with:", value);
    if (!value) {
      console.log("Setting time to null");
      return setTime(null);
    }

    if (value === "all-day") {
      console.log("Setting time to all-day");
      return setTime("all-day");
    }

    // Set initial time range when interval is selected
    const combinedTime = `${startTime}-${endTime}`;
    console.log("Setting time to:", combinedTime);
    setTime(combinedTime);
  };

  const onStartTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      const newStartTime = format(date, "HH:mm");
      setStartTime(newStartTime);
      const combinedTime = `${newStartTime}-${endTime}`;
      console.log("onStartTimeChange - Setting time to:", combinedTime);
      setTime(combinedTime);
    }
  };

  const onEndTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      const newEndTime = format(date, "HH:mm");
      setEndTime(newEndTime);
      const combinedTime = `${startTime}-${newEndTime}`;
      console.log("onEndTimeChange - Setting time to:", combinedTime);
      setTime(combinedTime);
    }
  };

  return (
    <SafeAreaView className="gap-mg flex-1 bg-neutral-50">
      <Header>
        <TextButton onPress={router.back}>done</TextButton>
      </Header>
      <View className="gap-lg px-xl">
        <FormSection title="type">
          <ListSelect
            options={OPTIONS.type}
            selected={getSelectionType()}
            onSelect={onSelect}
            unique
          />
        </FormSection>
        {time && time !== "all-day" && (
          <FormSection title="times">
            <TimeInput
              label="start"
              value={parse(startTime, "HH:mm", new Date())}
              onChange={onStartTimeChange}
            />
            <TimeInput
              label="end"
              value={parse(endTime, "HH:mm", new Date())}
              onChange={onEndTimeChange}
            />
          </FormSection>
        )}
      </View>
    </SafeAreaView>
  );
}
