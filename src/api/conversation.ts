import { get, post } from "@/api/client";
import type { Conversation } from "@/types/api";

// Lấy danh sách cuộc trò chuyện của người dùng hiện tại
export function getConversations() {
  return get<Conversation[]>("/api/conversation/list");
}

// Tạo hoặc lấy cuộc trò chuyện 1-1 với người khác
export function createDirectConversation(userBid: number) {
  return post<Conversation>("/api/conversation/create-direct", { userBid });
}

// Tạo cuộc trò chuyện nhóm
export function createGroupConversation(name: string, memberIds: number[]) {
  return post<Conversation>("/api/conversation/create-group", {
    name,
    memberIds,
  });
}
