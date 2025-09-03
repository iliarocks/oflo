import View from "@/components/View";
import Text from "@/components/Text";
import { useUser } from "@/hooks/useUser";
import { db } from "@/utilities/database";
import Header from "@/components/Header";
import TodoList from "@/components/TodoList";
import _ from "lodash";

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
      },
    },
  } as const;

  const { isLoading, error, data } = db.useQuery(query);

  if (isLoading || error) return null;

  return (
    <View className="gap-md bg-neutral-0" grow safe>
      <Header justify="between">
        <Text>inbox</Text>
      </Header>
      <TodoList todos={_.orderBy(data.todos, ["position"], ["asc"])} />
    </View>
  );
}
