import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { Avatar, StatusChat } from "@/components/common";

export interface ChatProfileBarProps {
  name: string;
  avatar?: string | null;
  isOnline?: boolean;
  isVerified?: boolean;
  onBack?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onInfo?: () => void;
}

export function ChatProfileBar({
  name,
  avatar,
  isOnline = true,
  isVerified = true,
  onBack,
  onCall,
  onVideoCall,
  onInfo,
}: ChatProfileBarProps) {
  return (
    <View className="shadow-xs mb-2 flex-row items-center justify-between border-b border-slate-100 bg-white px-3 py-2.5">
      {/* Thông tin đối phương */}
      <View className="min-w-0 flex-1 flex-row items-center gap-2.5">
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            accessibilityLabel="Quay lại"
            className="h-9 w-9 items-center justify-center rounded-full active:bg-slate-100"
          >
            <MaterialIcons name="arrow-back-ios-new" size={18} color="#1e293b" />
          </TouchableOpacity>
        )}

        <View className="relative h-12 w-12 shrink-0">
          <Avatar uri={avatar} size={48} isOnline={false} />
          {/* StatusChat ở góc Avatar */}
          <StatusChat status={isOnline ? "online" : "offline"} size={13} />
        </View>

        <View className="min-w-0 flex-1 justify-center">
          <View className="flex-row items-center gap-1">
            <Text
              numberOfLines={1}
              className="text-[17px] font-bold text-slate-900"
            >
              {name}
            </Text>
            {/* {isVerified && (
              <MaterialIcons name="verified" size={16} color="#0084ff" />
            )} */}
          </View>

          <View className="mt-0.5 flex-row items-center gap-1.5">
            {/* <View
              className={`h-2 w-2 rounded-full ${
                isOnline ? "bg-emerald-500" : "bg-slate-400"
              }`}
            /> */}
            <Text
              className={`text-[12px] font-medium ${
                isOnline ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              {isOnline ? "Đang hoạt động" : "Không hoạt động"}
            </Text>
          </View>
        </View>
      </View>

      {/* Các nút hành động phụ: Call, Video, Info */}
      <View className="flex-row items-center gap-1.5">
        <TouchableOpacity
          onPress={onCall}
          activeOpacity={0.7}
          accessibilityLabel="Gọi thoại"
          className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 active:scale-95"
        >
          <MaterialIcons name="call" size={20} color="#0084ff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onVideoCall}
          activeOpacity={0.7}
          accessibilityLabel="Gọi video"
          className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 active:scale-95"
        >
          <MaterialIcons name="videocam" size={20} color="#0084ff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onInfo}
          activeOpacity={0.7}
          accessibilityLabel="Thông tin hội thoại"
          className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 active:scale-95"
        >
          <MaterialIcons name="info-outline" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
