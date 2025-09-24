import { ReactNode } from "react";
import { Text as _Text } from "react-native";

export type Size = "sm" | "md" | "lg";

export type Color = "0" | "50" | "100" | "red";

type Properties = {
	size?: Size;
	color?: Color;
	children?: ReactNode;
};

export default function Text({
	size = "sm",
	color = "0",
	children,
}: Properties) {
	const colors = {
		"0": "text-text-0",
		"50": "text-text-50",
		"100": "text-text-100",
		red: "text-red",
	};

	const sizes = {
		sm: "text-sm",
		md: "text-md",
		lg: "text-lg",
	};

	const lineHeights = {
		sm: "leading-sm",
		md: "leading-md",
		lg: "leading-lg",
	};

	return (
		<_Text
			className={`${colors[color]} ${sizes[size]} ${lineHeights[size]} font-medium`}
		>
			{children}
		</_Text>
	);
}
