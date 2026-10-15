import { Avatar } from "@/components/common";

export interface ChatTypingIndicatorProps {
  avatar?: string | null;
  name?: string;
  visible?: boolean;
}

// 3 chấm nảy lệch nhau 150ms (thay cho Animated của React Native)
const DOT_DELAYS = [0, 150, 300];

export function ChatTypingIndicator({ avatar, name = "Bạn bè", visible = true }: ChatTypingIndicatorProps) {
  if (!visible) return null;

  return (
    <div className="mb-3 flex flex-row items-end gap-2 pt-1" aria-label={`${name} đang soạn tin`}>
      {/* Avatar người đang soạn */}
      <div className="mb-0.5 h-7 w-7 shrink-0 overflow-hidden rounded-full">
        <Avatar uri={avatar} size={28} />
      </div>

      {/* Bong bóng 3 chấm nhấp nháy */}
      <div className="flex h-9 w-16 flex-row items-center justify-center gap-1.5 rounded-[18px] rounded-bl-[4px] bg-slate-100 px-3 shadow-sm">
        {DOT_DELAYS.map((delay) => (
          <span
            key={delay}
            className="h-2 w-2 animate-bounce rounded-full bg-slate-500"
            style={{ animationDelay: `${delay}ms`, animationDuration: "900ms" }}
          />
        ))}
      </div>
    </div>
  );
}
