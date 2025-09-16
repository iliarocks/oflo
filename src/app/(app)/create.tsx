import { SafeAreaView } from "react-native-safe-area-context";
import TextInput from "@/components/TextInput";
import { View } from "react-native";
import IconButton from "@/components/IconButton";
import TextButton from "@/components/TextButton";
import { useContext } from "react";
import { CreateContext } from "@/contexts/CreateContext";
import { useRouter } from "expo-router";
import { format, startOfToday } from "date-fns";

export default function Create() {
	const { label, date, repeat, setLabel, setDate, reset, push } =
		useContext(CreateContext);
	const router = useRouter();

	const cancel = () => {
		router.dismiss();
		reset();
	};

	const confirm = () => {
		router.dismiss();
		push();
	};

	const openDate = () => {
		if (!date) setDate(startOfToday());
		console.log(startOfToday());
		router.navigate("/date");
	};

	return (
		<SafeAreaView className="bg-neutral-0 grow px-lg">
			<View className="flex-row justify-between pb-md pt-lg">
				<IconButton name="xmark" onPress={cancel} small />
				<IconButton name="arrow.up" onPress={confirm} small />
			</View>
			<View className="py-md gap-md">
				<TextInput
					placeholder="label"
					value={label}
					onChangeText={setLabel}
					autoFocus
				/>
				<View className="flex-row gap-md">
					<TextButton onPress={openDate}>
						{date ? format(date, "d MMM yyyy").toLowerCase() : "inbox"}
					</TextButton>
					<TextButton onPress={openDate}>no repeat</TextButton>
				</View>
			</View>
		</SafeAreaView>
	);
}
