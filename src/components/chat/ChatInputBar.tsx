import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export interface ChatInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onLike?: () => void;
  onAttach?: () => void;
  onPickPhoto?: () => void;
  onEmojiPress?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInputBar({
  value,
  onChangeText,
  onSend,
  onLike,
  onAttach,
  onPickPhoto,
  onEmojiPress,
  placeholder = "Nhắn tin...",
  disabled = false,
}: ChatInputBarProps) {
  const hasContent = value.trim().length > 0;

  const handleAction = () => {
    if (hasContent) {
      onSend();
    } else {
      onLike?.();
    }
  };

  return (
    <View className="border-t border-slate-100 bg-white/95 px-3 py-2 shadow-sm">
      <View className="flex-row items-center gap-1.5">
        {/* Nút Thêm tệp đính kèm */}
        <TouchableOpacity
          onPress={onAttach}
          activeOpacity={0.7}
          accessibilityLabel="Thêm tệp đính kèm"
          className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100"
        >
          <MaterialIcons name="add-circle" size={24} color="#0084ff" />
        </TouchableOpacity>

        {/* Nút Chọn ảnh từ thư viện */}
        <TouchableOpacity
          onPress={onPickPhoto}
          activeOpacity={0.7}
          accessibilityLabel="Chọn ảnh"
          className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100"
        >
          <MaterialIcons name="photo-library" size={22} color="#0084ff" />
        </TouchableOpacity>

        {/* Khung nhập tin nhắn dạng viên thuốc (Pill shape) */}
        <View className="flex-1 flex-row items-center rounded-full bg-slate-100 px-3.5 py-1">
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#94a3b8"
            editable={!disabled}
            multiline={false}
            returnKeyType="send"
            onSubmitEditing={hasContent ? onSend : undefined}
            className="flex-1 py-1.5 text-[15px] text-slate-900"
          />

          {/* Nút chọn Emoji / Biểu tượng cảm xúc */}
          <TouchableOpacity
            onPress={onEmojiPress}
            activeOpacity={0.7}
            accessibilityLabel="Chọn biểu tượng cảm xúc"
            className="p-1"
          >
            <MaterialIcons
              name="sentiment-satisfied"
              size={22}
              color="#0084ff"
            />
          </TouchableOpacity>
        </View>

        {/* Nút chuyển đổi linh hoạt: Like (nếu trống) / Gửi (nếu có nội dung) */}
        <TouchableOpacity
          onPress={handleAction}
          activeOpacity={0.8}
          accessibilityLabel={hasContent ? "Gửi tin nhắn" : "Thích"}
          className="h-10 w-10 items-center justify-center rounded-full bg-primary shadow-xs active:scale-95"
        >
          <MaterialIcons
            name={hasContent ? "send" : "thumb-up"}
            size={20}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
