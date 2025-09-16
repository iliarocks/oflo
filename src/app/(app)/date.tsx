import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import IconButton from "@/components/IconButton";
import Calendar from "@/components/Calendar";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { CreateContext } from "@/contexts/CreateContext";

export default function Date() {
	const { date, setDate } = useContext(CreateContext);
	const router = useRouter();

	const clear = () => {
		setDate(null);
		router.back();
	};

	const confirm = () => {
		router.dismiss();
	};

	return (
		<SafeAreaView className="bg-neutral-0 grow px-lg">
			<View className="flex-row justify-between pb-md pt-lg">
				<IconButton name="trash" onPress={clear} small />
				<IconButton name="checkmark" onPress={confirm} small />
			</View>
			<View className="py-md gap-md">
				<Calendar selectedDate={date!} onDateSelect={setDate} />
			</View>
		</SafeAreaView>
	);
}
