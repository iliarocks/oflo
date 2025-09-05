import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "@/instant.schema";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Todo from "@/components/Todo";
import { db, id } from "@/utilities/database";
import { generateKeyBetween } from "fractional-indexing";
import { format } from "date-fns";
import { View, Pressable } from "react-native";
import Text from "@/components/Text";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { EditContext } from "@/context/EditContext";

type TodoType = InstaQLEntity<AppSchema, "todos">;
type TemplateType = InstaQLEntity<AppSchema, "templates">;

type ListItem = {
  type: "todo" | "template";
  data: TodoType | TemplateType;
  position: string;
};

interface UnifiedTodoListProps {
  todos: TodoType[];
  templates: TemplateType[];
  userId: string;
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

function TemplateTodoItem({ template, onDrag, dragActive, userId }: {
  template: TemplateType;
  onDrag: () => void;
  dragActive: boolean;
  userId: string;
}) {
  const router = useRouter();
  const { initializeFromTemplate } = useContext(EditContext);
  
  const containerStyles = dragActive
    ? "mx-xl border border-secondary-75 bg-secondary-0"
    : "mx-xl border border-neutral-75 bg-neutral-25";

  const handleCheck = async () => {
    // Create a completed todo from the template
    const todoId = id();
    const today = new Date();
    const todo = {
      label: template.label,
      date: format(today, "yyyy-MM-dd"),
      time: template.time,
      completed: true,
      position: generateKeyBetween(null, null), // Will be updated if needed
    };

    await db.transact([
      db.tx.todos[todoId].create(todo).link({ user: userId, template: template.id })
    ]);
  };

  const handlePress = () => {
    initializeFromTemplate(template);
    router.navigate("/edit");
  };

  const handleLongPress = () => {
    onDrag();
  };

  return (
    <View className={containerStyles}>
      <View className="flex-row items-center gap-lg px-md py-sm">
        <Pressable onPress={handleCheck} className="h-xl w-xl border border-neutral-75 border-dashed" />
        <Pressable
          onPress={handlePress}
          onLongPress={handleLongPress}
          className="flex-1 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-sm">
            <Text weight="rg">{template.label}</Text>
          </View>
          {template.time && template.time !== "all-day" && (
            <Text color="50" size="xs">
              {template.time}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export default function UnifiedTodoList({ todos, templates, userId }: UnifiedTodoListProps) {
  // Sort todos by position first
  const sortedTodos = [...todos].sort((a, b) => {
    if (!a.position && !b.position) return 0;
    if (!a.position) return 1;
    if (!b.position) return -1;
    return a.position.localeCompare(b.position);
  });

  // Get the last todo's position
  const lastTodoPosition = sortedTodos[sortedTodos.length - 1]?.position || null;

  // Generate positions for templates that come after all todos
  let lastPosition = lastTodoPosition;
  const templatePositions = templates.map(() => {
    const newPos = generateKeyBetween(lastPosition, null);
    lastPosition = newPos;
    return newPos;
  });

  // Combine todos and templates into a single list
  const combinedList: ListItem[] = [
    ...sortedTodos.map(todo => ({
      type: "todo" as const,
      data: todo,
      position: todo.position
    })),
    ...templates.map((template, index) => ({
      type: "template" as const,
      data: template,
      position: templatePositions[index]
    }))
  ];

  const handleDragEnd = async ({ data, from, to }: { data: ListItem[]; from: number; to: number }) => {
    if (from === to) return;

    const draggedItem = data[to];
    const newPosition = generateNewPosition(data, to);

    if (draggedItem.type === "todo") {
      // Just update the todo's position
      const todo = draggedItem.data as TodoType;
      await db.transact([db.tx.todos[todo.id].update({ position: newPosition })]);
    } else {
      // Convert template to todo with the new position
      const template = draggedItem.data as TemplateType;
      const todoId = id();
      const today = format(new Date(), "yyyy-MM-dd");
      
      const newTodo = {
        label: template.label,
        date: today,
        time: template.time,
        completed: false,
        position: newPosition,
      };

      await db.transact([
        db.tx.todos[todoId].create(newTodo).link({ user: userId, template: template.id })
      ]);
    }
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<ListItem>) => {
    if (item.type === "todo") {
      return <Todo todo={item.data as TodoType} onDrag={drag} dragActive={isActive} />;
    } else {
      return (
        <TemplateTodoItem
          template={item.data as TemplateType}
          onDrag={drag}
          dragActive={isActive}
          userId={userId}
        />
      );
    }
  };

  return (
    <GestureHandlerRootView className="flex-1 justify-center">
      <DraggableFlatList
        data={combinedList}
        onDragEnd={handleDragEnd}
        keyExtractor={(item) => `${item.type}-${item.data.id}`}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 8 }}
      />
    </GestureHandlerRootView>
  );
}