import Header from "@/components/Header";
import { TextInput, ListSelect } from "@/components/Inputs";
import Text from "@/components/Text";
import View from "@/components/View";
import { TodoContext } from "@/context/TodoContext";
import { Repeat } from "@/entities/Repeat";
import { RepeatType, RepeatUnit } from "@/utilities/types";
import { useRouter } from "expo-router";
import { useContext } from "react";

const TYPE_OPTIONS = [
  { key: "none", value: null },
  { key: "todo", value: "todo" },
  { key: "calendar", value: "calendar" },
];

const UNIT_OPTIONS = [
  { key: "day", value: "day" },
  { key: "week", value: "week" },
  { key: "month", value: "month" },
  { key: "year", value: "year" },
];

const WEEK_OPTIONS = [
  { key: "s", value: 0 },
  { key: "m", value: 1 },
  { key: "t", value: 2 },
  { key: "w", value: 3 },
  { key: "t", value: 4 },
  { key: "f", value: 5 },
  { key: "s", value: 6 },
];

export default function RepeatOptions() {
  const router = useRouter();
  const { repeat, setRepeat } = useContext(TodoContext);

  const headerItems = [
    { type: "button", text: "done", onPress: router.back } as const,
  ];

  const onTypeChange = (type: RepeatType | null) => {
    setRepeat(type ? new Repeat(type) : null);
  };

  return (
    <View className="gap-md bg-neutral-0" grow safe>
      <Header items={headerItems} />
      <View className="gap-lg px-xl">
        <View className="gap-sm">
          <Text style="secondary">type</Text>
          <ListSelect
            options={TYPE_OPTIONS}
            selected={repeat ? repeat.type : null}
            onSelect={onTypeChange}
            unique
          />
        </View>
        {repeat && (
          <>
            <View className="gap-sm">
              <Text style="secondary">every</Text>
              <TextInput
                value={repeat.frequency.multiple.toString()}
                onChangeText={(multiple) =>
                  repeat.withMultiple(Number(multiple))
                }
              />
              <ListSelect
                options={UNIT_OPTIONS}
                selected={repeat.frequency.unit}
                onSelect={(unit) => setRepeat(repeat.withUnit(unit))}
                unique
              />
            </View>
            {repeat.type === "calendar" && (
              <View className="gap-sm">
                <Text style="secondary">on</Text>
                <ListSelect
                  options={WEEK_OPTIONS}
                  selected={repeat.frequency.on}
                  onSelect={(on) => setRepeat(repeat.withOn(on))}
                  unique={false}
                />
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}
