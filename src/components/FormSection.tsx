import Text from "@/components/Text";
import { View } from "react-native";
import { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  children?: ReactNode;
};

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <View className="gap-sm">
      <Text color="50">{title}</Text>
      {children}
    </View>
  );
}
