import Text from "@/components/Text";
import View from "@/components/View";
import Header from "@/components/Header";
import { useUser } from "@/hooks/useUser";
import { db, id } from "@/utilities/database";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import _ from "lodash";
import { ScrollView, Pressable } from "react-native";
import { shouldShowTemplateToday, shouldShowTemplateTodoType } from "@/utilities/repeatCalculator";
import { InstaQLEntity } from "@instantdb/react-native";
import { AppSchema } from "@/instant.schema";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { EditContext } from "@/context/EditContext";

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
    <View className="mx-md my-xs border border-neutral-3 rounded-md bg-neutral-0">
      <View className="px-md py-sm flex-row gap-md items-center">
        <Pressable
          onPress={handleCheck}
          className="h-lg w-lg border-[2px] border-primary-0 rounded"
        />
        <Pressable onPress={handlePress} className="flex-1">
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

function TemplateItemSimple({ template, userId }: { template: TemplateType; userId: string }) {
  const router = useRouter();
  const { initializeFromTemplate } = useContext(EditContext);
  
  const handleCreateFromTemplate = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const todoId = id();
    db.transact(
      db.tx.todos[todoId].update({
        label: template.label,
        date: today,
        time: template.time || "all-day",
        completed: false,
      }).link({ user: userId, template: template.id })
    );
  };
  
  const handlePress = () => {
    initializeFromTemplate(template);
    router.navigate("/edit");
  };

  return (
    <View className="mx-md my-xs border border-neutral-3 border-dashed rounded-md bg-neutral-0">
      <View className="px-md py-sm flex-row gap-md items-center">
        <Pressable
          onPress={handleCreateFromTemplate}
          className="h-lg w-lg border-[2px] border-primary-0 border-dashed rounded"
        />
        <Pressable onPress={handlePress} className="flex-1">
          <View className="flex-row items-center gap-sm">
            <Text style="secondary">{template.label}</Text>
            {template.time && template.time !== "all-day" && (
              <Text style="secondary" size="sm">
                • {template.time}
              </Text>
            )}
          </View>
        </Pressable>
      </View>
    </View>
  );
}

function DateBin({ date, todos, templates, userId }: { 
  date: Date; 
  todos: TodoType[]; 
  templates: TemplateType[];
  userId: string;
}) {
  const dateString = format(date, "yyyy-MM-dd");
  const displayDate = format(date, "EEEE, MMMM d");
  
  const todosForDate = todos.filter(todo => todo.date === dateString);
  
  // Get template IDs that already have todos for this date
  const templateIdsWithTodos = new Set<string>();
  todosForDate.forEach(todo => {
    // Check if todo has a template link
    if ('template' in todo && todo.template && typeof todo.template === 'object' && 'id' in todo.template) {
      templateIdsWithTodos.add((todo.template as any).id);
    }
  });
  
  const templatesForDate = templates.filter(template => {
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
    <View className="mb-lg bg-neutral-5 rounded-lg overflow-hidden">
      <View className="px-xl py-sm">
        <Text style="secondary" size="sm">
          {displayDate}
        </Text>
      </View>
      
      {todosForDate.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      
      {templatesForDate.map(template => (
        <TemplateItemSimple 
          key={template.id} 
          template={template} 
          userId={userId}
        />
      ))}
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
    <View className="gap-md bg-neutral-0" grow>
      <Header justify="between">
        <Text>upcoming</Text>
      </Header>
      <ScrollView className="flex-1 px-md">
        {dates.map(date => (
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