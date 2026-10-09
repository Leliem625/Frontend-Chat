import { get, post } from "@/api/client";
import type { User } from "@/types/api";

// Lấy danh sách bạn bè của người dùng hiện tại
export function getListFriend() {
  return get<User[]>("/api/friend/list");
}

// Gửi lời mời kết bạn
export function sendFriendRequest(toUserId: number, message?: string) {
  return post("/api/friend/send-request", { toUserId, message });
}
