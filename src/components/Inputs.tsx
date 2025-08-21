import Text from "@/components/Text";
import View from "@/components/View";
import { Option } from "@/utilities/types";
import _ from "lodash";
import { TextInput as DefaultTextInput, Pressable } from "react-native";

// --- List Select ---

type ListSelectProps<T = any> =
  | {
      options: Option[];
      selected: T[];
      onSelect: (selected: T[]) => void;
      unique: false;
    }
  | {
      options: Option[];
      selected: T;
      onSelect: (selected: T) => void;
      unique: true;
    };

export function ListSelect<T = any>(props: ListSelectProps) {
  const { options, selected, onSelect, unique } = props;

  const handlePress = (value: T) => {
    if (unique) onSelect(value);
    if (!unique) {
      const newSelected = _.xor(selected, [value]);
      if (newSelected.length > 0) onSelect(_.xor(selected, [value]));
    }
  };

  const isSelected = (value: T) => {
    if (unique) return selected === value;
    return selected.includes(value);
  };

  return (
    <View className="flex-auto flex-row flex-wrap">
      {options.map(({ key, value }, i) => {
        const background = isSelected(value) ? "bg-primary-0" : "bg-neutral-5";
        return (
          <Pressable
            className={`grow items-center p-md ${background}`}
            onPress={() => handlePress(value)}
            key={i}
          >
            <Text>{key}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// --- Text Input ---

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function TextInput({ onChangeText, value }: TextInputProps) {
  return (
    <DefaultTextInput
      className="bg-neutral-5 p-md font-roboto-mono-md text-body-sm leading-base text-text-0 antialiased"
      value={value}
      onChangeText={(text) => onChangeText(text)}
    />
  );
}
