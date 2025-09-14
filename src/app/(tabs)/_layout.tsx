import TabBar from "@/components/TabBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
	return (
		<>
			<Tabs
				screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
			>
				<Tabs.Screen name="index" />
				<Tabs.Screen name="inbox" />
				<Tabs.Screen name="upcoming" />
			</Tabs>
			<TabBar />
		</>
	);
}
