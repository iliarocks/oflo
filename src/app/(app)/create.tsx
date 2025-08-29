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
import { db, id } from "@/utilities/database";
import { useUser } from "@/hooks/useUser";
import { generateKeyBetween } from "fractional-indexing";
import _ from "lodash";

export default function Create() {
  const router = useRouter();
  const { label, date, time, repeat, setLabel, setDate, setRepeat, resetTodo } =
    useContext(TodoContext);
  const user = useUser();

  const pushTodo = async () => {
    const { data } = await db.queryOnce({
      todos: {
        $: {
          where: {
            user: user.id,
          },
        },
      },
    });

    const first = _.orderBy(data.todos, ["position"], ["asc"])[0]?.position;

    if (!repeat) {
      const todoId = id();
      const todo = {
        label: label,
        date: date,
        time: time,
        complete: false,
        position: generateKeyBetween(null, first);
      };
      db.transact(db.tx.todos[todoId].update(todo).link({ user: user.id }));
    } else {
      const templateId = id();
      const template = {
        label: label,
        time: time,
        date: date,
        repeat: repeat,
      };
      console.log(template);
      await db.transact(db.tx.templates[templateId].create(template).link({ user: user.id }));
      console.log(JSON.stringify(e, null, 2));
    }
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
