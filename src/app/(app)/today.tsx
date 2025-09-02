import Text from "@/components/Text";
import View from "@/components/View";
import Header from "@/components/Header";
import { useUser } from "@/hooks/useUser";
import { db } from "@/utilities/database";
import { format } from "date-fns";
import _ from "lodash";
import TodoList from "@/components/TodoList";

export default function Today() {
  const user = useUser();

  const todayString = format(new Date(), "yyyy-MM-dd");

  const query = {
    todos: {
      $: {
        where: {
          "user.id": user.id,
          completed: false,
        },
      },
    },
  } as const;

  const { isLoading, error, data } = db.useQuery(query);

  if (isLoading || error) return null;
  const todos = _.filter(data.todos, (o) => {
    return o.date <= todayString;
  });

  return (
    <View className="gap-md bg-neutral-0" grow>
      <Header justify="between">
        <Text>today</Text>
      </Header>
      <TodoList todos={todos} />
    </View>
  );
}
