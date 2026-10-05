import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar } from "@/components/chat";

// Mock tin nhắn mẫu minh họa
interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
  isMe: boolean;
}

export default function ChatDetailScreen() {
  const router = useRouter();
  const { id, name, avatar } = useLocalSearchParams<{
    id: string;
    name?: string;
    avatar?: string;
  }>();

  // Thông tin bạn bè trong cuộc trò chuyện (sẽ nạp từ API qua id)
  const friendName = name || "Bạn bè";
  const friendAvatar = avatar || null; // Nếu null -> tự động dùng DefaultAvatar
  const isOnline = true;

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      senderId: "friend",
      text: "Chào bạn! Chiều nay có rảnh không?",
      time: "10:30",
      isMe: false,
    },
    {
      id: "2",
      senderId: "me",
      text: "Mình có rảnh, có chuyện gì thế bạn?",
      time: "10:31",
      isMe: true,
    },
    {
      id: "3",
      senderId: "friend",
      text: "Gặp nhau ở quán cà phê cũ nhé! ☕",
      time: "10:32",
      isMe: false,
    },
  ]);

  // TODO: Các hàm xử lý hành động (User tự viết thêm logic gọi API / Socket)
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleCall = () => {
    console.log("Bắt đầu gọi thoại với:", friendName);
  };

  const handleVideoCall = () => {
    console.log("Bắt đầu gọi video với:", friendName);
  };

  const handleInfo = () => {
    console.log("Xem thông tin cuộc trò chuyện #", id);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // TODO: Gửi tin nhắn qua API hoặc Socket.io
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: "me",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      {/* 1. Header cuộc trò chuyện */}
      <View className="h-16 flex-row items-center justify-between border-b border-slate-100 bg-white px-3 shadow-sm">
        {/* Nút Back + Avatar + Tên */}
        <View className="flex-1 flex-row items-center gap-2">
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            className="p-1"
          >
            <MaterialIcons name="arrow-back" size={24} color="#0084ff" />
          </TouchableOpacity>

          {/* Avatar bạn bè: nếu không có avatar sẽ tự động hiện avatar mặc định Facebook */}
          <Avatar uri={friendAvatar} size={40} isOnline={isOnline} />

          <View className="ml-1 min-w-0 flex-1">
            <Text
              numberOfLines={1}
              className="text-[16px] font-bold text-slate-900"
            >
              {friendName}
            </Text>
            <Text className="text-[12px] font-medium text-emerald-600">
              {isOnline ? "Đang hoạt động" : "Hoạt động gần đây"}
            </Text>
          </View>
        </View>

        {/* Các nút hành động bên phải: Gọi thoại, Gọi video, Thông tin */}
        <View className="flex-row items-center gap-1">
          <TouchableOpacity
            onPress={handleCall}
            activeOpacity={0.7}
            className="h-10 w-10 items-center justify-center rounded-full"
          >
            <MaterialIcons name="call" size={22} color="#0084ff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleVideoCall}
            activeOpacity={0.7}
            className="h-10 w-10 items-center justify-center rounded-full"
          >
            <MaterialIcons name="videocam" size={24} color="#0084ff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleInfo}
            activeOpacity={0.7}
            className="h-10 w-10 items-center justify-center rounded-full"
          >
            <MaterialIcons name="info-outline" size={22} color="#0084ff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Danh sách tin nhắn */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
        >
          {/* Card giới thiệu đầu cuộc trò chuyện (Phong cách Messenger) */}
          <View className="my-6 items-center">
            {/* Avatar lớn ở đầu đoạn chat */}
            <Avatar uri={friendAvatar} size={80} />
            <Text className="mt-3 text-[19px] font-bold text-slate-900">
              {friendName}
            </Text>
            <Text className="mt-0.5 text-[13px] text-slate-500">
              Các bạn đã kết nối trên Messenger
            </Text>
            <Text className="mt-1 text-[12px] text-slate-400">
              Hãy gửi lời chào để bắt đầu cuộc trò chuyện!
            </Text>
          </View>

          {/* Dải phân cách ngày */}
          <View className="my-4 items-center">
            <Text className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-400">
              HÔM NAY
            </Text>
          </View>

          {/* Danh sách các tin nhắn */}
          <View className="flex-col gap-2">
            {messages.map((msg) => {
              if (msg.isMe) {
                // Tin nhắn do mình gửi (nằm bên phải)
                return (
                  <View key={msg.id} className="flex-row justify-end">
                    <View className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 shadow-sm">
                      <Text className="text-[15px] leading-5 text-white">
                        {msg.text}
                      </Text>
                      <Text className="mt-0.5 text-right text-[10px] text-white/70">
                        {msg.time}
                      </Text>
                    </View>
                  </View>
                );
              }

              // Tin nhắn do bạn bè gửi (nằm bên trái, có kèm Avatar)
              return (
                <View
                  key={msg.id}
                  className="flex-row items-end justify-start gap-2"
                >
                  {/* Avatar bạn bè cạnh tin nhắn */}
                  <Avatar uri={friendAvatar} size={28} />

                  <View className="max-w-[75%] rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-2.5">
                    <Text className="text-[15px] leading-5 text-slate-900">
                      {msg.text}
                    </Text>
                    <Text className="mt-0.5 text-[10px] text-slate-400">
                      {msg.time}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* 3. Khung nhập tin nhắn ở dưới cùng */}
        <View className="flex-row items-center gap-2 border-t border-slate-100 bg-white px-3 py-2">
          {/* Cụm nút gửi file / ảnh / mic */}
          <TouchableOpacity activeOpacity={0.7} className="p-1.5">
            <MaterialIcons name="add-circle" size={24} color="#0084ff" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} className="p-1.5">
            <MaterialIcons name="photo-camera" size={22} color="#0084ff" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} className="p-1.5">
            <MaterialIcons name="image" size={22} color="#0084ff" />
          </TouchableOpacity>

          {/* Ô nhập tin nhắn */}
          <View className="h-10 flex-1 flex-row items-center rounded-full bg-slate-100 px-3.5">
            <TextInput
              className="h-full flex-1 text-[15px] text-slate-900"
              placeholder="Nhắn tin..."
              placeholderTextColor="#94a3b8"
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity activeOpacity={0.7} className="p-1">
              <MaterialIcons
                name="sentiment-satisfied"
                size={20}
                color="#0084ff"
              />
            </TouchableOpacity>
          </View>

          {/* Nút Gửi hoặc Nút Thích (Like Thumbs-up phong cách Messenger) */}
          {inputText.trim().length > 0 ? (
            <TouchableOpacity
              onPress={handleSendMessage}
              activeOpacity={0.7}
              className="p-1.5"
            >
              <MaterialIcons name="send" size={24} color="#0084ff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity activeOpacity={0.7} className="p-1.5">
              <MaterialIcons name="thumb-up" size={22} color="#0084ff" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
