import { i } from "@instantdb/react-native";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    templates: i.entity({
      date: i.string().indexed().optional(),
      label: i.string().indexed(),
      repeat: i.json().indexed(),
    }),
    todos: i.entity({
      complete: i.boolean(),
      date: i.string().indexed().optional(),
      label: i.string().indexed(),
      position: i.string().indexed().unique(),
    }),
  },
  links: {
    templatesUser: {
      forward: {
        on: "templates",
        has: "one",
        label: "user",
        required: true,
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "templates",
      },
    },
    todosTemplate: {
      forward: {
        on: "todos",
        has: "one",
        label: "template",
      },
      reverse: {
        on: "templates",
        has: "many",
        label: "todos",
      },
    },
    todosUser: {
      forward: {
        on: "todos",
        has: "one",
        label: "user",
        required: true,
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "todos",
      },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
