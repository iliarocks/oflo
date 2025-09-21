import Button from "@/components/Button";
import Calendar from "@/components/Calendar";
import { CreateContext } from "@/contexts/CreateContext";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DateOptions() {
  const { date, setDate } = useContext(CreateContext);
  const router = useRouter();

  if (!date) return;

  const clear = () => {
    setDate(null);
    router.back();
  };

  const confirm = () => {
    router.dismiss();
  };

  return (
    <SafeAreaView className="bg-neutral-0 grow px-lg">
      <View className="flex-row justify-between pb-md pt-lg">
        <Button icon="arrow.trianglehead.counterclockwise" onPress={clear} />
        <Button icon="checkmark" onPress={confirm} />
      </View>
      <View className="py-md">
        <Calendar selectedDate={date!} onDateSelect={setDate} />
      </View>
    </SafeAreaView>
  );
}
