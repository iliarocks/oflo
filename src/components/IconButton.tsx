import COLOR from "@/constants/color";
import { SFSymbol, SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

type Properties = {
	name: SFSymbol;
	small?: boolean;
	active?: boolean;
	onPress: () => void;
};

export default function IconButton({
	name,
	small,
	active,
	onPress,
}: Properties) {
	const containerStyles = `p-2xs rounded-full self-start bg-neutral-50 ${small ? "size-3xl" : "size-4xl"}`;
	const pressableStyles = `rounded-full items-center justify-center ${small ? "size-2xl" : "size-3xl"} ${active ? "bg-neutral-100" : "active:bg-neutral-100"}`;

	return (
		<View className={containerStyles}>
			<Pressable onPress={onPress} className={pressableStyles}>
				<SymbolView
					name={name}
					tintColor={COLOR["text-50"]}
					size={small ? 16 : 20}
				/>
			</Pressable>
		</View>
	);
}
