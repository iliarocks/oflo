import Text from "@/components/Text";
import { View } from "react-native";
import { TextButton } from "@/components/Buttons";
import { TextInput } from "@/components/Inputs";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useContext } from "react";

export default function EmailStep() {
  const context = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = () => {
    context.sendCode();
    router.push("/code-step");
  };

  return (
    <View className="flex-1 bg-neutral-50 px-xl">
      <View className="flex-1 justify-center gap-sm">
        <TextInput
          value={context.email}
          label="enter your email to begin"
          onChangeText={context.setEmail}
          type="email-address"
        />
      </View>
      <View className="flex-row items-center justify-end py-lg">
        <TextButton onPress={handleSubmit}>next</TextButton>
      </View>
    </View>
  );
}
