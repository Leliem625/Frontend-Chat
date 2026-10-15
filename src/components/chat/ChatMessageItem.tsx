import { Avatar, Icon } from "@/components/common";
import type { Attachment } from "@/types/api";

import { ChatAttachments } from "./ChatAttachments";
import type { DirectMessageItemData } from "./types";

export interface ChatMessageItemProps {
  message: DirectMessageItemData;
  onMediaPress?: (mediaUrl: string) => void;
  onReactionPress?: (emoji: string) => void;
  onImagePress?: (image: Attachment, images: Attachment[]) => void;
}

export function ChatMessageItem({
  message,
  onMediaPress,
  onReactionPress,
  onImagePress,
}: ChatMessageItemProps) {
  const {
    text,
    time,
    isMe,
    avatar,
    mediaUrl,
    attachments,
    locationName,
    reactions,
    isSent,
    seenAvatar,
    seenTime,
  } = message;
  // Chuỗi rỗng = đã xem nhưng người đó không có ảnh đại diện
  const isSeen = seenAvatar != null;

  if (isMe) {
    // Tin nhắn của tôi (Gửi đi - Nằm bên phải)
    return (
      <div className="mb-3 flex max-w-[82%] flex-col items-end self-end">
        {/* Ảnh / file đính kèm */}
        {attachments && attachments.length > 0 && (
          <div className={text ? "mb-1" : undefined}>
            <ChatAttachments
              attachments={attachments}
              isMe
              status={message.status}
              errorMessage={message.errorMessage}
              onRetry={message.onRetry}
              onImagePress={onImagePress}
            />
          </div>
        )}

        {/* Bong bóng tin nhắn gửi đi */}
        {text && (
          <div className="rounded-[18px] rounded-br-[4px] bg-primary px-4 py-2.5 shadow-sm">
            <p className="whitespace-pre-wrap break-words text-[15px] font-normal leading-5 text-white">
              {text}
            </p>
          </div>
        )}

        {/* Trạng thái tin nhắn gửi đi: Thời gian & Icon đã gửi / Avatar đã xem */}
        <div className="mt-1 flex flex-row items-center gap-1.5 px-1">
          <span className="text-[11px] text-slate-400">
            {time}
            {message.status === "sending"
              ? " • Đang gửi..."
              : message.status === "failed"
              ? " • Gửi lỗi"
              : isSent && !isSeen
              ? " • Đã gửi"
              : ""}
          </span>

          {isSeen ? (
            // Badge avatar nhỏ xíu của đối phương khi đã xem
            <span
              className="h-4 w-4 overflow-hidden rounded-full border border-white shadow-sm"
              title={`Đã xem lúc ${seenTime || time}`}
              aria-label={`Đã xem lúc ${seenTime || time}`}
            >
              <Avatar uri={seenAvatar} size={14} />
            </span>
          ) : message.status === "failed" ? (
            <Icon name="error" size={13} className="text-error" />
          ) : isSent ? (
            <Icon name="check-circle" size={13} color="#0084ff" />
          ) : null}
        </div>
      </div>
    );
  }

  // Tin nhắn của đối phương (Nhận - Nằm bên trái)
  return (
    <div className="mb-3 flex max-w-[84%] flex-row items-end gap-2">
      {/* Avatar nhỏ của người gửi */}
      <div className="mb-0.5 h-7 w-7 shrink-0 overflow-hidden rounded-full">
        <Avatar uri={avatar} size={28} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        {/* Đính kèm ảnh / Media nếu có */}
        {mediaUrl && (
          <button
            type="button"
            onClick={() => onMediaPress?.(mediaUrl)}
            className="w-full max-w-[260px] overflow-hidden rounded-[20px] rounded-bl-[4px] bg-slate-100 shadow-sm"
          >
            <div className="relative h-44 w-full">
              <img src={mediaUrl} alt="" className="h-full w-full object-cover" />

              {/* Gradient & Thông tin địa điểm / HD Badge */}
              <div className="absolute bottom-2 left-3 right-3 flex flex-row items-center justify-between">
                {locationName && (
                  <span className="flex flex-row items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur-sm">
                    <Icon name="location-on" size={13} color="#ffffff" />
                    <span className="text-[11px] font-medium text-white">{locationName}</span>
                  </span>
                )}
                <span className="rounded-full bg-black/50 px-2 py-0.5">
                  <span className="text-[10px] font-bold text-white">HD</span>
                </span>
              </div>
            </div>
          </button>
        )}

        {/* Ảnh / file đính kèm */}
        {attachments && attachments.length > 0 && (
          <ChatAttachments attachments={attachments} isMe={false} onImagePress={onImagePress} />
        )}

        {/* Nội dung tin nhắn văn bản */}
        {text && (
          <div className="max-w-full rounded-[18px] rounded-bl-[4px] bg-slate-100 px-4 py-2.5 shadow-sm">
            <p className="whitespace-pre-wrap break-words text-[15px] font-normal leading-5 text-slate-900">
              {text}
            </p>
          </div>
        )}

        {/* Thanh Reaction nhanh (nếu có biểu cảm) */}
        {reactions && reactions.length > 0 && (
          <div className="-mt-2 ml-2 flex flex-row items-center gap-1 rounded-full border border-slate-100 bg-white px-2 py-0.5 shadow-sm">
            {reactions.map((r, idx) => (
              <button type="button" key={idx} onClick={() => onReactionPress?.(r.emoji)}>
                <span className="text-[13px]">{r.emoji}</span>
              </button>
            ))}
            {reactions[0]?.count && reactions[0].count > 1 && (
              <span className="text-[11px] font-semibold text-slate-500">
                {reactions.reduce((sum, item) => sum + (item.count || 1), 0)}
              </span>
            )}
          </div>
        )}

        {/* Thời gian nhận */}
        <span className="mt-0.5 px-1 text-[11px] text-slate-400">{time}</span>
      </div>
    </div>
  );
}
