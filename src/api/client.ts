import { API_URL } from "@/config";
// import { getAccessToken } from "@/storage/token";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
} from "@/storage/token";
import type { ApiResponse } from "@/types/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

// Gọi API backend: tự gắn access token, trả về phần `data`, ném ApiError khi backend báo lỗi.
// TODO: khi nhận 401 thì gọi /api/auth/refresh-token để lấy access token mới rồi gọi lại.
export async function api<T>(
  path: string,
  options: RequestInit = {},
  retried = false
): Promise<T> {
  const token = await getAccessToken();
  const isFormData = options.body instanceof FormData;

  let response: Response;
  try {
    response = await fetch(API_URL + path, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (err: any) {
    console.error(
      `[API Network Error] ${options.method ?? "GET"} ${API_URL + path}:`,
      err
    );
    throw new ApiError(
      `Không thể kết nối đến máy chủ (${API_URL}). Vui lòng kiểm tra mạng hoặc đảm bảo backend đang chạy.`,
      0
    );
  }
  if (response.status === 401 && !NO_REFRESH_PATHS.includes(path) && !retried) {
    const newToken = await refreshToken();
    if (newToken) {
      return api<T>(path, options, true);
    }
    await clearTokens();
    onSessionExpired?.();
    throw new ApiError(
      "Phi√™n ƒëƒÉng nh·∫≠p ƒë√£ h·∫øt h·∫°n, vui l√≤ng ƒëƒÉng nh·∫≠p l·∫°i",
      401
    );
  }

  const json = (await response
    .json()
    .catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !json || json.status !== "success") {
    let errorMsg = json?.message ?? "Không kết nối được máy chủ";
    // Nếu có lỗi validation chi tiết từng field từ backend
    if (
      json?.data &&
      typeof json.data === "object" &&
      !Array.isArray(json.data)
    ) {
      const fieldErrors = Object.values(json.data as Record<string, string>);
      if (fieldErrors.length > 0 && typeof fieldErrors[0] === "string") {
        errorMsg = fieldErrors.join("\n");
      }
    }

    throw new ApiError(errorMsg, response.status);
  }
  return json.data;
}

export function post<T>(path: string, body?: unknown) {
  return api<T>(path, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function get<T>(path: string, body?: unknown) {
  return api<T>(path, {
    method: "GET",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
const NO_REFRESH_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh-token",
];

// AuthProvider ƒëƒÉng k√Ω h√†m n√†y ƒë·ªÉ b·ªã ƒëƒÉng xu·∫•t khi refresh token c≈©ng h·∫øt h·∫°n
let onSessionExpired: (() => void) | null = null;
export function setOnSessionExpired(callback: () => void) {
  onSessionExpired = callback;
}

let refreshPromise: Promise<string | null> | null = null;
async function refreshToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) return null;
        const response = await fetch(API_URL + "/api/auth/refresh-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        const json = await response.json().catch(() => null);
        await saveAccessToken(json.data.accessToken);
        return json.data.accessToken as string;
      } catch {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}
