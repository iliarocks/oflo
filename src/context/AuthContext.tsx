import { db } from "@/utilities/database";
import { User } from "@instantdb/react-native";
import { createContext, PropsWithChildren, useState } from "react";

type AuthState = {
  user: User | null | undefined;
  email: string;
  code: string;
  setEmail: (email: string) => void;
  setCode: (code: string) => void;
  sendCode: () => void;
  signIn: () => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthState>({
  user: undefined,
  email: "",
  code: "",
  setEmail: (email: string) => null,
  setCode: (code: string) => null,
  sendCode: () => null,
  signIn: () => null,
  signOut: () => null,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const { user } = db.useAuth();
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const sendCode = async () => {
    try {
      await db.auth.sendMagicCode({ email });
    } catch (err: any) {
      alert("Uh oh: " + err.body?.message);
    }
  };

  const signIn = async () => {
    try {
      await db.auth.signInWithMagicCode({ email, code });
    } catch (err: any) {
      alert("Uh oh: " + err.body?.message);
    }
  };

  const signOut = () => {
    setEmail("");
    setCode("");
    db.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        email,
        code,
        setEmail,
        setCode,
        sendCode,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
