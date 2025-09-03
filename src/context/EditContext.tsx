import { createContext, PropsWithChildren, useState } from "react";
import { Repeat } from "@/entities/Repeat";
import { InstaQLEntity } from "@instantdb/react-native";
import { AppSchema } from "@/instant.schema";

type TodoType = InstaQLEntity<AppSchema, "todos">;
type TemplateType = InstaQLEntity<AppSchema, "templates">;

type EditState = {
  editingTodo: TodoType | null;
  editingTemplate: TemplateType | null;
  label: string;
  date: Date | null;
  time: string | null;
  repeat: Repeat | null;
  setEditingTodo: (todo: TodoType | null) => void;
  setEditingTemplate: (template: TemplateType | null) => void;
  setLabel: (label: string) => void;
  setDate: (date: Date | null) => void;
  setTime: (time: string | null) => void;
  setRepeat: (repeat: Repeat | null) => void;
  resetEdit: () => void;
  initializeFromTodo: (todo: TodoType) => void;
  initializeFromTemplate: (template: TemplateType) => void;
};

export const EditContext = createContext<EditState>({
  editingTodo: null,
  editingTemplate: null,
  label: "",
  date: null,
  time: null,
  repeat: null,
  setEditingTodo: () => null,
  setEditingTemplate: () => null,
  setLabel: () => null,
  setDate: () => null,
  setTime: () => null,
  setRepeat: () => null,
  resetEdit: () => null,
  initializeFromTodo: () => null,
  initializeFromTemplate: () => null,
});

export function EditProvider({ children }: PropsWithChildren) {
  const [editingTodo, setEditingTodo] = useState<TodoType | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<TemplateType | null>(null);
  const [label, setLabel] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [repeat, setRepeat] = useState<Repeat | null>(null);

  const resetEdit = () => {
    setEditingTodo(null);
    setEditingTemplate(null);
    setLabel("");
    setDate(null);
    setTime(null);
    setRepeat(null);
  };

  const initializeFromTodo = (todo: TodoType) => {
    setEditingTodo(todo);
    setEditingTemplate(null);
    setLabel(todo.label || "");
    // Parse date string as local date, not UTC
    if (todo.date) {
      const [year, month, day] = todo.date.split('-').map(Number);
      setDate(new Date(year, month - 1, day));
    } else {
      setDate(null);
    }
    setTime(todo.time || null);
    setRepeat(null);
  };

  const initializeFromTemplate = (template: TemplateType) => {
    setEditingTemplate(template);
    setEditingTodo(null);
    setLabel(template.label || "");
    // Parse date string as local date, not UTC
    if (template.date) {
      const [year, month, day] = template.date.split('-').map(Number);
      setDate(new Date(year, month - 1, day));
    } else {
      setDate(null);
    }
    setTime(template.time || null);
    if (template.repeat) {
      let referenceDate = null;
      if (template.repeat.reference) {
        const [year, month, day] = template.repeat.reference.split('-').map(Number);
        referenceDate = new Date(year, month - 1, day);
      }
      const r = new Repeat(template.repeat.type, referenceDate);
      Object.assign(r.frequency, template.repeat.frequency || {});
      setRepeat(r);
    } else {
      setRepeat(null);
    }
  };

  return (
    <EditContext.Provider
      value={{
        editingTodo,
        editingTemplate,
        label,
        date,
        time,
        repeat,
        setEditingTodo,
        setEditingTemplate,
        setLabel,
        setDate,
        setTime,
        setRepeat,
        resetEdit,
        initializeFromTodo,
        initializeFromTemplate,
      }}
    >
      {children}
    </EditContext.Provider>
  );
}