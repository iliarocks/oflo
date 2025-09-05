import Header from "@/components/Header";
import { View } from "react-native";
import { TextButton } from "@/components/Buttons";
import { AuthContext } from "@/context/AuthContext";
import { useUser } from "@/hooks/useUser";
import { useContext } from "react";
import { useRouter } from "expo-router";
import Text from "@/components/Text";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const context = useContext(AuthContext);
  const user = useUser();
  const router = useRouter();

  const headerItems = [
    {
      type: "label",
      text: user.email,
    },
    {
      type: "button",
      text: "close",
      onPress: () => router.back(),
    },
  ];

  return (
    <SafeAreaView className="flex-1 justify-between bg-neutral-50">
      <Header justify="between">
        <Text>{user.email}</Text>
        <TextButton onPress={router.back}>close</TextButton>
      </Header>
      <View className="px-xl">
        <TextButton onPress={context.signOut}>sign out</TextButton>
      </View>
    </SafeAreaView>
  );
}
