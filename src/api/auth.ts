import { api, post } from "@/api/client";
import type { LoginResponse, User } from "@/types/api";

export function login(email: string, password: string) {
  return post<LoginResponse>("/api/auth/login", { email, password });
}

export function register(username: string, email: string, password: string) {
  return post<User>("/api/auth/register", { username, email, password });
}

export function getMe() {
  return api<User>("/api/auth/me");
}

// Backend đọc refresh token từ cookie httpOnly đã đặt lúc đăng nhập (api() gửi kèm cookie)
export function logout() {
  return post<void>("/api/auth/logout");
}
export async function sendOtp(email: string) {
  return post<void>("/api/auth/send-otp", { email });
}

export async function verifyOtp(otp: any, email: string) {
  return post<boolean>("/api/auth/verify-otp", { otp, email });
}

export async function forgotPassword(email: string, password: string) {
  return post<void>("/api/auth/forgot-password", { email, password });
}
// TODO: refreshToken, sendOtp, forgotPassword
