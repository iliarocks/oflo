import { View } from "react-native";
import Button from "@/components/Button";
import { usePathname, useRouter } from "expo-router";

export default function TabBar() {
  const router = useRouter();
  const path = usePathname();

  const openCreate = () => router.navigate("/create");

  const goToIndex = () => router.navigate("/");
  const goToInbox = () => router.navigate("/inbox");
  const goToUpcoming = () => router.navigate("/upcoming");
  const goToMore = () => router.navigate("/more");

  const isIndex = path === "/";
  const isInbox = path === "/inbox";
  const isUpcoming = path === "/upcoming";
  const isMore = path === "/more";

  return (
    <View className="flex-row justify-between">
      <View className="h-3xl flex-row rounded-full bg-neutral-50">
        <Button icon="tray" onPress={goToInbox} active={isInbox} />
        <Button icon="sun.max" onPress={goToIndex} active={isIndex} />
        <Button icon="calendar" onPress={goToUpcoming} active={isUpcoming} />
        <Button icon="ellipsis" onPress={goToMore} active={isMore} />
      </View>
      <Button icon="plus" onPress={openCreate} />
    </View>
  );
}
