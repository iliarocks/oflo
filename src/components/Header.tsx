import { View } from "react-native";
import Text from "@/components/Text";
import { SymbolView } from "expo-symbols";
import COLOR from "@/constants/color";
import { usePathname } from "expo-router";

export default function Header() {
	const pages = {
		"/inbox": {
			icon: "tray",
			title: "Inbox",
		},
		"/": {
			icon: "sun.max",
			title: "Today",
		},
		"/upcoming": {
			icon: "calendar",
			title: "Upcoming",
		},
	};

	const page = pages[usePathname()];

	return (
		<View className="pt-safe border-b-2 border-neutral-0 bg-neutral-100 p-lg flex-row gap-sm items-center">
			<SymbolView name={page.icon} size={20} tintColor={COLOR["text-50"]} />
			<Text size="sm" color="50">
				{page.title}
			</Text>
		</View>
	);
}
