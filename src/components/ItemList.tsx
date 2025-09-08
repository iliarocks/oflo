import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { generateKeyBetween } from "@/utilities/fractional";
import _ from "lodash";
import { db, id } from "@/utilities/database";
import { format } from "date-fns";
import Item from "@/components/Item";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useUser } from "@/hooks/useUser";
import { Todo, Template, isTodo } from "@/utilities/items";

function generateNewPosition(positions: string[], to: number) {
  const prev = positions[to - 1] ?? null;
  const next = positions[to + 1] ?? null;
  return generateKeyBetween(prev, next);
}

type ItemListProps = {
  todos: Todo[];
  templates: Template[];
};

export default function ItemList({ todos, templates }: ItemListProps) {
  const user = useUser();

  const handleDragEnd = async ({
    data,
    from,
    to,
  }: {
    data: (Todo | Template)[];
    from: number;
    to: number;
  }) => {
    if (from === to) return;

    const draggedItem = data[to];
    const newPosition = generateNewPosition(_(data).filter("position").map("position").value(), to);

    if (isTodo(draggedItem)) {
      await db.transact([db.tx.todos[draggedItem.id].update({ position: newPosition })]);
    }

    if (!isTodo(draggedItem)) {
      const { label, time } = draggedItem;
      const todo = {
        label,
        time,
        date: format(new Date(), "yyyy-MM-dd"),
        completed: false,
        position: newPosition,
      };

      await db.transact([
        db.tx.todos[id()].create(todo).link({ user: user.id, template: draggedItem.id }),
      ]);
    }
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Todo | Template>) => {
    return <Item item={item} onDrag={drag} dragActive={isActive} />;
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <DraggableFlatList
        data={[...todos, ...templates]}
        onDragEnd={handleDragEnd}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </GestureHandlerRootView>
  );
}
