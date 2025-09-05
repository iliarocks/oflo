import { InstaQLEntity } from "@instantdb/react-native";
import { AppSchema } from "@/instant.schema";
import { View } from "react-native";
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
    ? "mx-xl  border border-secondary-75 bg-secondary-0"
    : "mx-xl  border border-neutral-75 bg-neutral-25";

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
      <View className="flex-row items-center gap-lg px-md py-sm">
        <Pressable onPress={handleCheck} className="h-xl w-xl  border border-neutral-75" />
        <Pressable
          onPress={handlePress}
          onLongPress={handleLongPress}
          className="flex-1 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-sm">
            <Text weight="rg">{todo.label}</Text>
          </View>
          {todo.time && todo.time !== "all-day" && (
            <Text color="50" size="xs">
              {todo.time}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
