import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "@/instant.schema";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Todo from "@/components/Todo";
import { db } from "@/utilities/database";
import { generateKeyBetween } from "fractional-indexing";

type TodoType = InstaQLEntity<AppSchema, "todos">;

interface TodoListProps {
  todos: TodoType[];
}

function generateNewPosition(data: { position: string }[], to: number) {
  if (to === 0) {
    return generateKeyBetween(null, data[1]?.position || null);
  }
  if (to === data.length - 1) {
    return generateKeyBetween(data[data.length - 2]?.position || null, null);
  }

  const prev = to - 1;
  const next = to + 1;
  return generateKeyBetween(data[prev].position, data[next].position);
}

export default function TodoList({ todos }: TodoListProps) {
  const handleDragEnd = ({ data, from, to }: { data: TodoType[]; from: number; to: number }) => {
    if (from === to) return;
    console.log("data: ", data);
    console.log("to: ", to);

    const newPosition = generateNewPosition(data, to);
    console.log("new pos: ", newPosition);
    db.transact([db.tx.todos[data[to].id].update({ position: newPosition })]);
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<TodoType>) => {
    return <Todo todo={item} onDrag={drag} dragActive={isActive} />;
  };

  return (
    <GestureHandlerRootView className="flex-1 justify-center">
      <DraggableFlatList
        data={todos}
        onDragEnd={handleDragEnd}
        keyExtractor={(todo) => todo.id}
        renderItem={renderItem}
      />
    </GestureHandlerRootView>
  );
}
