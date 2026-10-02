import { API_URL } from "@/config";
import { getAccessToken } from "@/storage/token";
import type { ApiResponse } from "@/types/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

// Gọi API backend: tự gắn access token, trả về phần `data`, ném ApiError khi backend báo lỗi.
// TODO: khi nhận 401 thì gọi /api/auth/refresh-token để lấy access token mới rồi gọi lại.
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();
  const isFormData = options.body instanceof FormData;

  const response = await fetch(API_URL + path, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const json = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !json || json.status !== "success") {
    throw new ApiError(json?.message ?? "Không kết nối được máy chủ", response.status);
  }
  return json.data;
}

export function post<T>(path: string, body?: unknown) {
  return api<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) });
}
