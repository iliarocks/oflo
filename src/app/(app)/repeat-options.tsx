import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { CreateContext } from "@/contexts/CreateContext";
import type { RepeatUnit } from "@/entities/Repeat";
import Repeat from "@/entities/Repeat";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RepeatOptions() {
  const { repeat, setRepeat } = useContext(CreateContext);
  const router = useRouter();

  useEffect(() => {
    if (!repeat) setRepeat(new Repeat());
  }, [repeat]);

  if (!repeat) return;

  const clear = () => {
    setRepeat(null);
    router.back();
  };

  const confirm = () => {
    router.dismiss();
  };

  const cycleRepeatType = () => {
    if (repeat!.type === "on-complete") setRepeat(repeat.withType("calendar"));
    if (repeat!.type === "calendar") setRepeat(repeat.withType("on-complete"));
  };
  const cycleUnit = () => {
    const units: RepeatUnit[] = ["day", "week", "month", "year"];
    const currentUnitIndex = units.indexOf(repeat.unit);
    setRepeat(
      repeat!.withUnit(
        units[currentUnitIndex === units.length - 1 ? 0 : currentUnitIndex + 1],
      ),
    );
  };
  const setInterval = (interval: string) =>
    setRepeat(repeat!.withInterval(Number(interval)));

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
          onChangeText={setInterval}
        />
      </View>
    </SafeAreaView>
  );
}
