import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import * as authApi from "@/api/auth";
import { setOnSessionExpired } from "@/api/client";
import { connectSocket, disconnectSocket } from "@/socket/socket";
import { clearTokens, getAccessToken, saveTokens } from "@/storage/token";
import type { User } from "@/types/api";

type AuthContextValue = {
  user: User | null;
  loading: boolean; // Đang kiểm tra token đã lưu khi mở app
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOnSessionExpired(() => {
      disconnectSocket();
      setUser(null);
    });
  }, []);
  // Mở app: nếu còn token thì lấy lại thông tin người dùng
  useEffect(() => {
    (async () => {
      try {
        if (await getAccessToken()) {
          setUser(await authApi.getMe());
          await connectSocket();
        }
      } catch {
        await clearTokens();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(username: string, password: string) {
    const { accessToken, refreshToken, ...loggedInUser } = await authApi.login(
      username,
      password
    );
    await saveTokens(accessToken, refreshToken);
    await connectSocket();
    setUser(loggedInUser);
  }

  async function logout() {
    try {
      disconnectSocket();
      await authApi.logout();
    } catch (e) {
      console.warn("Lỗi khi đăng xuất backend:", e);
    } finally {
      await clearTokens();
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  }
  return value;
}
