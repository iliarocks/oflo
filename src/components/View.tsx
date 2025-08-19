import { ReactNode } from "react";
import { SafeAreaView, View as DefaultView } from "react-native";

interface ScreenViewProps {
  grow?: boolean;
  safe?: boolean;
  className?: string;
  children?: ReactNode;
}

export default function View({
  grow = false,
  safe = false,
  className = "",
  children,
}: ScreenViewProps) {
  const conditionalStyles = grow ? "flex-1" : "";
  const styles = [conditionalStyles, className].join(" ");

  if (safe) return <SafeAreaView className={styles}>{children}</SafeAreaView>;

  return <DefaultView className={styles}>{children}</DefaultView>;
}
