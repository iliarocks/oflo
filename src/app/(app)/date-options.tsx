import Button from "@/components/Button";
import Calendar from "@/components/Calendar";
import { CreateContext } from "@/contexts/CreateContext";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { View } from "react-native";

export default function DateOptions() {
	const { date, setDate, resetDate } = useContext(CreateContext);
	const router = useRouter();

	if (!date) return;

	const clear = () => {
		resetDate();
		router.back();
	};

	const confirm = () => {
		router.dismiss();
	};

	return (
		<View className="bg-neutral-100 py-safe px-lg gap-lg grow">
			<View className="flex-row justify-between pt-lg">
				<Button
					icon="arrow.trianglehead.counterclockwise"
					onPress={clear}
					variant="tertiary"
				/>
				<Button icon="checkmark" onPress={confirm} variant="tertiary" />
			</View>
			<Calendar selectedDate={date!} onDateSelect={setDate} />
		</View>
	);
}
