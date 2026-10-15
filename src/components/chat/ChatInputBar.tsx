import { useLayoutEffect, useRef, type KeyboardEvent } from "react";

import { Icon } from "@/components/common";

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

// Ô nhập cao tối đa ~5 dòng, dài hơn thì cuộn bên trong
const MAX_INPUT_HEIGHT = 120;

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Tự giãn chiều cao theo nội dung
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_INPUT_HEIGHT)}px`;
  }, [value]);

  const handleAction = () => {
    if (hasContent) {
      onSend();
    } else {
      onLike?.();
    }
  };

  // Enter: gửi; Shift + Enter: xuống dòng (bỏ qua khi đang gõ tiếng Việt bằng bộ gõ)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (hasContent) onSend();
    }
  };

  return (
    <div className="shrink-0 border-t border-slate-100 bg-white/95 px-3 py-2 shadow-sm">
      <div className="flex flex-row items-end gap-1.5">
        {/* Nút Thêm tệp đính kèm */}
        <button
          type="button"
          onClick={onAttach}
          aria-label="Thêm tệp đính kèm"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-100"
        >
          <Icon name="add-circle" size={24} color="#0084ff" />
        </button>

        {/* Nút Chọn ảnh từ thư viện */}
        <button
          type="button"
          onClick={onPickPhoto}
          aria-label="Chọn ảnh"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-100"
        >
          <Icon name="photo-library" size={22} color="#0084ff" />
        </button>

        {/* Khung nhập tin nhắn dạng viên thuốc (Pill shape) */}
        <div className="flex min-h-10 min-w-0 flex-1 flex-row items-center rounded-[20px] bg-slate-100 px-3.5 py-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChangeText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            enterKeyHint="send"
            className="min-w-0 flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-5 text-slate-900 outline-none placeholder:text-slate-400"
          />

          {/* Nút chọn Emoji / Biểu tượng cảm xúc */}
          <button
            type="button"
            onClick={onEmojiPress}
            aria-label="Chọn biểu tượng cảm xúc"
            className="shrink-0 p-1"
          >
            <Icon name="sentiment-satisfied" size={22} color="#0084ff" />
          </button>
        </div>

        {/* Nút chuyển đổi linh hoạt: Like (nếu trống) / Gửi (nếu có nội dung) */}
        <button
          type="button"
          onClick={handleAction}
          aria-label={hasContent ? "Gửi tin nhắn" : "Thích"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary shadow-sm active:scale-95"
        >
          <Icon name={hasContent ? "send" : "thumb-up"} size={20} color="#ffffff" />
        </button>
      </div>
    </div>
  );
}
