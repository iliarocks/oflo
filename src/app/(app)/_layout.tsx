import { IconButton } from "@/components/Buttons";
import View from "@/components/View";
import { AuthContext } from "@/context/AuthContext";
import { TodoProvider } from "@/context/TodoContext";
import { Redirect, Stack, useRouter } from "expo-router";
import { useContext } from "react";

export default function ProtectedLayout() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  if (!user) return <Redirect href="/email-step" />;

  return (
    <TodoProvider>
      <View className="bg-neural-0" grow>
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
