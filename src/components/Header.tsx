import Text from "@/components/Text";
import { TextButton } from "./Buttons";
import { View } from "react-native";

interface Button {
  type: "button";
  text: string;
  onPress: () => void;
}

interface Label {
  type: "label";
  text: string;
}

interface HeaderProps {
  items: (Button | Label)[];
}

export default function Header({ items }: HeaderProps) {
  const justify = items.length === 1 ? "justify-end" : "justify-between";

  return (
    <View className={`flex-row items-center px-xl ${justify}`}>
      {items.map(ItemConstructor)}
    </View>
  );
}

function ItemConstructor(item: Label | Button, key: number) {
  if (item.type === "label") return <Text key={key}>{item.text}</Text>;

  return (
    <TextButton onPress={item.onPress} key={key}>
      {item.text}
    </TextButton>
  );
}
