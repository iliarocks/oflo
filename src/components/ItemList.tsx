import { TemplateType, TodoType } from "@/utilities/types";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { generateKeyBetween } from "fractional-indexing";
import _ from "lodash";
import { db, id } from "@/utilities/database";
import { User } from "@instantdb/react-native";
import { format } from "date-fns";
import Item from "@/components/Item";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function isTodo(item: TodoType | TemplateType) {
  return _.has(item, "position");
}

function generateNewPosition(positions: string[], to: number) {
  const prev = positions[to - 1] ?? null;
  const next = positions[to + 1] ?? null;
  return generateKeyBetween(prev, next, "abcdefghijklmnopqrstuvwxyz");
}

type ItemListProps = {
  todos: TodoType[];
  templates: TemplateType[];
  user: User;
};

export default function ItemList({ todos, templates, user }: ItemListProps) {
  const handleDragEnd = async ({
    data,
    from,
    to,
  }: {
    data: (TodoType | TemplateType)[];
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

  const renderItem = ({ item, drag, isActive }: RenderItemParams<TodoType | TemplateType>) => {
    if (isTodo(item))
      return (
        <Item item={item as TodoType} isTemplate={false} isActive={isActive} handleDrag={drag} />
      );

    return (
      <Item item={item as TemplateType} isTemplate={true} isActive={isActive} handleDrag={drag} />
    );
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
