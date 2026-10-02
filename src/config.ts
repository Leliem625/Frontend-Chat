// Địa chỉ backend, đọc từ file .env (biến phải bắt đầu bằng EXPO_PUBLIC_ thì app mới đọc được)
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8081";
