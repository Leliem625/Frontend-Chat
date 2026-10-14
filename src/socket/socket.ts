import { useSyncExternalStore } from "react";
import { io, Socket } from "socket.io-client";

import { attachOnlineListeners, clearOnlineUsers } from "@/socket/online";
import { getAccessToken } from "@/storage/token";

let socket: Socket | null = null;
// Báo cho các màn hình khi socket được tạo / bị huỷ, để chúng đăng ký lại sự kiện
const socketListeners = new Set<() => void>();
function setSocket(next: Socket | null) {
  socket = next;
  socketListeners.forEach((listener) => listener());
}

export async function connectSocket() {
  // Đã có socket (kể cả đang kết nối dở) thì dùng lại, không tạo thêm kết nối mới
  if (socket) {
    return socket;
  }
  const token = await getAccessToken();
  if (!token) {
    return null;
  }

  const next = io(process.env.EXPO_PUBLIC_SOCKET_URL!, {
    transports: ["websocket"],
    extraHeaders: { Authorization: `Bearer ${token}` },
    query: { token },
  });

  attachOnlineListeners(next);

  next.on("connect", () =>
    console.log("Socket kết nối thành công!, id =", next.id)
  );
  next.on("connect_error", (e) =>
    console.log("Socket kết nối thất bại:", e.message)
  );
  next.on("disconnect", (reason) =>
    console.log("Socket ngắt kết nối:", reason)
  );

  setSocket(next);
  return next;
}

export function disconnectSocket() {
  socket?.disconnect();
  setSocket(null);
  clearOnlineUsers();
}

export function getSocket() {
  return socket;
}

// Dùng trong component: trả về socket hiện tại và tự render lại khi socket được tạo / huỷ.
// Đưa socket vào deps của useEffect để đăng ký sự kiện lại khi socket sẵn sàng.
export function useSocket() {
  return useSyncExternalStore(
    (listener) => {
      socketListeners.add(listener);
      return () => {
        socketListeners.delete(listener);
      };
    },
    getSocket
  );
}
