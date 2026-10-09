import { connectSocket, getSocket } from "@/socket/socket";
import { useEffect, useState } from "react";

export function useOnlineUsers() {
  const [onlineUserIds, setOnlineUserIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    let active = true;

    async function init() {
      const socket = (await connectSocket()) || getSocket();
      if (!socket || !active) return;

      // 1. Nhận danh sách toàn bộ user đang online
      const handleOnlineUsers = (userIds: number[]) => {
        if (!active) return;
        setOnlineUserIds(new Set(userIds.map(Number)));
      };

      // 2. Có người vừa Online -> thêm vào danh sách
      const handleUserOnline = (data: { userId: number }) => {
        if (!active) return;
        setOnlineUserIds((prev) => new Set(prev).add(Number(data.userId)));
      };

      // 3. Có người vừa Offline -> xóa khỏi danh sách ngay lập tức
      const handleUserOffline = (data: { userId: number }) => {
        if (!active) return;
        setOnlineUserIds((prev) => {
          const next = new Set(prev);
          next.delete(Number(data.userId));
          return next;
        });
      };

      socket.on("online_users", handleOnlineUsers);
      socket.on("user_online", handleUserOnline);
      socket.on("user_offline", handleUserOffline);

      return () => {
        socket.off("online_users", handleOnlineUsers);
        socket.off("user_online", handleUserOnline);
        socket.off("user_offline", handleUserOffline);
      };
    }

    const cleanupPromise = init();

    return () => {
      active = false;
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, []);

  const isOnline = (userId?: number | string | null): boolean => {
    if (!userId) return false;
    return onlineUserIds.has(Number(userId));
  };

  return { onlineUserIds, isOnline };
}
