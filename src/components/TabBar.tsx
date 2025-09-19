import { View } from "react-native";
import Button from "@/components/Button";
import { useRouter } from "expo-router";

export default function TabBar() {
	const router = useRouter();

	const openCreate = () => router.navigate("/create");

	const goToIndex = () => router.navigate("/");
	const goToInbox = () => router.navigate("/inbox");
	const goToUpcoming = () => router.navigate("/upcoming");

	return (
		<View className="flex-row justify-between">
			<View className="h-3xl flex-row rounded-full bg-neutral-50">
				<Button icon="tray" onPress={goToInbox} />
				<Button icon="sun.max" onPress={goToIndex} />
				<Button icon="calendar" onPress={goToUpcoming} />
				<Button icon="ellipsis" onPress={() => {}} />
			</View>
			<Button icon="plus" onPress={openCreate} />
		</View>
	);
}
