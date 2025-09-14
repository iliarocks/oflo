import { View, StyleSheet } from "react-native";
import IconButton from "@/components/IconButton";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import SegmentedControl from "@/components/SegmentedControl";

export default function TabBar() {
	const router = useRouter();

	const openCreate = () => router.navigate("/create");

	return (
		<View className="absolute bottom-0 p-xl w-full flex-row justify-between">
			<LinearGradient
				style={StyleSheet.absoluteFill}
				colors={[
					"rgba(255,255,255,1.0)",
					"rgba(255,255,255,0.1)",
					"rgba(255,255,255,0.0)",
				]}
				locations={[0, 0.9, 1]}
				start={{ x: 0.5, y: 1 }}
				end={{ x: 0.5, y: 0 }}
			/>
			<SegmentedControl />
			<IconButton name="plus" onPress={openCreate} />
		</View>
	);
}
