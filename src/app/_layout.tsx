import Button from "@/components/Button";
import "./global.css";
import { Stack, useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
	const router = useRouter();

	const openCreate = () => {
		router.navigate("/create");
	};

	return (
		<SafeAreaProvider>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: "#FFFFFF" },
				}}
			>
				<Stack.Screen name="index" />
				<Stack.Screen name="create" options={{ presentation: "modal" }} />
			</Stack>
			<View className="absolute my-safe mx-xl bottom-0">
				<Button onPress={openCreate}>create</Button>
			</View>
		</SafeAreaProvider>
	);
}
