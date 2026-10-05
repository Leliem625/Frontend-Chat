import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

import { Avatar } from "./Avatar";
import { ConversationItemData } from "./types";

interface ConversationListItemProps {
  item: ConversationItemData;
  onPress: (id: string) => void;
}

export function ConversationListItem({
  item,
  onPress,
}: ConversationListItemProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
      className="flex-row items-center gap-3.5 px-4 py-3 active:bg-slate-100/70"
    >
      {/* Cột 1: Avatar hoặc Icon nhóm */}
      <View className="relative h-14 w-14 shrink-0">
        <Avatar
          uri={item.avatar}
          size={56}
          isOnline={item.isOnline}
          isGroup={item.isGroup}
        />

        {/* Badge nhóm nhỏ ở góc nếu là nhóm */}
        {item.isGroup && (
          <View className="absolute -bottom-0.5 -right-0.5 h-5 w-5 items-center justify-center rounded-full border border-white bg-slate-100 shadow-sm">
            <MaterialIcons name="group" size={12} color="#0084ff" />
          </View>
        )}
      </View>

      {/* Cột 2: Nội dung tin nhắn & tên */}
      <View className="min-w-0 flex-1 justify-center">
        {/* Hàng 1: Tên & Thời gian */}
        <View className="mb-0.5 flex-row items-center justify-between">
          <Text
            numberOfLines={1}
            className={`truncate text-[16px] ${
              item.isUnread
                ? "font-bold text-slate-900"
                : "font-semibold text-slate-900"
            }`}
          >
            {item.name}
          </Text>
          <Text
            className={`shrink-0 text-[12px] ${
              item.isUnread ? "font-semibold text-primary" : "text-slate-400"
            }`}
          >
            {item.time}
          </Text>
        </View>

        {/* Hàng 2: Trích đoạn tin nhắn & Icon trạng thái */}
        <View className="flex-row items-center justify-between gap-2">
          <View className="min-w-0 flex-1 flex-row items-center gap-1.5">
            {/* Icon ảnh đính kèm nếu có */}
            {item.hasAttachment && (
              <MaterialIcons name="image" size={16} color="#0084ff" />
            )}

            {/* Icon cuộc gọi nhỡ nếu có */}
            {item.isMissedCall && (
              <MaterialIcons name="phone-missed" size={16} color="#ef4444" />
            )}

            <Text
              numberOfLines={1}
              className={`truncate text-[14px] ${
                item.isMissedCall
                  ? "font-medium text-red-500"
                  : item.isUnread
                    ? "font-semibold text-slate-900"
                    : "text-slate-500"
              }`}
            >
              {item.senderPrefix && (
                <Text
                  className={
                    item.isUnread
                      ? "font-normal text-slate-600"
                      : "font-medium text-slate-700"
                  }
                >
                  {item.senderPrefix}{" "}
                </Text>
              )}
              {item.lastMessage}
            </Text>
          </View>

          {/* Phía bên phải: Badge số lượng tin chưa đọc / Thumbnail / Tick đã xem */}
          {item.unreadCount ? (
            <View className="h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 shadow-sm">
              <Text className="text-[11px] font-bold text-white">
                {item.unreadCount}
              </Text>
            </View>
          ) : item.hasUnreadDot ? (
            <View className="h-2.5 w-2.5 rounded-full bg-primary" />
          ) : item.attachmentThumbnail ? (
            <Image
              source={{ uri: item.attachmentThumbnail }}
              style={{ width: 16, height: 16, borderRadius: 8 }}
              contentFit="cover"
            />
          ) : item.isRead ? (
            <MaterialIcons name="done-all" size={17} color="#0084ff" />
          ) : item.isSent ? (
            <MaterialIcons name="done" size={16} color="#94a3b8" />
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}
