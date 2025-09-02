import { i } from "@instantdb/react-native";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    todos: i.entity({
      label: i.string().indexed(),
      date: i.any().optional().indexed(),
      time: i.any().optional().indexed(),
      completed: i.boolean(),
      position: i.string(),
    }),
    templates: i.entity({
      label: i.string().indexed(),
      date: i.any().optional().indexed(),
      time: i.any().optional(),
      repeat: i.json().optional(),
    }),
  },
  links: {
    userTodos: {
      forward: { on: "todos", has: "one", label: "user", required: true },
      reverse: { on: "$users", has: "many", label: "todos" },
    },
    todoTemplate: {
      forward: { on: "todos", has: "one", label: "template" },
      reverse: { on: "templates", has: "many", label: "todo" },
    },
    userTemplates: {
      forward: { on: "templates", has: "one", label: "user", required: true },
      reverse: { on: "$users", has: "many", label: "templates" },
    },
  },
});

type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
