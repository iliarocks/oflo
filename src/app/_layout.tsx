import "@/assets/global.css";
import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const options = { animation: "none" } as const;

  return (
    <AuthProvider>
      <GestureHandlerRootView>
        <SafeAreaView className="flex-1 bg-neutral-50">
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={options} />
            <Stack.Screen name="(app)" options={options} />
          </Stack>
        </SafeAreaView>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
