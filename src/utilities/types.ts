import { InstaQLEntity } from "@instantdb/react-native";
import { AppSchema } from "@/instant.schema";

export type Option = {
  key: string;
  value: any;
};

export type RepeatType = "todo" | "calendar";

export type RepeatUnit = "day" | "week" | "month" | "year";

export type RepeatData = {
  type: RepeatType;
  frequency: {
    unit: RepeatUnit;
    multiple: number;
    on?: number[];
  };
  reference: Date | null;
};

export type TemplateType = InstaQLEntity<AppSchema, "templates">;
export type TodoType = InstaQLEntity<AppSchema, "todos">;
