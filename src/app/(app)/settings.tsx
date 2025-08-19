import Header from "@/components/Header";
import View from "@/components/View";
import { TextButton } from "@/components/Buttons";
import { AuthContext } from "@/context/AuthContext";
import { useUser } from "@/hooks/useUser";
import { useContext } from "react";
import { useRouter } from "expo-router";

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
      <Header items={headerItems} />
      <View grow />
      <View className="px-xl">
        <TextButton onPress={context.signOut}>sign out</TextButton>
      </View>
    </View>
  );
}
