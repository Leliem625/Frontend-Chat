// Bản web: expo-secure-store không chạy trên trình duyệt nên dùng localStorage
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export async function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export async function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
