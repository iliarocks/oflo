import Header from "@/components/Header";
import View from "@/components/View";
import Text from "@/components/Text";
import { TextInput, ListSelect } from "@/components/Inputs";
import { useRouter } from "expo-router/build/hooks";
import { useContext } from "react";
import Calendar from "@/components/Calendar";
import { TextButton } from "@/components/Buttons";
import { TodoContext } from "@/context/TodoContext";
import { Pressable } from "react-native";
import { Option } from "@/utilities/types";
import { startOfToday } from "date-fns";

export default function Create() {
  const router = useRouter();
  const { label, date, repeat, setLabel, setDate, resetTodo } =
    useContext(TodoContext);

  const pushTodo = () => {
    console.log({ label, date, repeat });
    close();
  };

  const close = () => {
    resetTodo();
    router.back();
  };

  const headerItems = [
    { type: "label", text: "create" } as const,
    { type: "button", text: "cancel", onPress: close } as const,
  ];

  const placeOptions: Option[] = [
    { key: "inbox", value: null },
    { key: "date", value: date || startOfToday },
  ];

  return (
    <View className="justify-between bg-neutral-0" grow safe>
      <View className="gap-md">
        <Header items={headerItems} />
        <View className="gap-lg px-xl">
          <View className="gap-sm">
            <Text style="secondary">label</Text>
            <TextInput value={label} onChangeText={setLabel} />
          </View>
          <ListSelect
            options={placeOptions}
            selected={date}
            onSelect={setDate}
            unique
          />
          {date && <DateOptions date={date} onDateChange={setDate} />}
        </View>
      </View>
      <View className="px-xl">
        <TextButton onPress={pushTodo}>save</TextButton>
      </View>
    </View>
  );
}

type DateOptionsProps = {
  date: Date;
  onDateChange: (date: Date) => void;
};

function DateOptions({ date, onDateChange }: DateOptionsProps) {
  const router = useRouter();

  return (
    <>
      <Calendar selectedDate={date} onDateSelect={onDateChange} />
      <Pressable
        className="bg-neutral-5 p-md"
        onPress={() => router.navigate("/repeat-options")}
      >
        <Text>repeat</Text>
      </Pressable>
    </>
  );
}
