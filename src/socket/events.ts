import type { Socket } from "socket.io-client";

import type { AppNotification, Message, SeenInfo } from "@/types/api";

// ===== Payload các sự kiện backend gửi xuống =====

// Ai đó đang soạn / dừng soạn trong 1 cuộc trò chuyện
export type TypingEvent = { conversationId: number; userId: number; isTyping: boolean };

// Thành viên khác vừa mở xem cuộc trò chuyện -> hiện avatar "đã xem"
export type MessageSeenEvent = { conversationId: number; seen: SeenInfo };

// Chính mình đã đọc cuộc trò chuyện (ở tab / thiết bị nào đó) -> xoá badge chưa đọc
export type ConversationReadEvent = { conversationId: number };

// Thông báo mới (lời mời kết bạn / đã chấp nhận) + số thông báo chưa đọc
export type NotificationEvent = { notification: AppNotification; unreadCount: number };

// Mình vừa chặn / bỏ chặn 1 người (gửi tới mọi thiết bị của mình)
export type BlockChangedEvent = { userId: number; blocked: boolean };

export type UserIdEvent = { userId: number };

// ===== Bản đồ sự kiện: tên -> hàm xử lý =====

// Backend -> frontend
export interface ServerToClientEvents {
  new_message: (message: Message) => void;
  message_recalled: (message: Message) => void;
  typing: (data: TypingEvent) => void;
  message_seen: (data: MessageSeenEvent) => void;
  conversation_read: (data: ConversationReadEvent) => void;
  notification: (data: NotificationEvent) => void;
  block_changed: (data: BlockChangedEvent) => void;
  online_users: (userIds: number[]) => void;
  user_online: (data: UserIdEvent) => void;
  user_offline: (data: UserIdEvent) => void;
}

// Frontend -> backend
export interface ClientToServerEvents {
  typing: (data: { conversationId: number; isTyping: boolean }) => void;
}

// Socket có kiểu: socket.on("new_message", (msg) => ...) tự biết msg là Message
export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export type ServerEventName = keyof ServerToClientEvents;
