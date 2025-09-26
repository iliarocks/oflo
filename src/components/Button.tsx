import COLOR from "@/constants/color";
import Text from "@/components/Text";
import { SFSymbol, SymbolView } from "expo-symbols";
import { ReactNode } from "react";
import { Pressable } from "react-native";

export type ButtonVariant = "primary" | "secondary" | "tertiary";

type Properties = {
	variant?: ButtonVariant;
	icon?: SFSymbol;
	children?: ReactNode;
	onPress?: () => void;
};

export default function Button({
	variant = "secondary",
	icon,
	children,
	onPress = () => {},
}: Properties) {
	const commonContainerStyles =
		"py-xs flex-row gap-sm justify-center items-center active:opacity-70";

	const styles = {
		primary: {
			container: "bg-blue-50 px-md rounded-full",
			text: { color: "0" },
			icon: { tintColor: COLOR["text-0"] },
		},
		secondary: {
			container: "bg-neutral-50 px-md rounded-md",
			text: { color: "0" },
			icon: { tintColor: COLOR["text-0"] },
		},
		tertiary: {
			container: "px-xs",
			text: { color: "50" },
			icon: { tintColor: COLOR["text-50"] },
		},
	};

	return (
		<Pressable
			onPress={onPress}
			className={`${commonContainerStyles} ${styles[variant].container}`}
		>
			{icon && (
				<SymbolView
					name={icon}
					tintColor={styles[variant].icon.tintColor}
					size={children ? 14 : 20}
				/>
			)}
			{children && (
				<Text size="md" color={styles[variant].text.color}>
					{children}
				</Text>
			)}
		</Pressable>
	);
}
