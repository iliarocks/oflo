import { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Properties = {
	children?: ReactNode;
};

export default function Footer({ children }: Properties) {
	return (
		<View className="absolute bottom-0 p-xl w-full">
			<LinearGradient
				style={StyleSheet.absoluteFill}
				colors={[
					"rgba(255,255,255,1.0)",
					"rgba(255,255,255,0.1)",
					"rgba(255,255,255,0.0)",
				]}
				locations={[0, 0.9, 1]}
				start={{ x: 0.5, y: 1 }}
				end={{ x: 0.5, y: 0 }}
			/>
			{children}
		</View>
	);
}
