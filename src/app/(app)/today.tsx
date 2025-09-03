import Text from "@/components/Text";
import View from "@/components/View";
import Header from "@/components/Header";
import { useUser } from "@/hooks/useUser";
import { db } from "@/utilities/database";
import { format } from "date-fns";
import _ from "lodash";
import TodoList from "@/components/TodoList";
import TemplateItem from "@/components/TemplateItem";
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
      .filter(todo => todo.date === todayString && todo.template)
      .map(todo => todo.template?.id)
      .filter(Boolean)
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
    <View className="gap-md bg-neutral-0" grow>
      <Header justify="between">
        <Text>today</Text>
      </Header>
      <View className="flex-1">
        {/* Regular todos */}
        <TodoList todos={todos} />
        
        {/* Templates section */}
        {templatesForToday.length > 0 && (
          <View className="mt-lg px-xl">
            <Text style="secondary" size="sm">recurring tasks</Text>
            <View className="gap-sm">
              {templatesForToday.map((template) => (
                <TemplateItem 
                  key={template.id} 
                  template={template}
                  userId={user.id}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
