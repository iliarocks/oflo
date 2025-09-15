import { SafeAreaView } from "react-native-safe-area-context";
import TextInput from "@/components/TextInput";
import { View } from "react-native";
import IconButton from "@/components/IconButton";

export default function Create() {
	return (
		<SafeAreaView className="bg-neutral-0 grow">
			<View className="flex-row justify-between px-lg py-md">
				<IconButton name="xmark" onPress={() => {}} />
				<IconButton name="checkmark" onPress={() => {}} />
			</View>
			<View className="px-lg py-md">
				<TextInput placeholder="label" autoFocus />
			</View>
		</SafeAreaView>
	);
}
