import {
	TextInput as _TextInput,
	KeyboardTypeOptions,
	ReturnKeyTypeOptions,
} from "react-native";
import COLOR from "@/constants/color";

type Properties = {
	variant?: "primary" | "secondary";
	placeholder: string;
	value: string;
	onChangeText: (value: string) => void;
	onSubmitEditing?: () => void;
	returnKeyType?: ReturnKeyTypeOptions;
	keyboardType?: KeyboardTypeOptions;
	multiline?: boolean;
	autoFocus?: boolean;
};

export default function TextInput({
	variant = "primary",
	placeholder,
	value,
	onChangeText,
	onSubmitEditing = () => {},
	returnKeyType = "default",
	keyboardType = "default",
	multiline = false,
	autoFocus = false,
}: Properties) {
	const styles = {
		primary: "bg-neutral-50 text-text-0 px-md py-xs rounded-md text-md",
		secondary: "text-text-0 p-xs rounded-md text-md",
	};

	return (
		<_TextInput
			placeholder={placeholder}
			value={value}
			onChangeText={onChangeText}
			onSubmitEditing={onSubmitEditing}
			returnKeyType={returnKeyType}
			keyboardType={keyboardType}
			multiline={multiline}
			autoFocus={autoFocus}
			autoCorrect={false}
			autoCapitalize="none"
			placeholderTextColor={COLOR["text-50"]}
			className={styles[variant]}
		/>
	);
}
