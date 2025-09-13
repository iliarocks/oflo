import { SafeAreaView } from "react-native-safe-area-context";
import TextInput from "@/components/TextInput";

export default function Create() {
	return (
		<SafeAreaView className="grow">
			<TextInput placeholder="label" />
		</SafeAreaView>
	);
}
