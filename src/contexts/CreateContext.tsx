import { createContext, PropsWithChildren, useState } from "react";
import Repeat from "@/entities/Repeat";

type CreateState = {
  label: string;
  date: Date | null;
  repeat: Repeat | null;
  setLabel: (label: string) => void;
  setDate: (date: Date | null) => void;
  setRepeat: (repeat: Repeat | null) => void;
  push: () => void;
  reset: () => void;
};

export const CreateContext = createContext<CreateState>({
  label: "",
  date: null,
  repeat: null,
  setLabel: () => {},
  setDate: () => {},
  setRepeat: () => {},
  push: () => {},
  reset: () => {},
});

export function CreateProvider({ children }: PropsWithChildren) {
  const [label, setLabel] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [repeat, setRepeat] = useState<Repeat | null>(null);

  const push = () => {
    console.log("Label: ", label);
    console.log("Date: ", date);
    console.log("Repeat: ", repeat);
    reset();
  };

  const reset = () => {
    setLabel("");
    setDate(null);
    setRepeat(null);
  };

  return (
    <CreateContext.Provider
      value={{
        label,
        date,
        repeat,
        setLabel,
        setDate,
        setRepeat,
        push,
        reset,
      }}
    >
      {children}
    </CreateContext.Provider>
  );
}
