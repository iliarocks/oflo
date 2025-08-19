import { TextInput as DefaultTextInput, Pressable } from "react-native";
import View from "@/components/View";
import Text from "@/components/Text";
import { useState } from "react";

// --- Toggle Select ---

type ToggleOption = {
  key: string;
  value: any;
};

interface ToggleSelectProps {
  options: ToggleOption[];
  onToggle: (value: any) => void;
}

export function ToggleSelect({ options, onToggle }: ToggleSelectProps) {
  const [selected, setSelected] = useState<any>(options[0].value);

  const handleToggle = (value: any) => {
    setSelected(value);
    onToggle(value);
  };

  return (
    <View className="flex-row">
      {options.map((option) => {
        return (
          <Pressable
            className={`flex-1 items-center p-md ${selected === option.value ? "bg-primary-0" : "bg-neutral-5"}`}
            onPress={() => handleToggle(option.value)}
          >
            <Text style={selected === option.value ? "primary" : "secondary"}>
              {option.key}
            </Text>
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

export default function TextInput({ onChangeText, value }: TextInputProps) {
  return (
    <DefaultTextInput
      className="bg-neutral-5 p-md font-roboto-mono-md text-body-sm leading-base text-text-0 antialiased"
      value={value}
      onChangeText={(text) => onChangeText(text)}
    />
  );
}
