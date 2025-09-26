import { ReactNode } from "react";
import { Text as _Text } from "react-native";

export type TextSize = "sm" | "md" | "lg";

export type TextColor = "0" | "50" | "100";

export type TextWeight = "nm" | "md";

type Properties = {
	size?: TextSize;
	color?: TextColor;
	weight?: TextWeight;
	children?: ReactNode;
};

export default function Text({
	size = "sm",
	color = "0",
	weight = "nm",
	children,
}: Properties) {
	const colors = {
		"0": "text-text-0",
		"50": "text-text-50",
		"100": "text-text-100",
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

	const weights = {
		nm: "font-normal",
		md: "font-medium",
	};

	return (
		<_Text
			className={`${colors[color]} ${sizes[size]} ${lineHeights[size]} ${weights[weight]}`}
		>
			{children}
		</_Text>
	);
}
