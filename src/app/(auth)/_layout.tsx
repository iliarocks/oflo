import { AuthContext } from "@/context/AuthContext";
import { Stack, Redirect } from "expo-router";
import { useContext } from "react";
import { View, Text } from "react-native";

export default function AuthLayout() {
  const { user } = useContext(AuthContext);

  // Handle loading state when user is undefined
  if (user === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: '#353839', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Loading...</Text>
      </View>
    );
  }
  
  // Redirect to app if logged in
  if (user) {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="email-step" />
      <Stack.Screen name="code-step" />
    </Stack>
  );
}
