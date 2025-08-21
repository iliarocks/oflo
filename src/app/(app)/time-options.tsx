import View from "@/components/View";
import Header from "@/components/Header";
import { TextButton } from "@/components/Buttons";
import { useRouter } from "expo-router";

export default function TimeOptions() {
  const router = useRouter();

  return (
    <View className="bg-neutral-0" grow safe>
      <Header>
        <TextButton onPress={router.back}>done</TextButton>
      </Header>
    </View>
  );
}
