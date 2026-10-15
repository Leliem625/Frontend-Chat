import { getSocket } from "./client";

// ===== Các sự kiện frontend gửi lên backend =====

// Báo đang soạn / dừng soạn trong 1 cuộc trò chuyện (backend chuyển cho các thành viên khác)
export function emitTyping(conversationId: number | string, isTyping: boolean) {
  getSocket()?.emit("typing", { conversationId: Number(conversationId), isTyping });
}
