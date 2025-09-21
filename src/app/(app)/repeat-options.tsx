import Button from "@/components/Button";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { CreateContext } from "@/contexts/CreateContext";
import type { Repeat, WeekDayIndex } from "@/utilities/repeat";
import {
  getNextType,
  setType,
  getNextUnit,
  setUnit,
  setInterval,
  setOn,
  getNextOn,
  DEFAULT_ON,
  WEEKDAYS,
} from "@/utilities/repeat";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RepeatOptions() {
  const { repeat, setRepeat } = useContext(CreateContext);
  const router = useRouter();

  if (!repeat) return;

  const clear = () => {
    setRepeat(null);
    router.back();
  };

  const confirm = () => {
    router.dismiss();
  };

  const cycleRepeatType = () => setRepeat(setType(repeat, getNextType(repeat)));
  const cycleUnit = () => setRepeat(setUnit(repeat, getNextUnit(repeat)));
  const _setInterval = (interval: string) =>
    setRepeat(setInterval(repeat, Number(interval)));

  return (
    <SafeAreaView className="bg-neutral-0 grow px-lg">
      <View className="flex-row justify-between pb-md pt-lg">
        <Button icon="arrow.trianglehead.counterclockwise" onPress={clear} />
        <Button icon="checkmark" onPress={confirm} />
      </View>
      <View className="py-md gap-md">
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          <View className="flex-row gap-md">
            <Button icon="line.3.horizontal.decrease" onPress={cycleRepeatType}>
              {repeat!.type}
            </Button>
            <Button icon="square.grid.3x3" onPress={cycleUnit}>
              {repeat!.unit}
            </Button>
          </View>
        </ScrollView>
        <TextInput
          placeholder="interval"
          value={repeat.interval ? String(repeat.interval) : ""}
          onChangeText={_setInterval}
        />
        {repeat.type === "calendar" && repeat.unit === "week" && (
          <DaysOfTheWeek repeat={repeat} setRepeat={setRepeat} />
        )}
      </View>
    </SafeAreaView>
  );
}

function DaysOfTheWeek({
  repeat,
  setRepeat,
}: {
  repeat: Repeat;
  setRepeat: (r: Repeat) => void;
}) {
  if (repeat.type !== "calendar" || repeat.unit !== "week") {
    return;
  }

  if (!repeat.on) return;

  const pushOn = () => {
    if (repeat.on.length === 7) return;
    const last = repeat.on[repeat.on.length - 1];
    const next = getNextOn(repeat, last);
    setRepeat(setOn(repeat, [...repeat.on, next]));
  };
  const popOn = () => {
    const trimmed = repeat.on.slice(0, -1);

    setRepeat(setOn(repeat, trimmed.length ? trimmed : DEFAULT_ON));
  };

  const cycleOn = (index: WeekDayIndex) => {
    if (repeat.on.length === 7) return; // nowhere to cycle
    const idx = repeat.on.indexOf(index);
    if (idx < 0) return;
    const next = getNextOn(repeat, index);
    if (next === undefined) return;
    const nextOn = repeat.on.slice();
    nextOn[idx] = next;
    setRepeat(setOn(repeat, nextOn));
  };

  return (
    <ScrollView showsHorizontalScrollIndicator={false} horizontal>
      <View className="flex-row gap-md">
        {repeat.on.map((d) => (
          <Button key={d} onPress={() => cycleOn(d)}>
            <Text>{WEEKDAYS[d]}</Text>
          </Button>
        ))}
        <Button icon="plus" onPress={pushOn} />
        <Button icon="minus" onPress={popOn} />
      </View>
    </ScrollView>
  );
}
