import { useSyncExternalStore } from "react";

import type { AppSocket } from "./events";

// Danh sách user đang online dùng chung cho cả app.
// Backend chỉ gửi "online_users" 1 lần lúc vừa kết nối, nên phải nghe ngay khi tạo socket
// và giữ lại ở đây, màn nào mở sau cũng đọc được.
let onlineUserIds = new Set<number>();
const listeners = new Set<() => void>();

function update(next: Set<number>) {
  onlineUserIds = next;
  listeners.forEach((listener) => listener());
}

export function attachOnlineListeners(socket: AppSocket) {
  socket.on("online_users", (userIds) => {
    update(new Set(userIds.map(Number)));
  });
  socket.on("user_online", (data) => {
    update(new Set(onlineUserIds).add(Number(data.userId)));
  });
  socket.on("user_offline", (data) => {
    const next = new Set(onlineUserIds);
    next.delete(Number(data.userId));
    update(next);
  });
}

export function clearOnlineUsers() {
  update(new Set());
}

export function subscribeOnlineUsers(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getOnlineUserIds() {
  return onlineUserIds;
}

// Dùng trong component: danh sách online + hàm kiểm tra 1 người có online không
export function useOnlineUsers() {
  const onlineUserIds = useSyncExternalStore(subscribeOnlineUsers, getOnlineUserIds);

  const isOnline = (userId?: number | string | null): boolean => {
    if (!userId) return false;
    return onlineUserIds.has(Number(userId));
  };

  return { onlineUserIds, isOnline };
}
