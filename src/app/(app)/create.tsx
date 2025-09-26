import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { CreateContext } from "@/contexts/CreateContext";
import { constructInitialRepeat, repeatToString } from "@/utilities/repeat";
import { format, startOfToday } from "date-fns";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { ScrollView, View } from "react-native";

export default function Create() {
	const {
		variant,
		label,
		notes,
		date,
		repeat,
		setLabel,
		setNotes,
		setDate,
		reset,
		push,
		toggleVariant,
		initializeRepeat,
	} = useContext(CreateContext);
	const router = useRouter();

	const clear = () => {
		router.dismiss();
		reset();
	};

	const confirm = () => {
		router.dismiss();
		push();
	};

	const openDate = () => {
		if (!date) setDate(startOfToday());
		router.navigate("/date-options");
	};

	const openRepeat = () => {
		if (!repeat) initializeRepeat();
		router.navigate("/repeat-options");
	};

	return (
		<View className="bg-neutral-100 py-safe gap-lg grow">
			<View className="flex-row justify-between pt-lg items-center px-lg">
				<Button onPress={clear} icon="xmark" variant="tertiary" />
				<Button onPress={confirm} variant="primary">
					save
				</Button>
			</View>
			<ScrollView
				showsHorizontalScrollIndicator={false}
				horizontal
				className="grow-0 px-lg"
			>
				<View className="flex-row gap-md">
					<Button icon="square.stack.3d.up" onPress={toggleVariant}>
						{variant}
					</Button>
					<Button icon={date ? "calendar" : "tray"} onPress={openDate}>
						{date ? format(date, "MMMM d").toLowerCase() : "inbox"}
					</Button>
					<Button
						icon="arrow.trianglehead.2.clockwise.rotate.90"
						onPress={openRepeat}
					>
						{repeat ? repeatToString(repeat) : "no repeat"}
					</Button>
				</View>
			</ScrollView>
			<View className="mx-lg">
				<TextInput
					placeholder="label"
					value={label}
					onChangeText={setLabel}
					variant="secondary"
					autoFocus
				/>
			</View>
			<View className="h-[2px] bg-neutral-0 w-full rounded-full" />
			<View className="mx-lg">
				<TextInput
					placeholder="notes"
					value={notes}
					onChangeText={setNotes}
					variant="secondary"
					multiline
					autoFocus
				/>
			</View>
		</View>
	);
}
