import { Pressable, View } from "react-native";
import Text from "@/components/Text";
import { db, id } from "@/utilities/database";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { FormContext } from "@/context/FormContext";
import { isTodo, Todo, Template } from "@/utilities/items";
import { format } from "date-fns";
import { generateKeyBetween } from "@/utilities/fractional";
import _ from "lodash";
import { useUser } from "@/hooks/useUser";

type ItemProps = {
  item: Todo | Template;
  onDrag?: () => void;
  dragActive?: boolean;
};

export default function Item({ item, onDrag, dragActive }: ItemProps) {
  const router = useRouter();
  const user = useUser();
  const { initTodoEdit, initTemplateEdit } = useContext(FormContext);
  
  const isItemTodo = isTodo(item);
  const isDragging = dragActive ? "border-secondary-75 bg-secondary-0" : "border-neutral-75 bg-neutral-25";
  const checkStyle = isItemTodo ? "" : "border-dashed";

  const handleCheck = async () => {
    if (isItemTodo) {
      await db.transact(db.tx.todos[item.id].update({ completed: !item.completed }));
    } else {
      // Create todo from template
      const { data } = await db.queryOnce({ todos: { $: { where: { user: user.id } } } });
      const first = _.minBy(data.todos, "position")?.position ?? null;
      
      await db.transact(
        db.tx.todos[id()]
          .create({
            label: item.label,
            date: format(new Date(), "yyyy-MM-dd"),
            time: item.time,
            completed: false,
            position: generateKeyBetween(null, first),
          })
          .link({ user: user.id, template: item.id })
      );
    }
  };

  const handlePress = () => {
    isItemTodo ? initTodoEdit(item) : initTemplateEdit(item);
    router.navigate("/edit");
  };

  return (
    <View className={`flex-row gap-lg border p-md ${isDragging}`}>
      <Pressable className={`size-xl border border-neutral-75 ${checkStyle}`} onPress={handleCheck} />
      <Pressable className="flex-1 flex-row items-center justify-between" onPress={handlePress} onLongPress={onDrag}>
        <Text weight="rg">{item.label}</Text>
        {item.time && item.time !== "all-day" && (
          <Text color="50" size="xs">{item.time}</Text>
        )}
      </Pressable>
    </View>
  );
}
