import { io, Socket } from "socket.io-client";

import { getAccessToken } from "@/storage/token";

let socket: Socket | null = null;


export async function connectSocket() {
  if (socket?.connected) {
    return socket;
  }
  const token = await getAccessToken();
  if (!token) {
    return null;
  }

  socket = io(process.env.EXPO_PUBLIC_SOCKET_URL!, {
    transports: ["websocket"],
    extraHeaders: { Authorization: `Bearer ${token}` },
  });

  socket.on("connect", () => console.log("Socket kết nối thành công!, id =", socket?.id));
  socket.on("connect_error", (e) => console.log("Socket kết nối thất bại:", e.message));
  socket.on("disconnect", (reason) => console.log("Socket ngắt kết nối:", reason));

  return socket;
}


export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket() {
  return socket;
}