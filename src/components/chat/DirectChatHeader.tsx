import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { DefaultAvatar } from "@/components/common";

export interface DirectChatHeaderProps {
  title?: string;
  myAvatarUrl?: string | null;
  onBack: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onProfilePress?: () => void;
}

export function DirectChatHeader({
  title = "Direct Chat",
  myAvatarUrl,
  onBack,
  onCall,
  onVideoCall,
  onProfilePress,
}: DirectChatHeaderProps) {
  return (
    <View className="z-50 w-full border-b border-slate-100 bg-white/95 px-2 py-1 shadow-sm">
      <View className="h-14 flex-row items-center justify-between px-1">
        {/* Nhóm bên trái: Nút quay lại & Tiêu đề */}
        <View className="flex-row items-center gap-1.5">
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            accessibilityLabel="Quay lại"
            className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100"
          >
            <MaterialIcons name="arrow-back-ios" size={20} color="#1e293b" />
          </TouchableOpacity>

          <Text
            numberOfLines={1}
            className="max-w-[190px] text-[18px] font-bold tracking-tight text-slate-900"
          >
            {title}
          </Text>
        </View>

        {/* Nhóm bên phải: Nút Gọi thoại, Gọi video, Avatar cá nhân */}
        <View className="flex-row items-center gap-1">
          <TouchableOpacity
            onPress={onCall}
            activeOpacity={0.7}
            accessibilityLabel="Gọi thoại"
            className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100"
          >
            <MaterialIcons name="call" size={22} color="#0084ff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onVideoCall}
            activeOpacity={0.7}
            accessibilityLabel="Gọi video"
            className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100"
          >
            <MaterialIcons name="videocam" size={24} color="#0084ff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onProfilePress}
            activeOpacity={0.8}
            className="ml-1 h-9 w-9 items-center justify-center"
          >
            {myAvatarUrl ? (
              <Image
                source={{ uri: myAvatarUrl }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
                contentFit="cover"
              />
            ) : (
              <DefaultAvatar size={32} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
