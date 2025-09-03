import { InstaQLEntity } from "@instantdb/react-native";
import { AppSchema } from "@/instant.schema";
import View from "@/components/View";
import Text from "@/components/Text";
import { Pressable } from "react-native";
import { db } from "@/utilities/database";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { EditContext } from "@/context/EditContext";

type TodoType = InstaQLEntity<AppSchema, "todos">;

type TodoProps = {
  todo: TodoType;
  onDrag: () => void;
  dragActive: boolean;
};

export default function Todo({ todo, onDrag, dragActive }: TodoProps) {
  const router = useRouter();
  const { initializeFromTodo } = useContext(EditContext);
  const containerStyles = dragActive 
    ? "mx-md my-xs border border-neutral-3 rounded-md bg-neutral-5" 
    : "mx-md my-xs border border-neutral-3 rounded-md bg-neutral-0";

  const handleCheck = () => {
    db.transact(db.tx.todos[todo.id].update({ completed: !todo.completed }));
  };

  const handlePress = () => {
    initializeFromTodo(todo);
    router.navigate("/edit");
  };

  const handleLongPress = () => {
    onDrag();
  };

  return (
    <View className={containerStyles}>
      <View className="px-md py-sm flex-row gap-md items-center">
        <Pressable
          onPress={handleCheck}
          className="h-lg w-lg border-[2px] border-primary-0 rounded"
        />
        <Pressable onPress={handlePress} onLongPress={handleLongPress} className="flex-1">
          <View className="flex-row items-center gap-sm">
            <Text style="primary">{todo.label}</Text>
            {todo.time && todo.time !== "all-day" && (
              <Text style="secondary" size="sm">
                • {todo.time}
              </Text>
            )}
          </View>
        </Pressable>
      </View>
    </View>
  );
}
