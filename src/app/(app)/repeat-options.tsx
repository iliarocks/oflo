import { TextButton } from "@/components/Buttons";
import Header from "@/components/Header";
import { ListSelect, TextInput } from "@/components/Inputs";
import Text from "@/components/Text";
import View from "@/components/View";
import { TodoContext } from "@/context/TodoContext";
import { Repeat } from "@/entities/Repeat";
import { Option, RepeatType, RepeatUnit } from "@/utilities/types";
import { useRouter } from "expo-router";
import _ from "lodash";
import { useContext } from "react";

const TYPE_OPTIONS: Option[] = [
  { key: "none", value: null },
  { key: "todo", value: "todo" },
  { key: "calendar", value: "calendar" },
];

const UNIT_OPTIONS: Option[] = [
  { key: "day", value: "day" },
  { key: "week", value: "week" },
  { key: "month", value: "month" },
  { key: "year", value: "year" },
];

const WEEK_OPTIONS: Option[] = [
  { key: "s", value: 0 },
  { key: "m", value: 1 },
  { key: "t", value: 2 },
  { key: "w", value: 3 },
  { key: "t", value: 4 },
  { key: "f", value: 5 },
  { key: "s", value: 6 },
];

const MONTH_OPTIONS: Option[] = _.times(31, (i) => ({
  key: `${i + 1}`,
  value: i,
}));

export default function RepeatOptions() {
  const router = useRouter();
  const { repeat, setRepeat } = useContext(TodoContext);

  const onTypeChange = (type: RepeatType | null) => {
    setRepeat(type ? new Repeat(type) : null);
  };

  const onMultipleChange = (multiple: string) => {
    setRepeat(repeat.withMultiple(Number(multiple)));
  };

  const onUnitChange = (unit: RepeatUnit) => {
    setRepeat(repeat.withOn([0]).withUnit(unit));
  };

  const onOnChange = (on: number[]) => {
    setRepeat(repeat.withOn(on));
  };

  return (
    <View className="gap-md bg-neutral-0" grow safe>
      <Header>
        <TextButton onPress={router.back}>done</TextButton>
      </Header>
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
                onChangeText={onMultipleChange}
              />
              <ListSelect
                options={UNIT_OPTIONS}
                selected={repeat.frequency.unit}
                onSelect={onUnitChange}
                unique
              />
            </View>
            {repeat.type === "calendar" && (
              <View className="gap-sm">
                <Text style="secondary">on</Text>
                {repeat.frequency.unit === "month" && (
                  <ListSelect
                    options={MONTH_OPTIONS}
                    selected={repeat.frequency.on}
                    onSelect={onOnChange}
                    unique={false}
                  />
                )}
                {repeat.frequency.unit === "week" && (
                  <ListSelect
                    options={WEEK_OPTIONS}
                    selected={repeat.frequency.on}
                    onSelect={onOnChange}
                    unique={false}
                  />
                )}
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}
