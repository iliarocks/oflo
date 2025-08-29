import { InstaQLEntity } from "@instantdb/react-native";
import { AppSchema } from "@/instant.schema";
import View from "@/components/View";
import Text from "@/components/Text";
import { Pressable } from "react-native";
import { db } from "@/utilities/database";

type TodoType = InstaQLEntity<AppSchema, "todos">;

type TodoProps = {
  todo: TodoType;
  onDrag: () => void;
  dragActive: boolean;
};

export default function Todo({ todo, onDrag, dragActive }: TodoProps) {
  const baseStyles = "px-xl py-sm flex-row gap-md items-center";
  const dragStyles = "bg-neutral-5";
  const styles = dragActive ? [baseStyles, dragStyles].join(" ") : baseStyles;

  const handleCheck = () => {
    db.transact(db.tx.todos[todo.id].delete());
  };

  const handlePress = () => {
    console.log("pressed");
  };

  const handleLongPress = () => {
    console.log("log pressed");
    onDrag();
  };

  return (
    <View className={styles}>
      <Pressable
        onPress={handleCheck}
        className="h-lg w-lg border-[2px] border-primary-0"
      ></Pressable>
      <Pressable onPress={handlePress} onLongPress={handleLongPress}>
        <Text>{todo.label}</Text>
      </Pressable>
    </View>
  );
}
