import { createContext, PropsWithChildren, useContext, useState } from "react";
import type { Repeat } from "@/utilities/repeat";
import { format } from "date-fns";
import { db, id } from "@/utilities/instant";
import { AuthContext } from "./AuthContext";
import _ from "lodash";

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
  const { user } = useContext(AuthContext);

  const push = async () => {
    if (!user) return;

    const { data } = await db.queryOnce({
      todos: { $: { where: { "user.id": user.id } } },
    });

    const firstItem =
      _.orderBy(data.todos, ["position"], ["asc"])[0]?.position ?? null;

    if (repeat) {
      const template = {
        label,
        repeat,
        date: date ? format(date, "yyyy-MM-dd") : null,
      };

      await db.transact(
        db.tx.templates[id()].create(template).link({ user: user.id }),
      );
    } else {
      const todo = {
        label,
        date: date ? format(date, "yyyy-MM-dd") : null,
        complete: false,
        position: "a",
      };

      await db.transact(db.tx.todos[id()].create(todo).link({ user: user.id }));
    }
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
