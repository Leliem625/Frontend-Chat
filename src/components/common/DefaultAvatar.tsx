import { useId } from "react";

export interface DefaultAvatarProps {
  size?: number;
  isGroup?: boolean;
  className?: string;
}

/**
 * Avatar mặc định chuẩn Facebook (Facebook Default Profile Picture):
 * - Vòng tròn nền xám trung tính nhạt (#E4E6EB) chuẩn Facebook.
 * - Hình bóng người đầu và vai màu xám trung tính đậm (#8A8D91) sắc nét.
 * - Sử dụng clipPath SVG để bo cong 100% không để lộ khoảng hở ở đáy hình.
 * - Hỗ trợ cả avatar cá nhân (1 người) và avatar nhóm (2 người lồng nhau).
 */
export function DefaultAvatar({
  size = 56,
  isGroup = false,
  className = "",
}: DefaultAvatarProps) {
  const rawId = useId();
  const clipId = rawId.replace(/:/g, "_");

  if (isGroup) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={`block shrink-0 rounded-full select-none ${className}`}
        aria-hidden="true"
      >
        <defs>
          <clipPath id={`group-clip-${clipId}`}>
            <circle cx="50" cy="50" r="50" />
          </clipPath>
        </defs>

        {/* Nền xám Facebook */}
        <circle cx="50" cy="50" r="50" fill="#E4E6EB" />

        <g clipPath={`url(#group-clip-${clipId})`}>
          {/* 1. Người phía sau (Bên phải) */}
          <circle cx="65" cy="35" r="13.5" fill="#8A8D91" />
          <path
            d="M 65 54 C 50 54 38 64 34 80 L 34 100 L 96 100 L 96 80 C 92 64 80 54 65 54 Z"
            fill="#8A8D91"
          />

          {/* 2. Đường viền ngăn cách người phía trước (Nền #E4E6EB) */}
          <circle cx="36" cy="42" r="17.5" fill="#E4E6EB" />
          <path
            d="M 36 60 C 18 60 4 72 0 88 L 0 100 L 72 100 L 72 88 C 68 72 54 60 36 60 Z"
            fill="#E4E6EB"
          />

          {/* 3. Người phía trước (Bên trái) */}
          <circle cx="36" cy="42" r="14" fill="#8A8D91" />
          <path
            d="M 36 62 C 20 62 8 73 4 88 L 4 100 L 68 100 L 68 88 C 64 73 52 62 36 62 Z"
            fill="#8A8D91"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`block shrink-0 rounded-full select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={`user-clip-${clipId}`}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>

      {/* Vòng tròn nền xám Facebook */}
      <circle cx="50" cy="50" r="50" fill="#E4E6EB" />

      <g clipPath={`url(#user-clip-${clipId})`}>
        {/* Đầu hình tròn chuẩn tỷ lệ Facebook */}
        <circle cx="50" cy="35.5" r="16" fill="#8A8D91" />

        {/* Thân và vai bo cong lấp đầy cung tròn đáy */}
        <path
          d="M 50 57.5 C 32 57.5 17 68 12 86 L 12 102 L 88 102 L 88 86 C 83 68 68 57.5 50 57.5 Z"
          fill="#8A8D91"
        />
      </g>
    </svg>
  );
}
