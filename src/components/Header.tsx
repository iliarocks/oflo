import { ReactNode } from "react";
import { View } from "react-native";

type HeaderProps = {
  justify?: "end" | "between";
  children?: ReactNode;
};

export default function Header({ justify = "end", children }: HeaderProps) {
  return (
    <View className={`flex-row items-center px-xl justify-${justify}`}>
      {children}
    </View>
  );
}
