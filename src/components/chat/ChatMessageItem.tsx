import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { DefaultAvatar } from "@/components/common";
import type { Attachment } from "@/types/api";
import { ChatAttachments } from "./ChatAttachments";
import { DirectMessageItemData } from "./types";

export interface ChatMessageItemProps {
  message: DirectMessageItemData;
  onMediaPress?: (mediaUrl: string) => void;
  onReactionPress?: (emoji: string) => void;
  onImagePress?: (image: Attachment, images: Attachment[]) => void;
}

export function ChatMessageItem({
  message,
  onMediaPress,
  onReactionPress,
  onImagePress,
}: ChatMessageItemProps) {
  const {
    text,
    time,
    isMe,
    avatar,
    mediaUrl,
    attachments,
    locationName,
    reactions,
    isSent,
    seenAvatar,
    seenTime,
  } = message;
  // Chuỗi rỗng = đã xem nhưng người đó không có ảnh đại diện
  const isSeen = seenAvatar != null;

  if (isMe) {
    // Tin nhắn của tôi (Gửi đi - Nằm bên phải)
    return (
      <View className="mb-3 max-w-[82%] self-end items-end">
        {/* Ảnh / file đính kèm */}
        {attachments && attachments.length > 0 && (
          <View className={text ? "mb-1" : undefined}>
            <ChatAttachments attachments={attachments} isMe onImagePress={onImagePress} />
          </View>
        )}

        {/* Bong bóng tin nhắn gửi đi */}
        {text && (
          <View className="rounded-[18px] rounded-br-xs bg-primary px-4 py-2.5 shadow-xs">
            <Text className="text-[15px] font-normal leading-5 text-white">
              {text}
            </Text>
          </View>
        )}

        {/* Trạng thái tin nhắn gửi đi: Thời gian & Icon đã gửi / Avatar đã xem */}
        <View className="mt-1 flex-row items-center gap-1.5 px-1">
          <Text className="text-[11px] text-slate-400">
            {time}
            {isSent && !isSeen && " • Đã gửi"}
          </Text>

          {isSeen ? (
            // Badge avatar nhỏ xíu của đối phương khi đã xem
            <View
              className="h-4 w-4 overflow-hidden rounded-full border border-white shadow-xs"
              accessibilityLabel={`Đã xem lúc ${seenTime || time}`}
            >
              {seenAvatar ? (
                <Image
                  source={{ uri: seenAvatar }}
                  style={{ width: 16, height: 16, borderRadius: 8 }}
                  contentFit="cover"
                />
              ) : (
                <DefaultAvatar size={16} />
              )}
            </View>
          ) : isSent ? (
            <MaterialIcons name="check-circle" size={13} color="#0084ff" />
          ) : null}
        </View>
      </View>
    );
  }

  // Tin nhắn của đối phương (Nhận - Nằm bên trái)
  return (
    <View className="mb-3 max-w-[84%] flex-row items-end gap-2">
      {/* Avatar nhỏ của người gửi */}
      <View className="mb-0.5 h-7 w-7 shrink-0 overflow-hidden rounded-full">
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={{ width: 28, height: 28, borderRadius: 14 }}
            contentFit="cover"
          />
        ) : (
          <DefaultAvatar size={28} />
        )}
      </View>

      <View className="min-w-0 flex-1 items-start gap-1">
        {/* Đính kèm ảnh / Media nếu có */}
        {mediaUrl && (
          <TouchableOpacity
            onPress={() => onMediaPress?.(mediaUrl)}
            activeOpacity={0.9}
            className="w-full max-w-[260px] overflow-hidden rounded-[20px] rounded-bl-xs bg-slate-100 shadow-xs"
          >
            <View className="relative h-44 w-full">
              <Image
                source={{ uri: mediaUrl }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />

              {/* Gradient & Thông tin địa điểm / HD Badge */}
              <View className="absolute bottom-2 left-3 right-3 flex-row items-center justify-between">
                {locationName && (
                  <View className="flex-row items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur-xs">
                    <MaterialIcons name="location-on" size={13} color="#ffffff" />
                    <Text className="text-[11px] font-medium text-white">
                      {locationName}
                    </Text>
                  </View>
                )}
                <View className="rounded-full bg-black/50 px-2 py-0.5">
                  <Text className="text-[10px] font-bold text-white">HD</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Ảnh / file đính kèm */}
        {attachments && attachments.length > 0 && (
          <ChatAttachments
            attachments={attachments}
            isMe={false}
            onImagePress={onImagePress}
          />
        )}

        {/* Nội dung tin nhắn văn bản */}
        {text && (
          <View className="rounded-[18px] rounded-bl-xs bg-slate-100 px-4 py-2.5 shadow-xs">
            <Text className="text-[15px] font-normal leading-5 text-slate-900">
              {text}
            </Text>
          </View>
        )}

        {/* Thanh Reaction nhanh (nếu có biểu cảm) */}
        {reactions && reactions.length > 0 && (
          <View className="-mt-2 ml-2 flex-row items-center gap-1 rounded-full border border-slate-100 bg-white px-2 py-0.5 shadow-sm">
            {reactions.map((r, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => onReactionPress?.(r.emoji)}
                activeOpacity={0.7}
              >
                <Text className="text-[13px]">{r.emoji}</Text>
              </TouchableOpacity>
            ))}
            {reactions[0]?.count && reactions[0].count > 1 && (
              <Text className="text-[11px] font-semibold text-slate-500">
                {reactions.reduce((sum, item) => sum + (item.count || 1), 0)}
              </Text>
            )}
          </View>
        )}

        {/* Thời gian nhận */}
        <Text className="mt-0.5 px-1 text-[11px] text-slate-400">{time}</Text>
      </View>
    </View>
  );
}
