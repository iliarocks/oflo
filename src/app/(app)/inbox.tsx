import { View } from "react-native";
import Text from "@/components/Text";
import { useUser } from "@/hooks/useUser";
import { db } from "@/utilities/database";
import Header from "@/components/Header";
import TodoList from "@/components/TodoList";
import _ from "lodash";
import ItemList from "@/components/ItemList";

export default function Inbox() {
  const user = useUser();

  const query = {
    todos: {
      $: {
        where: {
          date: { $isNull: true },
          "user.id": user.id,
          completed: false,
        },
        order: {
          position: "asc",
        },
      },
    },
  } as const;

  const { isLoading, error, data } = db.useQuery(query);

  if (isLoading || error) return null;

  return (
    <View className="flex-1 gap-md bg-neutral-50">
      <Header justify="between">
        <Text>inbox</Text>
      </Header>
      <ItemList todos={data.todos} templates={[]} user={user} />
    </View>
  );
}
