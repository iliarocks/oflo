import { InstaQLEntity, User } from "@instantdb/react";
import { AppSchema } from "@/instant.schema";
import { format } from "date-fns";
import _ from "lodash";
import { shouldShowTemplateToday } from "@/utilities/repeatCalculator";

export type Todo = InstaQLEntity<AppSchema, "todos">;
export type Template = InstaQLEntity<AppSchema, "templates">;
export type Item = Todo | Template;

export function isTodo(item: Item): item is Todo {
  return _.has(item, "position");
}

export function isTemplate(item: Item): item is Template {
  return _.has(item, "repeat");
}

export const ORDER = "asc";

export const queries = {
  inbox: (user: User) =>
    ({
      todos: {
        $: {
          where: {
            "user.id": user.id,
            completed: false,
            date: { $isNull: true },
          },
          order: {
            position: ORDER,
          },
        },
      },
    }) as const,
  
  today: (user: User) =>
    ({
      todos: {
        $: {
          where: {
            "user.id": user.id,
            completed: false,
          },
          order: {
            position: ORDER,
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
    }) as const,
  
  upcoming: (user: User) =>
    ({
      todos: {
        $: {
          where: {
            "user.id": user.id,
            completed: false,
          },
          order: {
            position: ORDER,
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
    }) as const,
  
  all: (user: User) =>
    ({
      todos: {
        $: {
          where: {
            "user.id": user.id,
          },
          order: {
            position: ORDER,
          },
        },
      },
    }) as const,
};

// Filter functions for different views
export function filterTodayItems(data: { todos: Todo[], templates: Template[] }) {
  const today = new Date();
  const todayString = format(today, "yyyy-MM-dd");
  
  // Get todos for today or overdue
  const todos = data.todos.filter(todo => todo.date <= todayString);
  
  // Get template IDs that already have todos for today
  const templateIdsWithTodos = new Set(
    todos
      .filter(todo => todo.date === todayString && (todo as any).template)
      .map(todo => (todo as any).template?.id)
      .filter(Boolean)
  );
  
  // Filter templates that should appear today
  const templates = data.templates.filter(template => {
    // Skip if already has todo for today
    if (templateIdsWithTodos.has(template.id)) return false;
    
    // Check if template should show today based on repeat pattern
    return shouldShowTemplateToday(template, today);
  });
  
  return { todos, templates };
}

export function filterUpcomingItems(data: { todos: Todo[], templates: Template[] }) {
  const todayString = format(new Date(), "yyyy-MM-dd");
  
  // Group by date for upcoming view
  const todosByDate = _.groupBy(
    data.todos.filter(todo => todo.date > todayString),
    'date'
  );
  
  // For each date, check which templates should appear
  const templatesByDate: Record<string, Template[]> = {};
  Object.keys(todosByDate).forEach(date => {
    const todoTemplateIds = new Set(
      todosByDate[date]
        .map(todo => (todo as any).template?.id)
        .filter(Boolean)
    );
    
    templatesByDate[date] = data.templates.filter(template => {
      if (todoTemplateIds.has(template.id)) return false;
      // TODO: Add repeat calculation for specific date
      return !!template.repeat;
    });
  });
  
  return { todosByDate, templatesByDate };
}
