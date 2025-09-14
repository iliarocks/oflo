import COLOR from "@/constants/color";
import { SFSymbol, SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

type Properties = {
	name: SFSymbol;
	active?: boolean;
	onPress: () => void;
};

export default function IconButton({ name, active, onPress }: Properties) {
	const pressableStyles = `size-3xl flex items-center justify-center rounded-full active:bg-neutral-100 ${active ? "bg-neutral-100" : ""}`;

	return (
		<View className="p-2xs rounded-full size-4xl self-start bg-neutral-50 active:bg-neutral-100">
			<Pressable onPress={onPress} className={pressableStyles}>
				<SymbolView name={name} tintColor={COLOR["text-50"]} size={20} />
			</Pressable>
		</View>
	);
}
