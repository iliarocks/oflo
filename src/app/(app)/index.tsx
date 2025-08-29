import Header from "@/components/Header";
import View from "@/components/View";
import Text from "@/components/Text";
import { useRouter } from "expo-router";
import { TextButton } from "@/components/Buttons";
import { Link } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View className="bg-neutral-0" grow>
      <Header>
        <TextButton onPress={() => router.navigate("/settings")}>settings</TextButton>
      </Header>
      <View className="flex-grow items-end justify-center gap-4xl px-xl">
        <Link href="/inbox">
          <Text type="title" size="xl">
            inbox
          </Text>
        </Link>
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
