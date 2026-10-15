import { get, post } from "@/api/client";
import type { NotificationPage } from "@/types/api";

// Danh sách thông báo của tôi, mới nhất trước (cursor = nextCursor của lần trước để tải thêm)
export function getNotifications(limit = 20, cursor?: number | null) {
  const query = `limit=${limit}` + (cursor ? `&cursor=${cursor}` : "");
  return get<NotificationPage>(`/api/notification?${query}`);
}

// Số thông báo chưa đọc (số trên chuông)
export function getUnreadNotificationCount() {
  return get<{ count: number }>("/api/notification/unread-count");
}

export function markNotificationRead(id: number) {
  return post<null>(`/api/notification/${id}/read`);
}

export function markAllNotificationsRead() {
  return post<null>("/api/notification/read-all");
}
