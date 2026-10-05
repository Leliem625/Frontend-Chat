import "../../global.css";

import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

import { AuthProvider } from "@/context/auth";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </AuthProvider>
  );
}
