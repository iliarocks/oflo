import Header from "@/components/Header";
import Link from "@/components/Link";
import View from "@/components/View";
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
        <Link href="/inbox" size="xl">
          inbox
        </Link>
        <Link href="/today" size="xl">
          today
        </Link>
        <Link href="/upcoming" size="xl">
          upcoming
        </Link>
      </View>
    </View>
  );
}
