import Text from "@/components/Text";
import { COLOR } from "@/constants/color";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ReactNode } from "react";
import { Pressable } from "react-native";

// ——— Text Button ———

type TextButtonProps = {
  onPress: () => void;
  children?: ReactNode;
};

export function TextButton({ onPress, children }: TextButtonProps) {
  return (
    <Pressable className="items-center bg-primary-50 p-md" onPress={onPress}>
      <Text color="25">{children}</Text>
    </Pressable>
  );
}

// ——— Icon Button ———

type Icon = "add" | "sell" | "calendar-month" | "delete";

type IconButtonProps = {
  icon: Icon;
  onPress: () => void;
};

export function IconButton({ icon, onPress }: IconButtonProps) {
  return (
    <Pressable className="bg-primary-50 p-md" onPress={onPress}>
      <MaterialIcons name={icon} size={24} color={COLOR["text-25"]} />
    </Pressable>
  );
}

// ——— Toggle Button ———

type ToggleButtonProps = {
  isSelected: boolean;
  onPress: () => void;
  children?: ReactNode;
};

export function ToggleButton({ isSelected, onPress, children }: ToggleButtonProps) {
  return (
    <Pressable
      className={` grow items-center p-md ${isSelected ? "bg-primary-50" : "bg-neutral-25"}`}
      onPress={onPress}
    >
      <Text color={isSelected ? "25" : "50"}>{children}</Text>
    </Pressable>
  );
}

// ——— Status Button ———

type StatusButtonProps = {
  label: string;
  onPress: () => void;
  children?: ReactNode;
};

export function StatusButton({ label, onPress, children }: StatusButtonProps) {
  return (
    <Pressable
      className="flex-row items-center justify-between border border-neutral-75 bg-neutral-25 p-md"
      onPress={onPress}
    >
      <Text color="50">{label}</Text>
      <Text font="roboto-mono">{children}</Text>
    </Pressable>
  );
}
