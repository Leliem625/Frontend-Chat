import { useState, type CSSProperties } from "react";

import { DefaultAvatar } from "./DefaultAvatar";

export interface AvatarProps {
  uri?: string | null;
  size?: number;
  isOnline?: boolean;
  isGroup?: boolean;
  style?: CSSProperties;
  className?: string;
  name?: string;
}

/**
 * Avatar chuẩn Messenger / Facebook:
 * - Nếu có URL ảnh thật: Hiển thị ảnh tròn.
 * - Nếu không có avatar (null / undefined / chuỗi rỗng / default / link lỗi): Hiển thị Avatar mặc định chuẩn Facebook.
 * - Có chấm xanh Online nếu isOnline = true.
 */
export function Avatar({
  uri,
  size = 56,
  isOnline = false,
  isGroup = false,
  style,
  className = "",
}: AvatarProps) {
  const [failedUri, setFailedUri] = useState<string | null>(null);

  const cleanUri = typeof uri === "string" ? uri.trim() : "";
  const isInvalidUri =
    !cleanUri ||
    cleanUri === "null" ||
    cleanUri === "undefined" ||
    cleanUri === "none" ||
    cleanUri.includes("example.com") ||
    cleanUri.endsWith("/default.png") ||
    cleanUri.endsWith("/default_avatar.png") ||
    cleanUri.endsWith("/avatar.png") ||
    cleanUri === "default.png" ||
    cleanUri === "default_avatar.png";

  const showDefault = isInvalidUri || failedUri === cleanUri;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        position: "relative",
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        ...style,
      }}
    >
      {showDefault ? (
        <DefaultAvatar size={size} isGroup={isGroup} />
      ) : (
        <img
          src={cleanUri}
          alt=""
          draggable={false}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
          }}
          onError={() => setFailedUri(cleanUri)}
        />
      )}

      {/* Chấm trực tuyến (Online Dot) */}
      {isOnline && (
        <span
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: Math.max(10, size * 0.25),
            height: Math.max(10, size * 0.25),
            borderRadius: "50%",
            backgroundColor: "#10b981",
            border: "2px solid #ffffff",
          }}
        />
      )}
    </div>
  );
}
