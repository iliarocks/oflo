import Header from "@/components/Header";
import { format } from "date-fns";
import { View } from "react-native";
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
import { db, id } from "@/utilities/database";
import { useUser } from "@/hooks/useUser";
import { generateKeyBetween } from "fractional-indexing";
import _ from "lodash";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Create() {
  const router = useRouter();
  const { label, date, time, repeat, setLabel, setDate, setRepeat, resetTodo } =
    useContext(TodoContext);
  const user = useUser();

  const pushTodo = async () => {
    try {
      console.log("Starting pushTodo with:", { label, date, time, repeat });

      // Validate that label is not empty
      if (!label || label.trim() === "") {
        alert("Please enter a label for the todo");
        return;
      }

      const { data } = await db.queryOnce({
        todos: {
          $: {
            where: {
              user: user.id,
            },
          },
        },
      });

      const first = _.orderBy(data.todos, ["position"], ["asc"])[0]?.position ?? null;

      if (!repeat) {
        const todoId = id();
        const todo = {
          label: label,
          date: date ? format(date, "yyyy-MM-dd") : null,
          time: time || null,
          completed: false,
          position: generateKeyBetween(null, first, "abcdefghijklmnopqrstuvwxyz"),
        };
        console.log("Creating todo:", todo);
        await db.transact(db.tx.todos[todoId].create(todo).link({ user: user.id }));
      } else {
        const templateId = id();
        const template = {
          label: label,
          time: time,
          date: date ? format(date, "yyyy-MM-dd") : date,
          repeat: repeat,
        };
        console.log("Creating template:", template);
        await db.transact(db.tx.templates[templateId].create(template).link({ user: user.id }));
      }
      close();
    } catch (error) {
      console.error("Error in pushTodo:", error);
      alert(`Error saving todo: ${error.message}`);
    }
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
    <SafeAreaView className="flex-1 justify-between bg-neutral-50">
      <View className="gap-md">
        <Header>
          <TextButton onPress={close}>cancel</TextButton>
        </Header>
        <View className="gap-lg px-xl">
          <View className="gap-sm">
            <TextInput value={label ?? ""} label="label" onChangeText={setLabel} />
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
    </SafeAreaView>
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
  const { time } = useContext(TodoContext);

  console.log("DateOptions - Current time value:", time);

  const openTime = () => {
    router.push({ pathname: "/time-options", params: { mode: "create" } });
  };

  const openRepeat = () => {
    if (!repeat) setRepeat(new Repeat("todo"));
    router.push({ pathname: "/repeat-options", params: { mode: "create" } });
  };

  const getTimeLabel = () => {
    if (!time) return "time";
    if (time === "all-day") return "all-day";
    return time; // Will show format like "14:00-15:00"
  };

  return (
    <>
      <Calendar selectedDate={date} onDateSelect={onDateChange} />
      <StatusButton status={time ? "active" : "none"} onPress={openTime}>
        {getTimeLabel()}
      </StatusButton>
      <StatusButton status={repeat ? repeat.type : "none"} onPress={openRepeat}>
        repeat
      </StatusButton>
    </>
  );
}
