import View from "@/components/View";
import { Option } from "@/utilities/types";
import _ from "lodash";
import { TextInput as RNTextInput } from "react-native";
import { ToggleButton } from "./Buttons";
import Text from "@/components/Text";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

// ——— Text Input ———

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function TextInput({ value, onChangeText }: TextInputProps) {
  return (
    <RNTextInput
      value={value}
      onChangeText={(text) => onChangeText(text)}
      className="border border-neutral-75 bg-neutral-25 p-md font-ubuntu-rg text-body-sm leading-base text-text-75 antialiased"
    />
  );
}

// ——— List Select ———

type ListSelectBase = {
  options: Option[];
};

type ListSelectProps<T = any> = ListSelectBase &
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

// ——— Time Input ———

type TimeInputProps = {
  label: string;
  value: Date;
  onChange: ((event: DateTimePickerEvent, date?: Date) => void) | undefined;
};

export function TimeInput({ label, value, onChange }: TimeInputProps) {
  return (
    <View className="bg-neutral-5 flex-row items-center justify-between pl-md">
      <Text>{label}</Text>
      <DateTimePicker mode="time" value={value} onChange={onChange} display="inline" />
    </View>
  );
}
