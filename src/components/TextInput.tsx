import { TextInput as _TextInput } from "react-native";
import COLOR from "@/constants/color";

type Properties = {
	placeholder: string;
};

export default function TextInput({ placeholder }: Properties) {
	return (
		<_TextInput
			placeholder={placeholder}
			placeholderTextColor={COLOR["text-50"]}
			autoCapitalize="none"
			autoCorrect={false}
			className="bg-neutral-50 px-md py-xs rounded-md text-sm"
		/>
	);
}
