import { IconButton } from "@/components/Buttons";
import View from "@/components/View";
import { AuthContext } from "@/context/AuthContext";
import { TodoProvider } from "@/context/TodoContext";
import { Redirect, Stack, useRouter } from "expo-router";
import { useContext } from "react";
import { View as RNView, Text } from "react-native";

export default function ProtectedLayout() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  console.log("ProtectedLayout - user:", user);

  // Handle loading state when user is undefined
  if (user === undefined) {
    console.log("ProtectedLayout - user is undefined, showing loading");
    return (
      <RNView style={{ flex: 1, backgroundColor: '#353839', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Loading...</Text>
      </RNView>
    );
  }
  
  // Redirect to auth if not logged in
  if (!user) {
    console.log("ProtectedLayout - no user, redirecting to auth");
    return <Redirect href="/email-step" />;
  }

  console.log("ProtectedLayout - showing app screens");

  return (
    <TodoProvider>
      <View className="bg-neutral-0" grow>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="inbox" />
          <Stack.Screen name="today" />
          <Stack.Screen name="settings" options={{ presentation: "modal" }} />
          <Stack.Screen name="create" options={{ presentation: "modal" }} />
          <Stack.Screen name="time-options" options={{ presentation: "containedModal" }} />
          <Stack.Screen name="repeat-options" options={{ presentation: "containedModal" }} />
        </Stack>
        <View className="absolute bottom-0 right-xl">
          <IconButton icon="add" onPress={() => router.navigate("/create")} />
        </View>
      </View>
    </TodoProvider>
  );
}
