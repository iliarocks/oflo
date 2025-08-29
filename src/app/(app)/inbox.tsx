import View from "@/components/View";
import Text from "@/components/Text";
import { useUser } from "@/hooks/useUser";
import { db } from "@/utilities/database";
import Todo from "@/components/Todo";

export default function Inbox() {
  const user = useUser();

  const query = {
    todos: {
      $: {
        where: {
          date: { $isNull: true },
          "user.id": user.id,
        },
      },
    },
  } as const;

  const { isLoading, error, data } = db.useQuery(query);

  if (isLoading || error) return null;

  console.log(data.todos);

  return (
    <View className="bg-neutral-0" grow safe>
      {data.todos.map((item, i) => {
        return <Todo todo={item} onDrag={() => {}} dragActive={false} />;
      })}
    </View>
  );
}
