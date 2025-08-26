import Header from "@/components/Header";
import View from "@/components/View";
import Text from "@/components/Text";
import { TextInput, ListSelect } from "@/components/Inputs";
import { useRouter } from "expo-router/build/hooks";
import { useContext } from "react";
import Calendar from "@/components/Calendar";
import { StatusButton, TextButton } from "@/components/Buttons";
import { TodoContext } from "@/context/TodoContext";
import { Option } from "@/utilities/types";
import { startOfToday } from "date-fns";
import { Repeat } from "@/entities/Repeat";

export default function Create() {
  const router = useRouter();
  const { label, date, time, repeat, setLabel, setDate, setRepeat, resetTodo } =
    useContext(TodoContext);

  const pushTodo = () => {
    console.log({ label, date, time, repeat });
    close();
  };

  const close = () => {
    resetTodo();
    router.back();
  };

  const placeOptions: Option[] = [
    { key: "inbox", value: null },
    { key: "date", value: date || startOfToday },
  ];

  return (
    <View className="justify-between bg-neutral-0" grow safe>
      <View className="gap-md">
        <Header>
          <TextButton onPress={close}>cancel</TextButton>
        </Header>
        <View className="gap-lg px-xl">
          <View className="gap-sm">
            <Text style="secondary">label</Text>
            <TextInput value={label} onChangeText={setLabel} />
          </View>
          <ListSelect options={placeOptions} selected={date} onSelect={setDate} unique />
          {date && (
            <DateOptions repeat={repeat} date={date} setRepeat={setRepeat} onDateChange={setDate} />
          )}
        </View>
      </View>
      <View className="px-xl">
        <TextButton onPress={pushTodo}>save</TextButton>
      </View>
    </View>
  );
}

type DateOptionsProps = {
  repeat: Repeat | null;
  date: Date;
  setRepeat: (repeat: Repeat | null) => void;
  onDateChange: (date: Date) => void;
};

function DateOptions({ repeat, date, setRepeat, onDateChange }: DateOptionsProps) {
  const router = useRouter();

  const openTime = () => {
    router.navigate("/time-options");
  };

  const openRepeat = () => {
    if (!repeat) setRepeat(new Repeat("todo"));
    router.navigate("/repeat-options");
  };

  return (
    <>
      <Calendar selectedDate={date} onDateSelect={onDateChange} />
      <StatusButton status="none" onPress={openTime}>
        time
      </StatusButton>
      <StatusButton status={repeat ? repeat.type : "none"} onPress={openRepeat}>
        repeat
      </StatusButton>
    </>
  );
}
