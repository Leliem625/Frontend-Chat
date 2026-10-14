import type { Socket } from "socket.io-client";

// Danh sách user đang online dùng chung cho cả app.
// Backend chỉ gửi "online_users" 1 lần lúc vừa kết nối, nên phải nghe ngay khi tạo socket
// và giữ lại ở đây, màn nào mở sau cũng đọc được.
let onlineUserIds = new Set<number>();
const listeners = new Set<() => void>();

function update(next: Set<number>) {
  onlineUserIds = next;
  listeners.forEach((listener) => listener());
}

export function attachOnlineListeners(socket: Socket) {
  socket.on("online_users", (userIds: number[]) => {
    update(new Set(userIds.map(Number)));
  });
  socket.on("user_online", (data: { userId: number }) => {
    update(new Set(onlineUserIds).add(Number(data.userId)));
  });
  socket.on("user_offline", (data: { userId: number }) => {
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
