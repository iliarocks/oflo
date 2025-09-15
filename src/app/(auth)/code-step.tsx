import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TextInput from "@/components/TextInput";
import IconButton from "@/components/IconButton";
import Footer from "@/components/Footer";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";

export default function CodeStep() {
	const { code, setCode, signIn } = useContext(AuthContext);
	const router = useRouter();

	return (
		<SafeAreaView className="bg-neutral-0 grow">
			<View className="justify-center px-lg py-md grow">
				<TextInput
					placeholder="code"
					value={code}
					onChangeText={setCode}
					onSubmitEditing={signIn}
					returnKeyType="done"
					keyboardType="number-pad"
					autoFocus
				/>
			</View>
			<Footer>
				<View className="flex-row justify-end">
					<IconButton
						name="rectangle.portrait.and.arrow.right"
						onPress={signIn}
					/>
				</View>
			</Footer>
		</SafeAreaView>
	);
}
