import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import type { Attachment } from "@/types/api";
import { saveImageToGallery } from "@/utils/file";

export interface ImageViewerModalProps {
  image: Attachment | null; // null -> đóng
  onClose: () => void;
}

// Xem ảnh toàn màn hình ngay trong app (giống Messenger), muốn lưu về máy thì bấm nút tải
export function ImageViewerModal({ image, onClose }: ImageViewerModalProps) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!image || saving) return;
    setSaving(true);
    try {
      await saveImageToGallery(image);
      Toast.show({ type: "success", text1: "Đã lưu ảnh vào thư viện" });
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Không lưu được ảnh", text2: error?.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={!!image}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
          {/* Thanh trên: nút đóng & nút tải về */}
          <View className="flex-row items-center justify-between px-4 py-2">
            <TouchableOpacity
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-white/15"
              accessibilityLabel="Đóng"
            >
              <MaterialIcons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              className="flex-row items-center gap-1.5 rounded-full bg-white/15 px-4 py-2"
              accessibilityLabel="Tải ảnh về máy"
            >
              {saving ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <MaterialIcons name="file-download" size={20} color="#ffffff" />
              )}
              <Text className="text-[14px] font-semibold text-white">Tải về</Text>
            </TouchableOpacity>
          </View>

          {/* Ảnh hiển thị vừa màn hình */}
          {image && (
            <Image
              source={{ uri: image.url }}
              style={{ flex: 1 }}
              contentFit="contain"
              transition={150}
            />
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}
