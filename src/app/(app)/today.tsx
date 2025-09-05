import Text from "@/components/Text";
import { View } from "react-native";
import Header from "@/components/Header";
import { useUser } from "@/hooks/useUser";
import { db } from "@/utilities/database";
import { format } from "date-fns";
import _ from "lodash";
import UnifiedTodoList from "@/components/UnifiedTodoList";
import { shouldShowTemplateToday, shouldShowTemplateTodoType } from "@/utilities/repeatCalculator";

export default function Today() {
  const user = useUser();

  const today = new Date();
  const todayString = format(today, "yyyy-MM-dd");

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

  const todos = _.filter(data.todos, (o) => {
    return o.date <= todayString;
  });

  // Get template IDs that already have todos for today
  const templateIdsWithTodos = new Set(
    todos
      .filter((todo) => todo.date === todayString && todo.template)
      .map((todo) => todo.template?.id)
      .filter(Boolean),
  );

  // Filter templates that should appear today
  const templatesForToday = _.filter(data.templates, (template) => {
    // Skip templates that already have a todo for today
    if (templateIdsWithTodos.has(template.id)) {
      return false;
    }

    if (template.repeat?.type === "calendar") {
      return shouldShowTemplateToday(template, today);
    } else if (template.repeat?.type === "todo") {
      return shouldShowTemplateTodoType(template, today);
    }
    return false;
  });

  return (
    <View className="flex-1 gap-md bg-neutral-50">
      <Header justify="between">
        <Text>today</Text>
      </Header>
      <UnifiedTodoList 
        todos={todos} 
        templates={templatesForToday}
        userId={user.id}
      />
    </View>
  );
}
