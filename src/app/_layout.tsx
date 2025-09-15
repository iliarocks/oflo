import "./global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/contexts/AuthContext";

export default function Layout() {
	return (
		<SafeAreaProvider>
			<AuthProvider>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="(auth)" />
					<Stack.Screen name="(app)" />
				</Stack>
			</AuthProvider>
		</SafeAreaProvider>
	);
}
