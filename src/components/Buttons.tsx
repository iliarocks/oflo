import Text from "@/components/Text";
import { COLOR } from "@/constants/color";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ReactNode } from "react";
import { Pressable } from "react-native";

type Style = "primary" | "secondary";

// --- Text Button ---

interface TextButtonProps {
  onPress: () => void;
  children?: ReactNode;
}

export function TextButton({ onPress, children }: TextButtonProps) {
  const styles = "items-center p-md bg-primary-0";

  return (
    <Pressable className={styles} onPress={onPress}>
      <Text>{children}</Text>
    </Pressable>
  );
}

// --- Icon Button ---

type Icon = "add" | "sell" | "calendar-month" | "delete";

interface IconButtonProps {
  icon: Icon;
  onPress: () => void;
}

export function IconButton({ icon, onPress }: IconButtonProps) {
  const styles = "p-md bg-primary-0";

  return (
    <Pressable className={styles} onPress={onPress}>
      <MaterialIcons name={icon} size={24} color={COLOR["text-0"]} />
    </Pressable>
  );
}
