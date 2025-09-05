import Text from "@/components/Text";
import { View, Pressable } from "react-native";
import Header from "@/components/Header";
import { useUser } from "@/hooks/useUser";
import { db, id } from "@/utilities/database";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import _ from "lodash";
import { ScrollView } from "react-native";
import { shouldShowTemplateToday, shouldShowTemplateTodoType } from "@/utilities/repeatCalculator";
import { InstaQLEntity } from "@instantdb/react-native";
import { AppSchema } from "@/instant.schema";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { EditContext } from "@/context/EditContext";
import { generateKeyBetween } from "fractional-indexing";

type TodoType = InstaQLEntity<AppSchema, "todos">;
type TemplateType = InstaQLEntity<AppSchema, "templates">;

function TodoItem({ todo }: { todo: TodoType }) {
  const router = useRouter();
  const { initializeFromTodo } = useContext(EditContext);

  const handleCheck = () => {
    db.transact(db.tx.todos[todo.id].update({ completed: !todo.completed }));
  };

  const handlePress = () => {
    initializeFromTodo(todo);
    router.navigate("/edit");
  };

  return (
    <View className="mx-xl border border-neutral-75 bg-neutral-25">
      <View className="flex-row items-center gap-lg px-md py-sm">
        <Pressable onPress={handleCheck} className="h-xl w-xl border border-neutral-75" />
        <Pressable onPress={handlePress} className="flex-1 flex-row items-center justify-between">
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

function TemplateItemSimple({ template, userId, date }: { template: TemplateType; userId: string; date: string }) {
  const router = useRouter();
  const { initializeFromTemplate } = useContext(EditContext);

  const handleCreateFromTemplate = async () => {
    // Get all todos to find the position for the new todo
    const { data } = await db.queryOnce({
      todos: {
        $: {
          where: {
            user: userId,
          },
        },
      },
    });

    const first = _.orderBy(data.todos, ["position"], ["asc"])[0]?.position ?? null;
    const todoId = id();
    
    const todo = {
      label: template.label,
      date: date,
      time: template.time,
      completed: true,
      position: generateKeyBetween(null, first),
    };

    await db.transact([
      db.tx.todos[todoId].create(todo).link({ user: userId, template: template.id })
    ]);
  };

  const handlePress = () => {
    initializeFromTemplate(template);
    router.navigate("/edit");
  };

  return (
    <View className="mx-xl border border-neutral-75 bg-neutral-25">
      <View className="flex-row items-center gap-lg px-md py-sm">
        <Pressable onPress={handleCreateFromTemplate} className="h-xl w-xl border border-neutral-75 border-dashed" />
        <Pressable onPress={handlePress} className="flex-1 flex-row items-center justify-between">
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

function DateBin({
  date,
  todos,
  templates,
  userId,
}: {
  date: Date;
  todos: TodoType[];
  templates: TemplateType[];
  userId: string;
}) {
  const dateString = format(date, "yyyy-MM-dd");
  const displayDate = format(date, "EEEE, MMMM d");

  const todosForDate = todos.filter((todo) => todo.date === dateString);

  // Get template IDs that already have todos for this date
  const templateIdsWithTodos = new Set<string>();
  todosForDate.forEach((todo) => {
    // Check if todo has a template link
    if (
      "template" in todo &&
      todo.template &&
      typeof todo.template === "object" &&
      "id" in todo.template
    ) {
      templateIdsWithTodos.add((todo.template as any).id);
    }
  });

  const templatesForDate = templates.filter((template) => {
    // Skip templates that already have a todo for this date
    if (templateIdsWithTodos.has(template.id)) {
      return false;
    }

    if (template.repeat?.type === "calendar") {
      return shouldShowTemplateToday(template, date);
    } else if (template.repeat?.type === "todo") {
      return shouldShowTemplateTodoType(template, date);
    }
    return false;
  });

  if (todosForDate.length === 0 && templatesForDate.length === 0) {
    return null;
  }

  return (
    <View className="mb-lg">
      <View className="px-xl py-sm">
        <Text color="50" size="xs">
          {displayDate}
        </Text>
      </View>

      <View className="gap-sm">
        {todosForDate.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}

        {templatesForDate.map((template) => (
          <TemplateItemSimple key={template.id} template={template} userId={userId} date={dateString} />
        ))}
      </View>
    </View>
  );
}

export default function Upcoming() {
  const user = useUser();
  const today = new Date();
  const todayString = format(today, "yyyy-MM-dd");

  const daysToShow = 14;
  const dates = Array.from({ length: daysToShow }, (_, i) => addDays(today, i + 1));

  const query = {
    todos: {
      $: {
        where: {
          "user.id": user.id,
          completed: false,
        },
      },
      template: {},
    },
    templates: {
      $: {
        where: {
          "user.id": user.id,
        },
      },
    },
  } as const;

  const { isLoading, error, data } = db.useQuery(query);

  if (isLoading || error) return null;

  const upcomingTodos = _.filter(data.todos, (o) => {
    return o.date > todayString;
  });

  return (
    <View className="flex-1 gap-md bg-neutral-50">
      <Header justify="between">
        <Text>upcoming</Text>
      </Header>
      <ScrollView className="flex-1">
        {dates.map((date) => (
          <DateBin
            key={date.toISOString()}
            date={date}
            todos={upcomingTodos}
            templates={data.templates}
            userId={user.id}
          />
        ))}
      </ScrollView>
    </View>
  );
}

