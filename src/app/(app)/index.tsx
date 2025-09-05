import Header from "@/components/Header";
import { View } from "react-native";
import Text from "@/components/Text";
import { useRouter } from "expo-router";
import { TextButton } from "@/components/Buttons";
import { Link } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-neutral-50">
      <Header>
        <TextButton onPress={() => router.navigate("/settings")}>settings</TextButton>
      </Header>
      <View className="flex-grow items-end justify-center gap-4xl px-xl">
        <Link href="/inbox">
          <Text font="roboto-mono" size="xl" weight="bd">
            inbox
          </Text>
        </Link>
        <Link href="/today">
          <Text font="roboto-mono" size="xl" weight="bd">
            today
          </Text>
        </Link>
        <Link href="/upcoming">
          <Text font="roboto-mono" size="xl" weight="bd">
            upcoming
          </Text>
        </Link>
      </View>
    </View>
  );
}
