import { get, post } from "@/api/client";
import type { FriendRequestItem, FriendSearchResult, User } from "@/types/api";

// Lấy danh sách bạn bè của người dùng hiện tại
export function getListFriend() {
  return get<User[]>("/api/friend/list");
}

// Gửi lời mời kết bạn
export function sendFriendRequest(toUserId: number, message?: string) {
  return post("/api/friend/send-request", { toUserId, message });
}

// Tìm người dùng theo tên (Elasticsearch), kèm quan hệ bạn bè với mình
export function searchFriends(keyword: string) {
  return get<FriendSearchResult[]>(`/api/friend/search?q=${encodeURIComponent(keyword)}`);
}

// Chấp nhận / từ chối lời mời kết bạn mình nhận được
export function acceptFriendRequest(requestId: number) {
  return post("/api/friend/accept-request", { requestId });
}

export function declineFriendRequest(requestId: number) {
  return post("/api/friend/decline-request", { requestId });
}

// Huỷ kết bạn (backend xoá quan hệ bạn bè của cả 2 người)
export function unfriend(friendId: number) {
  return post("/api/friend/unfriend", { friendId });
}

// Huỷ lời mời kết bạn mình đã gửi
export function cancelFriendRequest(toUserId: number) {
  return post("/api/friend/cancel-request", { toUserId });
}

// Lời mời kết bạn mình nhận được (kèm tên + avatar người gửi)
export function getPendingRequests() {
  return get<FriendRequestItem[]>("/api/friend/pending-requests");
}
