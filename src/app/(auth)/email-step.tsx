import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TextInput from "@/components/TextInput";
import IconButton from "@/components/IconButton";
import Footer from "@/components/Footer";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";

export default function EmailStep() {
	const { email, setEmail, sendCode } = useContext(AuthContext);
	const router = useRouter();

	const handleSubmit = () => {
		sendCode();
		router.push("/code-step");
	};

	return (
		<SafeAreaView className="bg-neutral-0 grow">
			<View className="justify-center px-lg py-md grow">
				<TextInput
					placeholder="email"
					value={email}
					onChangeText={setEmail}
					onSubmitEditing={handleSubmit}
					returnKeyType="next"
					keyboardType="email-address"
					autoFocus
				/>
			</View>
			<Footer>
				<View className="flex-row justify-end">
					<IconButton name="arrow.right" onPress={handleSubmit} />
				</View>
			</Footer>
		</SafeAreaView>
	);
}
