import { TextInput as _TextInput, KeyboardTypeOptions, ReturnKeyTypeOptions } from "react-native";
import COLOR from "@/constants/color";

type Properties = {
	placeholder: string;
	value: string;
	onChangeText: (value: string) => void;
	onSubmitEditing?: () => void;
	returnKeyType?: ReturnKeyTypeOptions;
	keyboardType?: KeyboardTypeOptions;
	autoFocus?: boolean;
};

export default function TextInput({
	placeholder,
	value,
	onChangeText,
	onSubmitEditing = () => {},
	returnKeyType = "done",
	keyboardType = "default",
	autoFocus = false,
}: Properties) {
	return (
		<_TextInput
			placeholder={placeholder}
			value={value}
			onChangeText={onChangeText}
			onSubmitEditing={onSubmitEditing}
			returnKeyType={returnKeyType}
			keyboardType={keyboardType}
			autoFocus={autoFocus}
			autoCorrect={false}
			autoCapitalize="none"
			placeholderTextColor={COLOR["text-50"]}
			className="bg-neutral-50 text-text-100 px-md justify-center rounded-xl text-sm h-3xl"
		/>
	);
}
