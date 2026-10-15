import type { CSSProperties } from "react";

import { cn } from "@/utils/cn";

export type IconProps = {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  filled?: boolean;
};

const ICON_NAME_MAP: Record<string, string> = {
  info_outline: "info",
  lock_outline: "lock",
  mail_outline: "mail",
  help_outline: "help",
  error_outline: "error",
  check_circle_outline: "check_circle",
  remove_circle_outline: "remove_circle",
  add_circle_outline: "add_circle",
  chat_bubble_outline: "chat_bubble",
  arrow_back_ios: "arrow_back_ios_new",
};

export function Icon({
  name,
  size = 24,
  color,
  className,
  style,
  filled,
}: IconProps) {
  const normalized = name.replace(/-/g, "_");
  const glyph = ICON_NAME_MAP[normalized] || normalized;

  return (
    <span
      aria-hidden
      className={cn(
        "material-symbols-outlined shrink-0 select-none leading-none",
        className
      )}
      style={{
        fontSize: size,
        width: size,
        height: size,
        color,
        ...(filled ? { fontVariationSettings: "'FILL' 1" } : {}),
        ...style,
      }}
    >
      {glyph}
    </span>
  );
}
