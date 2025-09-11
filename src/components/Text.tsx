import { ReactNode } from "react";
import { _Text } from "react-native";

type Size = "sm" | "md" | "lg";

type Color = "0" | "50" | "100";

type Properties = {
	size?: Size;
	color?: Color;
	children?: ReactNode;
};

export default function Text({
	size = "sm",
	color = "50",
	children,
}: Properties) {
	return <_Text>{children}</_Text>;
}
