import { Navigate, Outlet } from "react-router";

import { Spinner } from "@/components/common/Spinner";
import { useAuth } from "@/context/auth";

function FullScreenLoading() {
  return (
    <div className="flex flex-1 items-center justify-center text-primary">
      <Spinner size={28} />
    </div>
  );
}

// Các trang cần đăng nhập: chưa đăng nhập thì về trang đăng nhập
export function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenLoading />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

// Các trang đăng nhập / đăng ký: đã đăng nhập thì vào thẳng danh sách trò chuyện
export function GuestOnly() {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenLoading />;
  return user ? <Navigate to="/" replace /> : <Outlet />;
}
