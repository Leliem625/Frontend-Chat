import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/context/auth";

// Điểm vào app: đã đăng nhập thì vào danh sách trò chuyện, chưa thì vào màn hình đăng nhập
export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <Redirect href={user ? "/(tabs)" : "/(auth)/login"} />;
}
