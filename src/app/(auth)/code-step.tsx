import { View } from "react-native";
import { TextButton } from "@/components/Buttons";
import { TextInput } from "@/components/Inputs";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useContext } from "react";

export default function CodeStep() {
  const context = useContext(AuthContext);
  const router = useRouter();

  return (
    <View className="flex-1 bg-neutral-50 px-xl">
      <View className="flex-1 justify-center gap-sm">
        <TextInput
          value={context.code}
          label="copy the code sent to your email"
          onChangeText={context.setCode}
        />
      </View>
      <View className="flex-row items-center justify-between py-lg">
        <TextButton onPress={() => router.back()}>back</TextButton>
        <TextButton onPress={context.signIn}>begin</TextButton>
      </View>
    </View>
  );
}
