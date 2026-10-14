import { useSyncExternalStore } from "react";

import { getOnlineUserIds, subscribeOnlineUsers } from "@/socket/online";

// Đọc danh sách online dùng chung (được cập nhật trong src/socket/online.ts)
export function useOnlineUsers() {
  const onlineUserIds = useSyncExternalStore(subscribeOnlineUsers, getOnlineUserIds);

  const isOnline = (userId?: number | string | null): boolean => {
    if (!userId) return false;
    return onlineUserIds.has(Number(userId));
  };

  return { onlineUserIds, isOnline };
}
