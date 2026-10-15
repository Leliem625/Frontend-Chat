// Địa chỉ backend, đọc từ file .env (biến phải bắt đầu bằng VITE_ thì trình duyệt mới đọc được)
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8081";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? API_URL;
