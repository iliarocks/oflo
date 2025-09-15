// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react-native";

const rules = {
  todos: {
    bind: ["isOwner", "auth.id != null && auth.id in data.ref('user.id')"],
    allow: {
      view: "isOwner",
      create: "isOwner",
      delete: "isOwner",
      update: "isOwner",
    },
  },
} satisfies InstantRules;

export default rules;
