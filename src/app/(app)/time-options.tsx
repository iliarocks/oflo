import { TextButton } from "@/components/Buttons";
import FormSection from "@/components/FormSection";
import Header from "@/components/Header";
import { ListSelect, TimeInput } from "@/components/Inputs";
import View from "@/components/View";
import { useRouter } from "expo-router";
import { useContext, useState, useEffect } from "react";
import { TodoContext } from "@/context/TodoContext";
import { EditContext } from "@/context/EditContext";
import { format, parse, addHours } from "date-fns";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";

export default function TimeOptions() {
  const router = useRouter();
  const todoContext = useContext(TodoContext);
  const editContext = useContext(EditContext);
  
  // Use EditContext if we're editing, otherwise use TodoContext
  const isEditing = editContext.editingTodo || editContext.editingTemplate;
  const time = isEditing ? editContext.time : todoContext.time;
  const setTime = isEditing ? editContext.setTime : todoContext.setTime;
  
  // Parse existing time range if it exists
  const parseTimeRange = (timeStr: string | null) => {
    if (!timeStr || timeStr === "all-day") return { start: null, end: null };
    
    const parts = timeStr.split("-");
    if (parts.length === 2) {
      return {
        start: parts[0].trim(),
        end: parts[1].trim()
      };
    }
    // If it's just a single time, use it as start
    return { start: timeStr, end: null };
  };
  
  const existingTimes = parseTimeRange(time);
  const [startTime, setStartTime] = useState(existingTimes.start || format(new Date(), "HH:mm"));
  const [endTime, setEndTime] = useState(existingTimes.end || format(addHours(new Date(), 1), "HH:mm"));

  const OPTIONS = {
    type: [
      { key: "interval", value: "interval" },
      { key: "allday", value: "all-day" },
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
    if (!value) return setTime(null);

    if (value === "all-day") return setTime("all-day");

    // Set initial time range when interval is selected
    const combinedTime = `${startTime}-${endTime}`;
    setTime(combinedTime);
  };

  const onStartTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      const newStartTime = format(date, "HH:mm");
      setStartTime(newStartTime);
      const combinedTime = `${newStartTime}-${endTime}`;
      setTime(combinedTime);
    }
  };

  const onEndTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      const newEndTime = format(date, "HH:mm");
      setEndTime(newEndTime);
      const combinedTime = `${startTime}-${newEndTime}`;
      setTime(combinedTime);
    }
  };

  return (
    <View className="gap-md bg-neutral-0" grow safe>
      <Header>
        <TextButton onPress={router.back}>done</TextButton>
      </Header>
      <View className="gap-lg px-xl">
        <FormSection title="type">
          <ListSelect options={OPTIONS.type} selected={getSelectionType()} onSelect={onSelect} unique />
        </FormSection>
        {time && time !== "all-day" && (
          <>
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
          </>
        )}
      </View>
    </View>
  );
}
