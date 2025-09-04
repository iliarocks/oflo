import Text from "@/components/Text";
import { COLOR } from "@/constants/color";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ReactNode } from "react";
import { Pressable } from "react-native";

// --- Text Button ---

type TextButtonProps = {
  onPress: () => void;
  children?: ReactNode;
};

export function TextButton({ onPress, children }: TextButtonProps) {
  const styles = "items-center p-md bg-primary-50";

  return (
    <Pressable className={styles} onPress={onPress}>
      <Text color="25">{children}</Text>
    </Pressable>
  );
}

// --- Icon Button ---

type Icon = "add" | "sell" | "calendar-month" | "delete";

type IconButtonProps = {
  icon: Icon;
  onPress: () => void;
};

export function IconButton({ icon, onPress }: IconButtonProps) {
  const styles = "p-md bg-primary-0";

  return (
    <Pressable className={styles} onPress={onPress}>
      <MaterialIcons name={icon} size={24} color={COLOR["text-0"]} />
    </Pressable>
  );
}

// --- Toggle Button ---

type ToggleButtonProps = {
  isSelected: boolean;
  onPress: () => void;
  children?: ReactNode;
};

export function ToggleButton({ isSelected, onPress, children }: ToggleButtonProps) {
  const styles = `grow items-center p-md ${isSelected ? "bg-primary-0" : "bg-neutral-5"}`;

  return (
    <Pressable onPress={onPress} className={styles}>
      <Text>{children}</Text>
    </Pressable>
  );
}

// --- Status Button ---

type StatusButtonProps = {
  status: string;
  onPress: () => void;
  children?: ReactNode;
};

export function StatusButton({ status, onPress, children }: StatusButtonProps) {
  return (
    <Pressable
      className="bg-neutral-5 flex-row items-center justify-between p-md"
      onPress={onPress}
    >
      <Text style="secondary">{children}</Text>
      <Text>{status}</Text>
    </Pressable>
  );
}
