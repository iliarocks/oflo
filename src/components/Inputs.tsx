import { View, Modal } from "react-native";
import { Option } from "@/utilities/types";
import _ from "lodash";
import { TextInput as RNTextInput } from "react-native";
import { ToggleButton, StatusButton, TextButton } from "./Buttons";
import Text from "@/components/Text";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { format } from "date-fns";

// ——— Text Input ———

interface TextInputProps {
  value: string;
  label?: string;
  onChangeText: (text: string) => void;
  type?: "default" | "email-address" | "numeric" | "phone-pad" | "url";
}

export function TextInput({ value, label, onChangeText, type = "default" }: TextInputProps) {
  const input = (
    <RNTextInput
      value={value}
      onChangeText={onChangeText}
      className="border border-neutral-75 bg-neutral-25 p-md font-ubuntu-rg text-sm text-text-75 antialiased"
      autoCapitalize="none"
      keyboardType={type}
    />
  );
  if (!label) return input;

  return (
    <View className="gap-sm">
      <Text color="50" weight="rg">
        {label}
      </Text>
      {input}
    </View>
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
    <View className="flex-auto flex-row flex-wrap border border-neutral-75">
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
  const [showPicker, setShowPicker] = useState(false);
  const formattedTime = format(value, "HH:mm");

  return (
    <>
      <StatusButton status={formattedTime} onPress={() => setShowPicker(!showPicker)}>
        {label}
      </StatusButton>
      {showPicker && (
        <DateTimePicker 
          mode="time" 
          value={value} 
          onChange={(event, date) => {
            setShowPicker(false);
            if (onChange) onChange(event, date);
          }} 
          display="spinner" 
        />
      )}
    </>
  );
}
