import { View } from "react-native";
import Text from "@/components/Text";
import { useUser } from "@/hooks/useUser";
import { db } from "@/utilities/database";
import Header from "@/components/Header";
import ItemList from "@/components/ItemList";
import { queries, filterTodayItems } from "@/utilities/items";

export default function Today() {
  const user = useUser();
  const { isLoading, error, data } = db.useQuery(queries.today(user));

  if (isLoading || error) return null;

  const { todos, templates } = filterTodayItems(data);

  return (
    <View className="flex-1 gap-md bg-neutral-50">
      <Header justify="between">
        <Text>today</Text>
      </Header>
      <ItemList todos={todos} templates={templates} />
    </View>
  );
}
