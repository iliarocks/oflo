import { AuthContext } from "@/context/AuthContext";
import { Stack, Redirect } from "expo-router";
import { useContext } from "react";
import { View, Text } from "react-native";

export default function AuthLayout() {
  const { user } = useContext(AuthContext);
  console.log("AuthLayout - user:", user);

  // Handle loading state when user is undefined
  if (user === undefined) {
    console.log("AuthLayout - user is undefined, showing loading");
    return (
      <View style={{ flex: 1, backgroundColor: '#353839', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Loading...</Text>
      </View>
    );
  }
  
  // Redirect to app if logged in
  if (user) {
    console.log("AuthLayout - user exists, redirecting to app");
    return <Redirect href="/" />;
  }

  console.log("AuthLayout - showing auth screens");

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="email-step" />
      <Stack.Screen name="code-step" />
    </Stack>
  );
}
