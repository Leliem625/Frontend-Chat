import { useState } from "react";
import { useNavigate } from "react-router";
import messengerLogo from "@/assets/messenger_app_icon.png";
import { Avatar, Icon } from "@/components/common";
import { useAuth } from "@/context/auth";

export interface SearchTopNavProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit?: () => void;
  activeNavTab?: string;
  onSelectNavTab?: (tab: string) => void;
}

export function SearchTopNav({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  activeNavTab = "friends",
  onSelectNavTab,
}: SearchTopNavProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const NAV_TABS = [
    { id: "chats", icon: "chat", label: "Đoạn chat", path: "/" },
    { id: "friends", icon: "group", label: "Bạn bè & Tìm kiếm", path: "/friends" },
    { id: "watch", icon: "ondemand_video", label: "Video" },
    { id: "marketplace", icon: "storefront", label: "Marketplace" },
    { id: "groups", icon: "groups", label: "Nhóm" },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-200/80 bg-surface-container-lowest px-4 text-on-surface shadow-[0_1px_4px_rgba(0,0,0,0.03)] select-none">
      {/* 1. Left: Brand Logo & Search Capsule */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
          title="Streamline Chat"
        >
          <img
            src={messengerLogo}
            alt="Streamline Chat"
            className="h-8 w-8 object-contain"
          />
          <span className="hidden sm:inline-block font-headline-sm text-sm lg:text-base font-bold text-on-surface">
            Streamline
          </span>
        </button>

        {/* Search Capsule */}
        <div className="flex h-10 w-48 sm:w-60 md:w-72 lg:w-80 items-center rounded-full bg-surface-container-low px-3.5 text-on-surface-variant transition-colors focus-within:bg-surface-container focus-within:ring-2 focus-within:ring-primary-container/30">
          <Icon name="search" size={19} className="mr-2 text-outline shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearchSubmit?.();
              }
            }}
            placeholder="Tìm kiếm bạn bè, bài viết..."
            className="w-full bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="p-1 text-outline hover:text-on-surface rounded-full hover:bg-surface-container-high cursor-pointer transition-colors"
              title="Xóa tìm kiếm"
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Center: Navigation Tabs (Desktop only) */}
      <nav className="hidden lg:flex h-full items-center justify-center gap-1 flex-1 max-w-xl px-4">
        {NAV_TABS.map((tab) => {
          const isActive = activeNavTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.path) {
                  navigate(tab.path);
                }
                onSelectNavTab?.(tab.id);
              }}
              title={tab.label}
              className={`relative flex h-full flex-1 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? "text-primary-container font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              }`}
            >
              <Icon
                name={tab.icon}
                size={24}
                filled={isActive}
                className={isActive ? "text-primary-container" : undefined}
              />
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-1 bg-primary-container rounded-t-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. Right: Action Buttons (Menu, Messenger, Notifications, Avatar) */}
      <div className="flex items-center gap-2">
        {/* Apps Menu button */}
        <button
          type="button"
          title="Ứng dụng & Menu"
          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface transition-colors hover:bg-surface-container-high cursor-pointer"
        >
          <Icon name="apps" size={19} />
        </button>

        {/* Messenger button (navigates to chat) */}
        <button
          type="button"
          onClick={() => navigate("/")}
          title="Đoạn chat"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface transition-colors hover:bg-surface-container-high cursor-pointer"
        >
          <Icon name="chat" size={19} />
        </button>

        {/* Notification bell */}
        <button
          type="button"
          title="Thông báo"
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface transition-colors hover:bg-surface-container-high cursor-pointer"
        >
          <Icon name="notifications" size={19} />
          <span className="absolute 1 top-1 right-1 h-2 w-2 rounded-full bg-error ring-2 ring-surface-container-lowest" />
        </button>

        {/* User Profile Avatar with dropdown arrow */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="relative flex items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-105"
            title={user?.username || "Tài khoản của bạn"}
          >
            <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-surface-container">
              <Avatar uri={user?.avatarUrl} size={36} name={user?.username} />
            </div>
            <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-surface-container-high text-on-surface ring-2 ring-surface-container-lowest">
              <Icon name="keyboard_arrow_down" size={11} />
            </span>
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-50 w-60 rounded-2xl bg-surface-container-lowest p-2 shadow-2xl border border-slate-200/80 text-on-surface animate-in fade-in zoom-in-95 duration-100">
                <div className="border-b border-slate-100 p-2.5">
                  <p className="font-semibold text-sm truncate text-on-surface">
                    {user?.username || "Tài khoản của bạn"}
                  </p>
                  <p className="text-xs text-on-surface-variant truncate">
                    {user?.email || "Xem trang cá nhân"}
                  </p>
                </div>
                <div className="mt-1 flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/profile");
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium hover:bg-surface-container-low text-left text-on-surface transition-colors cursor-pointer"
                  >
                    <Icon name="person" size={18} />
                    Trang cá nhân
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/");
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium hover:bg-surface-container-low text-left text-on-surface transition-colors cursor-pointer"
                  >
                    <Icon name="chat" size={18} />
                    Đoạn chat
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-error hover:bg-error-container/20 text-left transition-colors cursor-pointer"
                  >
                    <Icon name="logout" size={18} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// Backward compatibility alias
export const FacebookTopNav = SearchTopNav;
export type FacebookTopNavProps = SearchTopNavProps;
