import { TextButton } from "@/components/Buttons";
import FormSection from "@/components/FormSection";
import Header from "@/components/Header";
import { ListSelect, TimeInput } from "@/components/Inputs";
import View from "@/components/View";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { TodoContext } from "@/context/TodoContext";
import { format, parse } from "date-fns";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";

export default function TimeOptions() {
  const router = useRouter();
  const { time, setTime } = useContext(TodoContext);

  const OPTIONS = {
    type: [
      { key: "interval", value: format(new Date(), "HH:mm") },
      { key: "allday", value: "all-day" },
      { key: "none", value: null },
    ],
  };

  const onSelect = (value: string | null) => {
    if (!value) return setTime(null);

    if (value === "all-day") return setTime("all-day");

    setTime(format(new Date(), "HH:mm"));
  };

  const onTimeChange = (event: DateTimePickerEvent, date: Date) => {
    setTime(format(date, "HH:mm"));
  };

  return (
    <View className="gap-md bg-neutral-0" grow safe>
      <Header>
        <TextButton onPress={router.back}>done</TextButton>
      </Header>
      <View className="gap-lg px-xl">
        <FormSection title="type">
          <ListSelect options={OPTIONS.type} selected={time} onSelect={onSelect} unique />
        </FormSection>
        {time && time != "all-day" && (
          <TimeInput
            label="start"
            value={time ? parse(time, "HH:mm", new Date()) : new Date()}
            onChange={onTimeChange}
          />
        )}
      </View>
    </View>
  );
}
