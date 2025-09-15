import { View, StyleSheet } from "react-native";
import IconButton from "@/components/IconButton";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import SegmentedControl from "@/components/SegmentedControl";

export default function TabBar() {
	const router = useRouter();

	const openCreate = () => router.navigate("/create");

	return (
		<View className="flex-row justify-between">
			<SegmentedControl />
			<IconButton name="plus" onPress={openCreate} />
		</View>
	);
}
