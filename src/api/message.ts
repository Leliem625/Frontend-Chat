import { get, post } from "@/api/client";
import type { Message, MessagePage, UploadResult } from "@/types/api";

// Lấy tin nhắn của cuộc trò chuyện, mới nhất trước.
// cursor = nextCursor của lần gọi trước để tải tin cũ hơn (bỏ trống ở lần đầu)
export function getMessages(conversationId: number | string, limit = 15, cursor?: string | null) {
  const query = `limit=${limit}` + (cursor ? `&cursor=${encodeURIComponent(cursor)}` : "");
  return get<MessagePage>(`/api/message/${conversationId}?${query}`);
}

// Gửi tin nhắn văn bản, backend trả về tin nhắn vừa lưu
export function sendMessageContent(conversationId: number | string, content: string) {
  return post<Message>("/api/message/send-content", {
    conversationId: Number(conversationId),
    content,
  });
}

// Đánh dấu đã xem cuộc trò chuyện, backend báo cho người kia qua socket "message_seen"
export function markSeen(conversationId: number | string) {
  return post<null>(`/api/message/${conversationId}/seen`);
}

// Gửi tin nhắn kèm ảnh / file đã tải lên qua uploadFile (tối đa 10 file, lời nhắn tuỳ chọn)
export function sendMessageFiles(
  conversationId: number | string,
  attachments: UploadResult[],
  content?: string
) {
  return post<Message>("/api/message/send-file", {
    conversationId: Number(conversationId),
    attachments,
    content: content || undefined,
  });
}
