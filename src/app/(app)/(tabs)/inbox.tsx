import Header from "@/components/Header";
import { View } from "react-native";

export default function Inbox() {
	return (
		<>
			<Header page="inbox" />
			<View className="bg-neutral-100 grow"></View>
		</>
	);
}
