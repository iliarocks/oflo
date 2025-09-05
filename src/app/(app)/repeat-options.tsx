import { TextButton } from "@/components/Buttons";
import FormSection from "@/components/FormSection";
import Header from "@/components/Header";
import { ListSelect, TextInput } from "@/components/Inputs";
import { View } from "react-native";
import { TodoContext } from "@/context/TodoContext";
import { EditContext } from "@/context/EditContext";
import { Repeat } from "@/entities/Repeat";
import { RepeatType, RepeatUnit } from "@/utilities/types";
import { useRouter, useLocalSearchParams } from "expo-router";
import _ from "lodash";
import { useContext } from "react";

const OPTIONS = {
  type: [
    { key: "todo", value: "todo" },
    { key: "calendar", value: "calendar" },
    { key: "none", value: null },
  ],
  unit: ["day", "week", "month", "year"].map((u) => ({ key: u, value: u })),
  week: "smtwtfs".split("").map((d, i) => ({ key: d, value: i })),
  month: _.times(31, (i) => ({ key: `${i + 1}`, value: i })),
};

export default function RepeatOptions() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const todoContext = useContext(TodoContext);
  const editContext = useContext(EditContext);

  // Determine which context to use based on the mode parameter
  const isCreateMode = params.mode === 'create';
  const repeat = isCreateMode ? todoContext.repeat : editContext.repeat;
  const setRepeat = isCreateMode ? todoContext.setRepeat : editContext.setRepeat;

  const handlers = {
    type: (type: RepeatType | null) => setRepeat(type ? new Repeat(type) : null),
    multiple: (multiple: string) =>
      setRepeat(repeat ? repeat.withMultiple(Number(multiple)) : null),
    unit: (unit: RepeatUnit) => setRepeat(repeat ? repeat.withOn([0]).withUnit(unit) : null),
    on: (on: number[]) => setRepeat(repeat ? repeat.withOn(on) : null),
  };

  const showCalendarOptions = repeat?.type === "calendar";
  const showOnSelector = showCalendarOptions && ["week", "month"].includes(repeat.frequency.unit);

  return (
    <View className="flex- gap-md bg-neutral-50">
      <Header>
        <TextButton onPress={router.back}>done</TextButton>
      </Header>
      <View className="gap-lg px-xl">
        <FormSection title="type">
          <ListSelect
            options={OPTIONS.type}
            selected={repeat ? repeat.type : null}
            onSelect={handlers.type}
            unique
          />
        </FormSection>
        {repeat && (
          <>
            <FormSection title="every">
              <TextInput
                value={String(repeat.frequency.multiple)}
                onChangeText={handlers.multiple}
                type="numeric"
              />
              <ListSelect
                options={OPTIONS.unit}
                selected={repeat.frequency.unit}
                onSelect={handlers.unit}
                unique
              />
            </FormSection>
            {showOnSelector && (
              <FormSection title="on">
                <ListSelect
                  options={OPTIONS[repeat.frequency.unit as "week" | "month"]}
                  selected={repeat.frequency.on ?? []}
                  onSelect={handlers.on}
                  unique={false}
                />
              </FormSection>
            )}
          </>
        )}
      </View>
    </View>
  );
}
