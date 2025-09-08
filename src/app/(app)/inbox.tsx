import { View } from "react-native";
import Text from "@/components/Text";
import { useUser } from "@/hooks/useUser";
import { db } from "@/utilities/database";
import Header from "@/components/Header";
import _ from "lodash";
import ItemList from "@/components/ItemList";
import { queries } from "@/utilities/items";

export default function Inbox() {
  const user = useUser();

  const { isLoading, error, data } = db.useQuery(queries.inbox(user));

  if (isLoading || error) return null;

  return (
    <View className="flex-1 gap-md bg-neutral-50">
      <Header justify="between">
        <Text>inbox</Text>
      </Header>
      <ItemList todos={data.todos} templates={[]} />
    </View>
  );
}
