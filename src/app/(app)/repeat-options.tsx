import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { CreateContext } from "@/contexts/CreateContext";
import { repeatWithInterval, WeekDayIndex } from "@/utilities/repeat";
import { MenuAction, MenuView } from "@react-native-menu/menu";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { ScrollView, View } from "react-native";

const onItems = [
	{ id: "0", title: "sunday" },
	{ id: "1", title: "monday" },
	{ id: "2", title: "tuesday" },
	{ id: "3", title: "wednesday" },
	{ id: "4", title: "thursday" },
	{ id: "5", title: "friday" },
	{ id: "6", title: "saturday" },
] as MenuAction[];

export default function RepeatOptions() {
	const {
		repeat,
		setRepeat,
		resetRepeat,
		toggleRepeatVariant,
		cycleRepeatUnit,
	} = useContext(CreateContext);
	const router = useRouter();

	if (!repeat) return;

	const clear = () => {
		resetRepeat();
		router.back();
	};

	const confirm = () => {
		if (!repeat.interval) return;
		router.dismiss();
	};

	const isOn = (index: WeekDayIndex) => {
		if (!repeat) return;

		return repeat.on.includes(index);
	};

	return (
		<View className="bg-neutral-100 py-safe gap-lg grow">
			<View className="flex-row justify-between pt-lg items-center px-lg">
				<Button
					icon="arrow.trianglehead.counterclockwise"
					onPress={clear}
					variant="tertiary"
				/>
				<Button icon="checkmark" onPress={confirm} variant="tertiary" />
			</View>
			<ScrollView
				showsHorizontalScrollIndicator={false}
				horizontal
				className="grow-0 px-lg"
			>
				<View className="flex-row gap-md">
					<Button icon="square.stack.3d.up" onPress={toggleRepeatVariant}>
						{repeat.variant}
					</Button>
					<Button icon="square.grid.3x3.square" onPress={cycleRepeatUnit}>
						{repeat.unit}
					</Button>
					{repeat.variant === "calendar" && repeat.unit === "week" && (
						<MenuView onPressAction={() => {}} actions={onItems}>
							<Button icon="mappin" onPress={() => {}}>
								on
							</Button>
						</MenuView>
					)}
				</View>
			</ScrollView>
			<View className="mx-lg">
				<TextInput
					placeholder="label"
					value={repeat.interval ? repeat.interval.toString() : ""}
					onChangeText={(value) =>
						setRepeat(repeatWithInterval(repeat, Number(value)))
					}
				/>
			</View>
		</View>
	);
}
