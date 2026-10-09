import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Avatar } from "@/components/common";

export interface ChatEmptyConversationProps {
  name: string;
  avatar?: string | null;
  isFriend: boolean;
  onAddFriend?: () => void;
  onWave?: () => void;
  isFriendRequested?: boolean;
}

export function ChatEmptyConversation({
  name,
  avatar,
  isFriend,
  onAddFriend,
  onWave,
  isFriendRequested = false,
}: ChatEmptyConversationProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-12">
      {/* Avatar lớn ở giữa */}
      <View className="relative items-center justify-center">
        <View className="rounded-full border border-slate-100 bg-white p-1 shadow-sm">
          <Avatar uri={avatar} size={92} />
        </View>
      </View>

      {/* Tên bạn bè */}
      <Text
        numberOfLines={2}
        className="mt-4 text-center text-[22px] font-bold text-slate-900"
      >
        {name}
      </Text>

      {/* Dòng trạng thái quan hệ bạn bè trên Chat App */}
      <Text className="mt-1.5 text-center text-[14px] font-medium text-slate-500">
        {isFriend
          ? "Các bạn đã là bạn bè trên Chat App"
          : "Các bạn chưa là bạn bè trên Chat App"}
      </Text>

      {/* Dòng gợi ý phụ */}
      <Text className="mt-1 text-center text-[13px] text-slate-400">
        {isFriend
          ? "Hãy gửi lời chào để bắt đầu cuộc trò chuyện! 👋"
          : "Hãy kết nối để trò chuyện và chia sẻ cùng nhau"}
      </Text>

      {/* Nút tương tác nhanh */}
      {isFriend ? (
        onWave && (
          <TouchableOpacity
            onPress={onWave}
            activeOpacity={0.8}
            className="mt-5 flex-row items-center gap-2 rounded-full bg-slate-100 px-5 py-2.5 active:bg-slate-200"
          >
            <Text className="text-[18px]">👋</Text>
            <Text className="text-[14px] font-semibold text-slate-700">
              Vẫy tay chào {name}
            </Text>
          </TouchableOpacity>
        )
      ) : isFriendRequested ? (
        <View className="mt-5 flex-row items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2">
          <MaterialIcons name="done" size={16} color="#0084ff" />
          <Text className="text-[13px] font-medium text-primary">
            Đã gửi lời mời kết bạn
          </Text>
        </View>
      ) : (
        onAddFriend && (
          <TouchableOpacity
            onPress={onAddFriend}
            activeOpacity={0.8}
            className="mt-5 flex-row items-center gap-2 rounded-full bg-primary px-5 py-2.5 shadow-sm active:bg-primary/90"
          >
            <MaterialIcons name="person-add" size={18} color="#ffffff" />
            <Text className="text-[14px] font-semibold text-white">
              Kết bạn trên Chat App
            </Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
}
