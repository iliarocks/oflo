import Header from "@/components/Header";
import { format } from "date-fns";
import { View } from "react-native";
import { TextInput, ListSelect } from "@/components/Inputs";
import { useRouter } from "expo-router/build/hooks";
import { useContext } from "react";
import { TextButton } from "@/components/Buttons";
import type { Option } from "@/components/Inputs";
import { generateKeyBetween } from "@/utilities/fractional";
import { db, id } from "@/utilities/database";
import { useUser } from "@/hooks/useUser";
import _ from "lodash";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormContext } from "@/context/FormContext";
import { ORDER, queries } from "@/utilities/items";
import DateTimeOptions from "@/components/DateTimeOptions";

export default function Create() {
  const { label, date, time, repeat, setLabel, setDate } = useContext(FormContext);
  const router = useRouter();
  const user = useUser();

  const pushItem = async () => {
    const { data } = await db.queryOnce(queries.all(user));

    const firstItem = _.orderBy(data.todos, ["position"], [ORDER])[0]?.position ?? null;

    if (!repeat) {
      const todo = {
        label: label,
        date: date ? format(date, "yyyy-MM-dd") : null,
        time: time ?? null,
        completed: false,
        position: generateKeyBetween(null, firstItem),
      };
      await db.transact(db.tx.todos[id()].create(todo).link({ user: user.id }));
    }

    if (repeat) {
      const template = {
        label: label,
        time: time,
        date: date ? format(date, "yyyy-MM-dd") : null,
        repeat: repeat,
      };
      await db.transact(db.tx.templates[id()].create(template).link({ user: user.id }));
    }

    router.back();
  };

  const placeOptions: Option[] = [
    { key: "inbox", value: null },
    { key: "date", value: date || new Date() },
  ];

  return (
    <SafeAreaView className="flex-1 justify-between bg-neutral-50">
      <View className="gap-md">
        <Header>
          <TextButton onPress={router.back}>cancel</TextButton>
        </Header>
        <View className="gap-lg px-xl">
          <View className="gap-sm">
            <TextInput value={label || ""} label="label" onChangeText={setLabel} />
          </View>
          <ListSelect options={placeOptions} selected={date} onSelect={setDate} unique />
          <DateTimeOptions />
        </View>
      </View>
      <View className="px-xl">
        <TextButton onPress={pushItem}>save</TextButton>
      </View>
    </SafeAreaView>
  );
}
