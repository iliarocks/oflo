import { Todo, Template } from "@/utilities/items";
import { createContext, useState, PropsWithChildren } from "react";
import { Repeat } from "@/entities/Repeat";
import { parse } from "date-fns";

type FormState = {
  // data
  label: string;
  date: Date | null;
  time: string | null;
  repeat: Repeat | null;
  editingTodo: Todo | null;
  editingTemplate: Template | null;

  // actions
  setLabel: (label: string) => void;
  setDate: (date: Date | null) => void;
  setTime: (time: string | null) => void;
  setRepeat: (repeat: Repeat | null) => void;

  // initialization
  initTodoEdit: (todo: Todo) => void;
  initTemplateEdit: (template: Template) => void;
  reset: () => void;
};

export const FormContext = createContext<FormState>({
  // data
  label: "",
  date: null,
  time: null,
  repeat: null,
  editingTodo: null,
  editingTemplate: null,

  // actions
  setLabel: () => {},
  setDate: () => {},
  setTime: () => {},
  setRepeat: () => {},

  // initialization
  initTodoEdit: () => {},
  initTemplateEdit: () => {},
  reset: () => {},
});

export function FormProvider({ children }: PropsWithChildren) {
  const [label, setLabel] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [repeat, setRepeat] = useState<Repeat | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const initTodoEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setEditingTemplate(null);
    setLabel(todo.label);
    setDate(todo.date ? parse(todo.date, "yyyy-MM-dd", new Date()) : null);
    setTime(todo.time ?? null);
    setRepeat(null);
  };

  const initTemplateEdit = (template: Template) => {
    setEditingTemplate(template);
    setEditingTodo(null);
    setLabel(template.label);
    setDate(template.date ? parse(template.date, "yyyy-MM-dd", new Date()) : null);
    setTime(template.time ?? null);
    setRepeat(template.repeat ?? null);
  };

  const reset = () => {
    setLabel("");
    setDate(null);
    setTime(null);
    setRepeat(null);
    setEditingTodo(null);
    setEditingTemplate(null);
  };

  return (
    <FormContext.Provider
      value={{
        label,
        date,
        time,
        repeat,
        editingTodo,
        editingTemplate,
        setLabel,
        setDate,
        setTime,
        setRepeat,
        initTodoEdit,
        initTemplateEdit,
        reset,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}
