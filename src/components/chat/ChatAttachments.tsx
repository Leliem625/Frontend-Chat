import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

import type { Attachment } from "@/types/api";
import { fileExtension, fileIconName, formatFileSize, openAttachmentFile } from "@/utils/file";

export interface ChatAttachmentsProps {
  attachments: Attachment[];
  isMe: boolean;
  onImagePress?: (image: Attachment, images: Attachment[]) => void;
}

// Hiển thị ảnh / file đính kèm của 1 tin nhắn giống Messenger:
// - Ảnh: hiện ngay trong khung chat, bấm vào xem toàn màn hình
// - File khác: hiện icon + tên + dung lượng, bấm vào để tải về / mở
export function ChatAttachments({ attachments, isMe, onImagePress }: ChatAttachmentsProps) {
  const images = attachments.filter((a) => a.resourceType === "image");
  const files = attachments.filter((a) => a.resourceType !== "image");

  return (
    <View className={`gap-1 ${isMe ? "items-end" : "items-start"}`}>
      {images.length > 0 && (
        <ImageGrid images={images} isMe={isMe} onImagePress={onImagePress} />
      )}
      {files.map((file) => (
        <FileBubble key={file.id} file={file} isMe={isMe} />
      ))}
    </View>
  );
}

function ImageGrid({
  images,
  isMe,
  onImagePress,
}: {
  images: Attachment[];
  isMe: boolean;
  onImagePress?: (image: Attachment, images: Attachment[]) => void;
}) {
  // 1 ảnh: hiện to; nhiều ảnh: lưới 2 cột như Messenger
  const single = images.length === 1;
  const size = single ? 220 : 108;

  return (
    <View
      className={`flex-row flex-wrap gap-1 ${isMe ? "justify-end" : "justify-start"}`}
      style={{ maxWidth: 220 }}
    >
      {images.map((img) => (
        <TouchableOpacity
          key={img.id}
          activeOpacity={0.9}
          onPress={() => onImagePress?.(img, images)}
          className="overflow-hidden rounded-[18px] bg-slate-100"
        >
          <Image
            source={{ uri: img.url }}
            style={{ width: size, height: single ? 260 : size }}
            contentFit="cover"
            transition={150}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function FileBubble({ file, isMe }: { file: Attachment; isMe: boolean }) {
  const [downloading, setDownloading] = useState(false);

  const handlePress = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await openAttachmentFile(file);
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Không mở được file", text2: error?.message });
    } finally {
      setDownloading(false);
    }
  };

  const meta = [formatFileSize(file.size), fileExtension(file.fileName)]
    .filter(Boolean)
    .join(" · ");

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      className={`max-w-[260px] flex-row items-center gap-3 rounded-[18px] px-3 py-2.5 ${
        isMe ? "rounded-br-xs bg-primary" : "rounded-bl-xs bg-slate-100"
      }`}
    >
      <View
        className={`h-10 w-10 items-center justify-center rounded-full ${
          isMe ? "bg-white/20" : "bg-white"
        }`}
      >
        {downloading ? (
          <ActivityIndicator size="small" color={isMe ? "#ffffff" : "#0084ff"} />
        ) : (
          <MaterialIcons
            name={fileIconName(file.fileName)}
            size={22}
            color={isMe ? "#ffffff" : "#0084ff"}
          />
        )}
      </View>

      <View className="min-w-0 flex-1">
        <Text
          numberOfLines={2}
          className={`text-[14px] font-semibold ${isMe ? "text-white" : "text-slate-900"}`}
        >
          {file.fileName || "Tệp đính kèm"}
        </Text>
        {meta ? (
          <Text className={`mt-0.5 text-[12px] ${isMe ? "text-white/80" : "text-slate-500"}`}>
            {meta}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
