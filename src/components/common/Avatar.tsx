import { Image } from "expo-image";
import React, { useState } from "react";
import { View, type ViewStyle } from "react-native";

import { DefaultAvatar } from "./DefaultAvatar";

export interface AvatarProps {
  uri?: string | null;
  size?: number;
  isOnline?: boolean;
  isGroup?: boolean;
  style?: ViewStyle;
}

/**
 * Avatar chuẩn Messenger:
 * - Có ảnh uri thật: Hiển thị ảnh tròn.
 * - Ảnh không tồn tại / URL rỗng / link lỗi (404/403/example.com): Tự động hiển thị Avatar mặc định Facebook rõ nét.
 * - Có chấm xanh Online nếu isOnline = true.
 */
export function Avatar({
  uri,
  size = 56,
  isOnline = false,
  isGroup = false,
  style,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Kiểm tra link không hợp lệ hoặc link mẫu trong database
  const isInvalidUri =
    !uri ||
    typeof uri !== "string" ||
    uri.trim() === "" ||
    uri === "null" ||
    uri === "undefined" ||
    uri.includes("example.com");

  const showDefault = isInvalidUri || imageError;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {showDefault ? (
        <DefaultAvatar size={size} isGroup={isGroup} />
      ) : (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          contentFit="cover"
          onError={() => setImageError(true)}
        />
      )}

      {/* Chấm trực tuyến (Online Dot) */}
      {isOnline && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: Math.max(12, size * 0.25),
            height: Math.max(12, size * 0.25),
            borderRadius: Math.max(6, size * 0.125),
            backgroundColor: "#10b981",
            borderWidth: 2,
            borderColor: "#ffffff",
          }}
        />
      )}
    </View>
  );
}
