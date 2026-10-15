import { useEffect, useEffectEvent } from "react";

import type { Message } from "@/types/api";

import { useSocket } from "./client";
import type {
  BlockChangedEvent,
  ConversationReadEvent,
  MessageSeenEvent,
  NotificationEvent,
  ServerEventName,
  ServerToClientEvents,
  TypingEvent,
} from "./events";

/**
 * Nghe 1 sự kiện socket trong component.
 * - Tự đăng ký khi socket sẵn sàng / kết nối lại, tự huỷ khi component unmount.
 * - handler luôn đọc được state / props MỚI NHẤT (useEffectEvent), nên không cần mảng deps
 *   và không bị đăng ký đi đăng ký lại mỗi lần render.
 *
 *   useSocketEvent("new_message", (msg) => { ... });
 */
export function useSocketEvent<E extends ServerEventName>(event: E, handler: ServerToClientEvents[E]) {
  const socket = useSocket();
  const onEvent = useEffectEvent((...args: Parameters<ServerToClientEvents[E]>) => {
    (handler as (...a: Parameters<ServerToClientEvents[E]>) => void)(...args);
  });

  useEffect(() => {
    if (!socket) return;
    const listener = ((...args: Parameters<ServerToClientEvents[E]>) => onEvent(...args)) as ServerToClientEvents[E];
    // socket.io không suy ra được kiểu khi tên sự kiện là generic -> ép kiểu tại đây (đã chặt ở chữ ký hàm)
    (socket as unknown as { on: (e: string, l: unknown) => void }).on(event, listener);
    return () => {
      (socket as unknown as { off: (e: string, l: unknown) => void }).off(event, listener);
    };
  }, [socket, event]);
}

/**
 * Chạy handler khi socket đã kết nối: ngay lúc mount (nếu đang kết nối sẵn) và mỗi lần kết nối lại.
 * Dùng để lấy lại dữ liệu có thể đã lỡ trong lúc mất kết nối (vd số thông báo chưa đọc).
 */
export function useSocketConnect(handler: () => void) {
  const socket = useSocket();
  const onConnect = useEffectEvent(handler);

  useEffect(() => {
    if (!socket) return;
    if (socket.connected) onConnect();
    const listener = () => onConnect();
    socket.on("connect", listener);
    return () => {
      socket.off("connect", listener);
    };
  }, [socket]);
}

// ===== Hook riêng cho từng sự kiện (dễ đọc, khỏi nhớ tên sự kiện) =====

// Có tin nhắn mới (của mình hoặc người khác) trong bất kỳ cuộc trò chuyện nào
export const useNewMessage = (handler: (message: Message) => void) =>
  useSocketEvent("new_message", handler);

// Một tin nhắn vừa bị thu hồi (payload là tin đã thu hồi: recalled = true)
export const useMessageRecalled = (handler: (message: Message) => void) =>
  useSocketEvent("message_recalled", handler);

// Ai đó đang soạn / dừng soạn
export const useTyping = (handler: (data: TypingEvent) => void) => useSocketEvent("typing", handler);

// Thành viên khác vừa xem cuộc trò chuyện
export const useMessageSeen = (handler: (data: MessageSeenEvent) => void) =>
  useSocketEvent("message_seen", handler);

// Mình đã đọc cuộc trò chuyện ở tab / thiết bị nào đó -> xoá badge chưa đọc
export const useConversationRead = (handler: (data: ConversationReadEvent) => void) =>
  useSocketEvent("conversation_read", handler);

// Thông báo mới (kết bạn)
export const useNotification = (handler: (data: NotificationEvent) => void) =>
  useSocketEvent("notification", handler);

// Mình vừa chặn / bỏ chặn 1 người
export const useBlockChanged = (handler: (data: BlockChangedEvent) => void) =>
  useSocketEvent("block_changed", handler);
