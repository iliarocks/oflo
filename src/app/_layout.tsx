import "./global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/contexts/AuthContext";
import { CreateProvider } from "@/contexts/CreateContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
	return (
		<SafeAreaProvider>
			<GestureHandlerRootView>
				<AuthProvider>
					<CreateProvider>
						<Stack screenOptions={{ headerShown: false }}>
							<Stack.Screen name="(auth)" />
							<Stack.Screen name="(app)" />
						</Stack>
					</CreateProvider>
				</AuthProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
}
