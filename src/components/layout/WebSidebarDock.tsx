import { NavLink, useLocation, useNavigate } from "react-router";
import { useState } from "react";

import messengerLogo from "@/assets/messenger_app_icon.png";
import { Avatar, Icon } from "@/components/common";
import { useAuth } from "@/context/auth";
import { cn } from "@/utils/cn";

export function WebSidebarDock() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isChatsActive =
    location.pathname === "/" || location.pathname.startsWith("/chat");
  const isInsideChat =
    location.pathname.startsWith("/chat/") && location.pathname !== "/chat";

  const NAV_ITEMS = [
    {
      to: "/",
      icon: "chat",
      title: "Đoạn chat",
      isActive: isChatsActive,
    },
    {
      to: "/friends",
      icon: "group",
      title: "Danh bạ & Bạn bè",
      isActive: location.pathname === "/friends",
    },
    {
      to: "/#stories",
      icon: "amp_stories",
      title: "Tin & Bảng tin",
      isActive: false,
    },
    {
      to: "/#calls",
      icon: "call",
      title: "Cuộc gọi",
      isActive: false,
    },
    {
      to: "/#archive",
      icon: "archive",
      title: "Đoạn chat đã lưu trữ",
      isActive: false,
    },
    {
      to: "/profile",
      icon: "settings",
      title: "Cài đặt & Cá nhân",
      isActive: location.pathname === "/profile",
    },
  ];

  return (
    <>
      {/* 1. Desktop Vertical Dock (>= md) */}
      <aside className="fixed left-0 top-0 z-50 hidden h-full w-20 flex-col items-center justify-between bg-surface-container-low py-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] md:flex">
        {/* Top Logo & Navigation */}
        <div className="flex w-full flex-col items-center gap-space-xl">
          <NavLink
            to="/"
            className="flex items-center justify-center p-space-xs transition-transform hover:scale-105"
          >
            <img
              src={messengerLogo}
              alt="Streamline Chat"
              className="h-8 w-auto object-contain"
            />
          </NavLink>

          <nav className="flex w-full flex-col items-center gap-space-sm px-space-xs">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.title}
                to={item.to}
                title={item.title}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                  item.isActive
                    ? "bg-primary-container text-on-primary-container shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                )}
              >
                <Icon
                  name={item.icon}
                  size={24}
                  filled={item.isActive}
                  className={item.isActive ? "text-white" : undefined}
                />
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Profile Avatar & Quick Menu */}
        <div className="relative flex flex-col items-center gap-space-sm">
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="relative flex items-center justify-center rounded-full p-0.5 transition-transform hover:scale-105"
            title={user?.username || "Tài khoản của bạn"}
          >
            <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-surface-container-lowest">
              <Avatar uri={user?.avatarUrl} size={36} name={user?.username} />
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-tertiary ring-2 ring-surface-container-lowest" />
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute bottom-12 left-16 z-50 w-56 rounded-2xl bg-surface-container-lowest p-2 shadow-xl border border-slate-100">
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="truncate text-sm font-semibold text-on-surface">
                    {user?.username}
                  </p>
                  <p className="truncate text-xs text-on-surface-variant">
                    {user?.email}
                  </p>
                </div>

                <div className="mt-1 flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/profile");
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-on-surface hover:bg-surface-container-low"
                  >
                    <Icon name="person" size={18} />
                    Trang cá nhân
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-error hover:bg-error-container/30"
                  >
                    <Icon name="logout" size={18} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* 2. Mobile Bottom Navigation Bar (< md, hidden inside specific chat) */}
      {!isInsideChat && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t border-slate-100 bg-surface-container-lowest px-2 shadow-[0_-1px_8px_rgba(0,0,0,0.04)] md:hidden">
          <NavLink
            to="/"
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-[11px] font-medium transition-colors",
              isChatsActive
                ? "text-primary font-semibold"
                : "text-on-surface-variant"
            )}
          >
            <Icon name="chat" size={22} filled={isChatsActive} />
            <span>Đoạn chat</span>
          </NavLink>

          <NavLink
            to="/friends"
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-[11px] font-medium transition-colors",
              location.pathname === "/friends"
                ? "text-primary font-semibold"
                : "text-on-surface-variant"
            )}
          >
            <Icon
              name="group"
              size={22}
              filled={location.pathname === "/friends"}
            />
            <span>Bạn bè</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-[11px] font-medium transition-colors",
              location.pathname === "/profile"
                ? "text-primary font-semibold"
                : "text-on-surface-variant"
            )}
          >
            <Icon
              name="person"
              size={22}
              filled={location.pathname === "/profile"}
            />
            <span>Cá nhân</span>
          </NavLink>
        </nav>
      )}
    </>
  );
}
