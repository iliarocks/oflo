import { createContext, PropsWithChildren, useState } from "react";
import { Repeat } from "@/entities/Repeat";

type TodoState = {
  label: string;
  date: Date | null;
  repeat: Repeat | null;
  setLabel: (label: string) => void;
  setDate: (date: Date | null) => void;
  setRepeat: (repeat: Repeat | null) => void;
  resetTodo: () => void;
};

export const TodoContext = createContext<TodoState>({
  label: "",
  date: null,
  repeat: null,
  setLabel: (label: string) => null,
  setDate: (date: Date | null) => null,
  setRepeat: (repeat: Repeat | null) => null,
  resetTodo: () => null,
});

export function TodoProvider({ children }: PropsWithChildren) {
  const [label, setLabel] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [repeat, setRepeat] = useState<Repeat | null>(null);

  const resetTodo = () => {
    setLabel("");
    setDate(null);
    setRepeat(null);
  };

  return (
    <TodoContext.Provider
      value={{
        label,
        date,
        repeat,
        setLabel,
        setDate,
        setRepeat,
        resetTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}
