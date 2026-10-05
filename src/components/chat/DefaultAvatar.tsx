import { View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

export interface DefaultAvatarProps {
  size?: number;
  isGroup?: boolean;
}

/**
 * Avatar mặc định chuẩn Facebook Messenger:
 * - Nền xám trung tính (#E4E6EB).
 * - Hình bóng người màu xám đậm rõ nét (#8A8D91) có độ tương phản cao, nhìn rõ trên mọi màn hình.
 * - Tự động bo tròn 100% bằng hình học SVG, không phụ thuộc overflow hidden.
 */
export function DefaultAvatar({
  size = 56,
  isGroup = false,
}: DefaultAvatarProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isGroup ? (
        // Avatar mặc định cho Nhóm (2 người lồng nhau chuẩn Facebook)
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Circle cx="50" cy="50" r="50" fill="#E4E6EB" />

          {/* Người phía sau (bên phải) */}
          <Circle cx="64" cy="35" r="13" fill="#8A8D91" />
          <Path
            d="M 40 85 C 40 68, 52 61, 64 61 C 76 61, 88 68, 92 84 A 50 50 0 0 1 40 85 Z"
            fill="#8A8D91"
          />

          {/* Viền ngăn cách người phía trước */}
          <Circle cx="36" cy="40" r="17" fill="#E4E6EB" />
          <Path
            d="M 5 86 C 5 65, 20 57, 36 57 C 52 57, 67 65, 67 86 Z"
            fill="#E4E6EB"
          />

          {/* Người phía trước (bên trái) */}
          <Circle cx="36" cy="40" r="14.5" fill="#8A8D91" />
          <Path
            d="M 8 86 C 8 68, 22 60, 36 60 C 50 60, 64 68, 64 86 A 50 50 0 0 1 8 86 Z"
            fill="#8A8D91"
          />
        </Svg>
      ) : (
        // Avatar mặc định cho Cá nhân (1 người chuẩn Facebook)
        <Svg width={size} height={size} viewBox="0 0 100 100">
          {/* Vòng tròn nền xám Facebook */}
          <Circle cx="50" cy="50" r="50" fill="#E4E6EB" />

          {/* Đầu hình tròn */}
          <Circle cx="50" cy="36" r="16" fill="#8A8D91" />

          {/* Thân và vai bo cong chuẩn theo viền tròn phía dưới */}
          <Path
            d="M 15 86 C 16 67, 32 58, 50 58 C 68 58, 84 67, 85 86 A 50 50 0 0 1 15 86 Z"
            fill="#8A8D91"
          />
        </Svg>
      )}
    </View>
  );
}
