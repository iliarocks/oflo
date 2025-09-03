import "@/assets/global.css";
import View from "@/components/View";
import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const options = { animation: "none" } as const;

  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'white' }}>
        <View className="bg-neutral-0" grow safe>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={options} />
            <Stack.Screen name="(app)" options={options} />
          </Stack>
        </View>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
