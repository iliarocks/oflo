import Text, { Color } from "@/components/Text";
import { ReactNode } from "react";
import { Pressable } from "react-native";

type Properties = {
	color?: Color;
	onPress: () => void;
	children?: ReactNode;
};

export default function Button({
	color = "100",
	onPress,
	children,
}: Properties) {
	return (
		<Pressable
			onPress={onPress}
			className="bg-neutral-50 px-md py-xs rounded-md self-start"
		>
			<Text color={color}>{children}</Text>
		</Pressable>
	);
}
