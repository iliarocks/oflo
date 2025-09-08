import { View, ScrollView } from "react-native";
import Text from "@/components/Text";
import { useUser } from "@/hooks/useUser";
import { db } from "@/utilities/database";
import Header from "@/components/Header";
import Item from "@/components/Item";
import { queries } from "@/utilities/items";
import { format, addDays } from "date-fns";
import _ from "lodash";
import { shouldShowTemplateToday } from "@/utilities/repeatCalculator";

export default function Upcoming() {
  const user = useUser();
  const { isLoading, error, data } = db.useQuery(queries.upcoming(user));

  if (isLoading || error) return null;

  // Group todos by date for the next 7 days
  const today = new Date();
  const dates = _.times(7, i => addDays(today, i + 1));
  
  const groupedItems = dates.map(date => {
    const dateString = format(date, "yyyy-MM-dd");
    const todos = data.todos.filter(todo => todo.date === dateString);
    
    // Get template IDs that already have todos for this date
    const templateIdsWithTodos = new Set(
      todos
        .filter(todo => todo.template)
        .map(todo => todo.template?.id)
        .filter(Boolean)
    );
    
    // Filter templates for this date based on repeat pattern
    const templates = data.templates.filter(template => {
      if (templateIdsWithTodos.has(template.id)) return false;
      return shouldShowTemplateToday(template, date);
    });
    
    return { date, todos, templates };
  });

  return (
    <View className="flex-1 gap-md bg-neutral-50">
      <Header justify="between">
        <Text>upcoming</Text>
      </Header>
      <ScrollView>
        {groupedItems.map(({ date, todos, templates }) => {
          const items = [...todos, ...templates];
          if (items.length === 0) return null;
          
          return (
            <View key={date.toISOString()} className="mb-lg">
              <View className="px-xl py-sm">
                <Text color="50" size="sm">{format(date, "EEEE, MMMM d")}</Text>
              </View>
              {items.map(item => (
                <Item key={item.id} item={item} onDrag={() => {}} dragActive={false} />
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}