import { IconButton } from "@/components/Buttons";
import { View } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { TodoProvider } from "@/context/TodoContext";
import { EditProvider } from "@/context/EditContext";
import { Redirect, Stack, useRouter } from "expo-router";
import { useContext } from "react";
import { View as RNView, Text } from "react-native";

export default function ProtectedLayout() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  if (user === undefined) return null;

  if (!user) return <Redirect href="/email-step" />;

  return (
    <TodoProvider>
      <EditProvider>
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
          <Stack.Screen name="upcoming" />
          <Stack.Screen name="settings" options={{ presentation: "modal" }} />
          <Stack.Screen name="create" options={{ presentation: "modal" }} />
          <Stack.Screen name="edit" options={{ presentation: "modal" }} />
          <Stack.Screen name="time-options" options={{ presentation: "containedModal" }} />
          <Stack.Screen name="repeat-options" options={{ presentation: "containedModal" }} />
        </Stack>
        <View className="absolute bottom-0 right-xl">
          <IconButton icon="add" onPress={() => router.navigate("/create")} />
        </View>
      </EditProvider>
    </TodoProvider>
  );
}
