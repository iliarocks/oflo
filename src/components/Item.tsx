import { TemplateType, TodoType } from "@/utilities/types";
import { Pressable } from "react-native";
import { View } from "react-native";
import Text from "@/components/Text";

type ItemProps = {
  item: TodoType | TemplateType;
  isActive?: boolean;
  handleDrag?: () => void;
};

export default function Item({ item, isActive = false, handleDrag = () => {} }: ItemProps) {
  const handleCheck = () => {};

  const handlePress = () => {};

  return (
    <View className="flex-row gap-lg border border-neutral-75 bg-neutral-25 p-md">
      <Pressable className="size-xl border border-neutral-75 bg-neutral-25" onPress={handleCheck} />
      <Pressable
        className="flex-row items-center justify-between"
        onPress={handlePress}
        onLongPress={handleDrag}
      >
        <Text weight="rg">{item.label}</Text>
        <Text color="50" weight="rg" size="xs">
          {item.time}
        </Text>
      </Pressable>
    </View>
  );
}
