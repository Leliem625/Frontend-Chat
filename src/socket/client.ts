import { useSyncExternalStore } from "react";
import { io } from "socket.io-client";

import { SOCKET_URL } from "@/config";
import { getAccessToken } from "@/storage/token";

import type { AppSocket } from "./events";
import { attachOnlineListeners, clearOnlineUsers } from "./online";

// ===== Kết nối socket: chỉ có 1 kết nối dùng chung cho cả app =====
// Tạo khi đăng nhập / mở app còn token (context/auth.tsx), huỷ khi đăng xuất

let socket: AppSocket | null = null;
// Báo cho các màn hình khi socket được tạo / bị huỷ, để chúng đăng ký lại sự kiện
const socketListeners = new Set<() => void>();
function setSocket(next: AppSocket | null) {
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

  // Trình duyệt không gửi được header Authorization qua websocket nên token đi bằng query
  const next: AppSocket = io(SOCKET_URL, {
    transports: ["websocket"],
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

// Dùng ngoài component (hàm emit, xử lý sự kiện...)
export function getSocket(): AppSocket | null {
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
