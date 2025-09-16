import { ReactNode } from "react";
import { View, Pressable } from "react-native";
import Text from "@/components/Text";

type Properties = {
	onPress: () => void;
	children?: ReactNode;
};

export default function TextButton({ onPress, children }: Properties) {
	return (
		<View className="h-3xl self-start rounded-full bg-neutral-50 p-2xs">
			<Pressable
				className="items-center justify-center h-2xl flex rounded-full px-md active:bg-neutral-100"
				onPress={onPress}
			>
				<Text>{children}</Text>
			</Pressable>
		</View>
	);
}
