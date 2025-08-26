import Text from "@/components/Text";
import View from "@/components/View";
import { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  children?: ReactNode;
};

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <View className="gap-sm">
      <Text style="secondary">{title}</Text>
      {children}
    </View>
  );
}
