import { api, post } from "@/api/client";
import type { LoginResponse, User } from "@/types/api";

export function login(username: string, password: string) {
  return post<LoginResponse>("/api/auth/login", { username, password });
}

export function register(username: string, email: string, password: string) {
  return post<User>("/api/auth/register", { username, email, password });
}

export function getMe() {
  return api<User>("/api/auth/me");
}

// TODO: logout, refreshToken, sendOtp, forgotPassword
