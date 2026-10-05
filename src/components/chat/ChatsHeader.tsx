import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

import { DefaultAvatar } from "./DefaultAvatar";

const APP_LOGO = require("../../../assets/images/messenger_app_icon.png");

interface ChatsHeaderProps {
  avatarUrl?: string;
  onCameraPress?: () => void;
  onNewChatPress?: () => void;
  onProfilePress?: () => void;
}

export function ChatsHeader({
  avatarUrl,
  onCameraPress,
  onNewChatPress,
  onProfilePress,
}: ChatsHeaderProps) {
  return (
    <View className="h-16 flex-row items-center justify-between px-4">
      {/* Logo & Tiêu đề */}
      <View className="flex-row items-center gap-2.5">
        <Image
          source={APP_LOGO}
          style={{ width: 34, height: 34 }}
          contentFit="contain"
        />
        <Text className="text-[20px] font-bold tracking-tight text-slate-900">
          Đoạn chat
        </Text>
      </View>

      {/* Cụm action bên phải */}
      <View className="flex-row items-center gap-1.5">
        <TouchableOpacity
          onPress={onCameraPress}
          activeOpacity={0.7}
          className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
        >
          <MaterialIcons name="photo-camera" size={21} color="#475569" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNewChatPress}
          activeOpacity={0.7}
          className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
        >
          <MaterialIcons name="edit" size={20} color="#475569" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onProfilePress}
          activeOpacity={0.7}
          className="ml-1"
        >
          <View className="h-9 w-9 overflow-hidden rounded-full border-2 border-primary/20">
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : (
              <DefaultAvatar size={34} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
