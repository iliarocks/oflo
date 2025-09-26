import Header from "@/components/Header";
import { View } from "react-native";

export default function Index() {
	return (
		<>
			<Header page="today" />
			<View className="bg-neutral-100 grow"></View>
		</>
	);
}
