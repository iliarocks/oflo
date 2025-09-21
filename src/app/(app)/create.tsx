import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { CreateContext } from "@/contexts/CreateContext";
import { DEFAULT_REPEAT, repeatToString } from "@/utilities/repeat";
import { format, startOfToday } from "date-fns";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Create() {
  const { label, date, repeat, setLabel, setDate, setRepeat, reset, push } =
    useContext(CreateContext);
  const router = useRouter();

  const cancel = () => {
    router.dismiss();
    reset();
  };

  const confirm = () => {
    router.dismiss();
    push();
  };

  const openDate = () => {
    if (!date) setDate(startOfToday());
    router.navigate("/date-options");
  };
  const openRepeat = () => {
    if (!repeat) setRepeat(DEFAULT_REPEAT);
    router.navigate("/repeat-options");
  };

  return (
    <SafeAreaView className="bg-neutral-0 grow px-lg">
      <View className="flex-row justify-between pb-md pt-lg">
        <Button icon="xmark" onPress={cancel} />
        <Button icon="checkmark" onPress={confirm} />
      </View>
      <View className="py-md gap-md">
        <TextInput
          placeholder="label"
          value={label}
          onChangeText={setLabel}
          autoFocus
        />
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          <View className="flex-row gap-md">
            <Button icon={date ? "calendar" : "tray"} onPress={openDate}>
              {date ? format(date, "MMMM d").toLowerCase() : "inbox"}
            </Button>
            <Button
              icon="arrow.trianglehead.2.clockwise.rotate.90"
              onPress={openRepeat}
            >
              {repeat ? repeatToString(repeat) : "no repeat"}
            </Button>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
