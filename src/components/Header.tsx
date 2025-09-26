import { View } from "react-native";
import Text from "@/components/Text";
import { SymbolView } from "expo-symbols";
import COLOR from "@/constants/color";

export default function Header({
	page,
}: {
	page: "inbox" | "today" | "upcoming";
}) {
	const pages = {
		inbox: {
			icon: "tray",
			title: "Inbox",
		},
		today: {
			icon: "sun.max",
			title: "Today",
		},
		upcoming: {
			icon: "calendar",
			title: "Upcoming",
		},
	};

	const pageData = pages[page];

	return (
		<View className="pt-safe border-b-2 border-neutral-0 bg-neutral-100 p-lg flex-row gap-sm items-center">
			<SymbolView name={pageData.icon} size={20} tintColor={COLOR["text-50"]} />
			<Text size="sm" color="50">
				{pageData.title}
			</Text>
		</View>
	);
}
