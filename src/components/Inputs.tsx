import View from "@/components/View";
import { Option } from "@/utilities/types";
import _ from "lodash";
import { TextInput as DefaultTextInput } from "react-native";
import { ToggleButton } from "./Buttons";

// ——— Text Input ———

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function TextInput({ onChangeText, value }: TextInputProps) {
  return (
    <DefaultTextInput
      value={value}
      onChangeText={(text) => onChangeText(text)}
      className="bg-neutral-5 p-md font-roboto-mono-md text-body-sm leading-base text-text-0 antialiased"
    />
  );
}

// ——— List Select ———

type ListSelectBase<T> = {
  options: Option[];
};

type ListSelectProps<T = any> = ListSelectBase<T> &
  (
    | { unique: false; selected: T[]; onSelect: (selected: T[]) => void }
    | { unique: true; selected: T; onSelect: (selected: T) => void }
  );

export function ListSelect<T = any>(props: ListSelectProps) {
  const { options, selected, onSelect, unique } = props;

  const handlePress = (value: T) => {
    if (unique) return onSelect(value);

    const newSelected = _.xor(selected, [value]);
    if (newSelected.length > 0) onSelect(newSelected);
  };

  const isSelected = (value: T) => {
    return unique ? selected === value : selected.includes(value);
  };

  return (
    <View className="flex-auto flex-row flex-wrap">
      {options.map(({ key, value }, i) => {
        return (
          <ToggleButton key={i} isSelected={isSelected(value)} onPress={() => handlePress(value)}>
            {key}
          </ToggleButton>
        );
      })}
    </View>
  );
}
