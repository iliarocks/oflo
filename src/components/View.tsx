import { ReactNode } from "react";
import { SafeAreaView, View as DefaultView } from "react-native";

interface ScreenViewProps {
  grow?: boolean;
  safe?: boolean;
  className?: string;
  children?: ReactNode;
  style?: any;
}

export default function View({
  grow = false,
  safe = false,
  className = "",
  children,
  style,
}: ScreenViewProps) {
  const conditionalStyles = grow ? "flex-1" : "";
  const styles = `${conditionalStyles} ${className}`.trim();

  if (safe) return <SafeAreaView className={styles} style={style}>{children}</SafeAreaView>;

  return <DefaultView className={styles} style={style}>{children}</DefaultView>;
}
