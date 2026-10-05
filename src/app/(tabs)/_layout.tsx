import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0084ff",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#f1f5f9",
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Đoạn chat",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="chat-bubble" size={size} color={color} />
          ),
          tabBarBadge: 3,
          tabBarBadgeStyle: {
            backgroundColor: "#0084ff",
            fontSize: 10,
          },
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Bạn bè",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Cá nhân",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
