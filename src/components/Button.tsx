import COLOR from "@/constants/color";
import Text from "@/components/Text";
import { SFSymbol, SymbolView } from "expo-symbols";
import { ReactNode } from "react";
import { View, Pressable } from "react-native";

type Properties = {
	icon?: SFSymbol;
	children?: ReactNode;
	active?: boolean;
	onPress: () => void;
};

export default function Button({ icon, children, active, onPress }: Properties) {
	const pressableStyles = [
		"h-2xl flex-row gap-xs items-center justify-center rounded-full",
		active ? "bg-neutral-100" : "active:bg-neutral-100",
		children ? "px-md" : "w-2xl",
	].join(" ");

	return (
		<View className="h-3xl p-2xs bg-neutral-50 rounded-full">
			<Pressable onPress={onPress} className={pressableStyles}>
				{icon && <SymbolView name={icon} tintColor={COLOR["text-50"]} size={17} />}
				{children && <Text>{children}</Text>}
			</Pressable>
		</View>
	);
}
