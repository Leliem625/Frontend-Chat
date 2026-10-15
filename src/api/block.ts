import { del, get, post } from "@/api/client";
import type { BlockedUser, BlockStatus } from "@/types/api";

// Chặn: tự huỷ kết bạn, xoá lời mời, 2 bên không nhắn tin / tìm thấy / thấy online nhau
export function blockUser(userId: number) {
  return post<null>(`/api/block/${userId}`);
}

// Bỏ chặn (KHÔNG tự kết bạn lại)
export function unblockUser(userId: number) {
  return del<null>(`/api/block/${userId}`);
}

// Danh sách người mình đã chặn
export function getBlockedUsers() {
  return get<BlockedUser[]>("/api/block");
}

export function getBlockStatus(userId: number) {
  return get<BlockStatus>(`/api/block/${userId}/status`);
}
