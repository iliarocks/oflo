import Header from "@/components/Header";
import View from "@/components/View";
import Text from "@/components/Text";
import TextInput, { ToggleSelect } from "@/components/Inputs";
import { useRouter } from "expo-router/build/hooks";
import { useState } from "react";
import { startOfToday } from "date-fns";
import Calendar from "@/components/Calendar";
import { TextButton } from "@/components/Buttons";

export default function Create() {
  const router = useRouter();
  const [label, setLabel] = useState<string>("");
  const [hasDate, setHasDate] = useState<boolean>(false);
  const [calendarDate, setCalendarDate] = useState<Date>(startOfToday);

  const headerItems = [
    {
      type: "label",
      text: "create",
    },
    {
      type: "button",
      text: "close",
      onPress: router.back,
    },
  ];

  const toggleOptions = [
    {
      key: "inbox",
      value: false,
    },
    {
      key: "date",
      value: true,
    },
  ];

  const pushTodo = () => {
    console.log("date: ", hasDate ? calendarDate : null);
    console.log("label: ", label);
    router.back();
  };

  return (
    <View className="justify-between bg-neutral-0" grow safe>
      <View className="gap-md">
        <Header items={headerItems} />
        <View className="gap-lg px-xl">
          <View className="gap-sm">
            <Text style="secondary">label</Text>
            <TextInput value={label} onChangeText={setLabel} />
          </View>
          <ToggleSelect options={toggleOptions} onToggle={setHasDate} />
          <View className={hasDate ? "" : "invisible"}>
            <Calendar
              selectedDate={calendarDate}
              onDateSelect={setCalendarDate}
            />
          </View>
        </View>
      </View>
      <View className="px-xl">
        <TextButton onPress={pushTodo}>save</TextButton>
      </View>
    </View>
  );
}
