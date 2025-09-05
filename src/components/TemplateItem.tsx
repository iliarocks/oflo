import { InstaQLEntity } from "@instantdb/react-native";
import { AppSchema } from "@/instant.schema";
import { View, Pressable } from "react-native";
import Text from "@/components/Text";
import { db, id } from "@/utilities/database";
import { format } from "date-fns";
import { generateKeyBetween } from "fractional-indexing";
import _ from "lodash";
import { getNextOccurrence } from "@/utilities/repeatCalculator";
import { Repeat } from "@/entities/Repeat";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { EditContext } from "@/context/EditContext";

type TemplateType = InstaQLEntity<AppSchema, "templates">;

type TemplateItemProps = {
  template: TemplateType;
  userId: string;
};

export default function TemplateItem({ template, userId }: TemplateItemProps) {
  const router = useRouter();
  const { initializeFromTemplate } = useContext(EditContext);

  const handleCheck = async () => {
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

    // Create a completed todo from the template
    const todoId = id();
    const today = new Date();
    const todo = {
      label: template.label,
      date: format(today, "yyyy-MM-dd"),
      time: template.time,
      completed: true,
      position: generateKeyBetween(null, first),
    };

    // Calculate the next occurrence date for the template
    let nextReferenceDate = today;
    
    if (template.repeat?.type === "calendar") {
      // For calendar type, update to the next occurrence
      const repeat = new Repeat(template.repeat.type, template.date ? new Date(template.date) : today);
      Object.assign(repeat.frequency, template.repeat.frequency || {});
      
      const nextDate = getNextOccurrence(repeat, today);
      if (nextDate) {
        nextReferenceDate = nextDate;
      }
    } else if (template.repeat?.type === "todo") {
      // For todo type, update reference to today (when it was completed)
      nextReferenceDate = today;
    }

    // Create the todo and link it to the template, then update the template's date
    await db.transact([
      db.tx.todos[todoId].create(todo).link({ user: userId, template: template.id }),
      db.tx.templates[template.id].update({ 
        date: format(nextReferenceDate, "yyyy-MM-dd")
      })
    ]);
  };

  const handlePress = () => {
    initializeFromTemplate(template);
    router.navigate("/edit");
  };

  return (
    <View className="mx-md my-xs border border-neutral-3 border-dashed rounded-md bg-neutral-0">
      <View className="px-md py-sm flex-row gap-md items-center">
        <Pressable
          onPress={handleCheck}
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