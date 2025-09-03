import Header from "@/components/Header";
import View from "@/components/View";
import { TextButton } from "@/components/Buttons";
import { AuthContext } from "@/context/AuthContext";
import { useUser } from "@/hooks/useUser";
import { useContext } from "react";
import { useRouter } from "expo-router";
import Text from "@/components/Text";

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
    <View className="bg-neutral-0" grow safe>
      <Header justify="between">
        <Text>{user.email}</Text>
        <TextButton onPress={router.back}>close</TextButton>
      </Header>
      <View grow />
      <View className="px-xl">
        <TextButton onPress={context.signOut}>sign out</TextButton>
      </View>
    </View>
  );
}
