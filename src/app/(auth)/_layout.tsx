import { AuthContext } from "@/context/AuthContext";
import { Stack, Redirect } from "expo-router";
import { useContext } from "react";

export default function AuthLayout() {
  const { user } = useContext(AuthContext);

  if (user === undefined) return null;

  if (user) return <Redirect href="/" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="email-step" />
      <Stack.Screen name="code-step" />
    </Stack>
  );
}
