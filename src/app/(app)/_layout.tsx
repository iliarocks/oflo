import { AuthContext } from "@/contexts/AuthContext";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";

export default function Layout() {
	const { user } = useContext(AuthContext);

	if (!user) return <Redirect href="/email-step" />;

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="(tabs)" />
			<Stack.Screen
				name="create"
				options={{ presentation: "fullScreenModal" }}
			/>
			<Stack.Screen
				name="date-options"
				options={{ presentation: "containedModal" }}
			/>
			<Stack.Screen
				name="repeat-options"
				options={{ presentation: "containedModal" }}
			/>
		</Stack>
	);
}
