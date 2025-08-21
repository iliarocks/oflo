import Header from "@/components/Header";
import View from "@/components/View";
import Text from "@/components/Text";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  const headerItems = [
    {
      type: "button",
      text: "settings",
      onPress: () => router.navigate("/settings"),
    },
  ];

  return (
    <View className="bg-neutral-0" grow>
      <Header items={headerItems} />
      <View className="flex-grow items-end justify-center gap-4xl px-xl">
        <Text type="title" size="xl">
          inbox
        </Text>
        <Text type="title" size="xl">
          today
        </Text>
        <Text type="title" size="xl">
          upcoming
        </Text>
      </View>
    </View>
  );
}
