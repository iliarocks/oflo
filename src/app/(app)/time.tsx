import { TextButton } from "@/components/Buttons";
import FormSection from "@/components/FormSection";
import Header from "@/components/Header";
import { ListSelect, TimeInput } from "@/components/Inputs";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { FormContext } from "@/context/FormContext";
import { format, parse, addHours } from "date-fns";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";

const OPTIONS = [
  { key: "interval", value: "interval" },
  { key: "all day", value: "all-day" },
  { key: "none", value: null },
];

export default function TimeOptions() {
  const router = useRouter();
  const { time, setTime } = useContext(FormContext);

  // Parse time range for interval times
  const parseTime = (timeStr: string | null) => {
    if (!timeStr || timeStr === "all-day") return { start: "09:00", end: "10:00" };
    const [start, end] = timeStr.split("-").map(t => t.trim());
    return { start: start || "09:00", end: end || "10:00" };
  };

  const { start, end } = parseTime(time);
  const [startTime, setStartTime] = useState(start);
  const [endTime, setEndTime] = useState(end);

  // Get current selection type
  const selectedType = !time ? null : time === "all-day" ? "all-day" : "interval";

  const handlers = {
    type: (value: string | null) => {
      if (!value) return setTime(null);
      if (value === "all-day") return setTime("all-day");
      setTime(`${startTime}-${endTime}`);
    },
    start: (event: DateTimePickerEvent, date?: Date) => {
      if (!date) return;
      const newStart = format(date, "HH:mm");
      setStartTime(newStart);
      setTime(`${newStart}-${endTime}`);
    },
    end: (event: DateTimePickerEvent, date?: Date) => {
      if (!date) return;
      const newEnd = format(date, "HH:mm");
      setEndTime(newEnd);
      setTime(`${startTime}-${newEnd}`);
    },
  };

  return (
    <SafeAreaView className="flex-1 gap-md bg-neutral-50">
      <Header>
        <TextButton onPress={router.back}>done</TextButton>
      </Header>
      <View className="gap-lg px-xl">
        <FormSection title="type">
          <ListSelect options={OPTIONS} selected={selectedType} onSelect={handlers.type} unique />
        </FormSection>
        {selectedType === "interval" && (
          <FormSection title="times">
            <TimeInput
              label="start"
              value={parse(startTime, "HH:mm", new Date())}
              onChange={handlers.start}
            />
            <TimeInput
              label="end"
              value={parse(endTime, "HH:mm", new Date())}
              onChange={handlers.end}
            />
          </FormSection>
        )}
      </View>
    </SafeAreaView>
  );
}
