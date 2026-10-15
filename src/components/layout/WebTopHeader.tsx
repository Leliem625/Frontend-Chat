import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import messengerLogo from "@/assets/messenger_app_icon.png";
import { Avatar, CountBadge, Icon } from "@/components/common";
import { useAuth } from "@/context/auth";
import { useUnreadConversationCount } from "@/hooks/useUnreadConversationCount";

import { NotificationBell } from "./NotificationBell";
import { cn } from "@/utils/cn";

export function WebTopHeader() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const isFriendsOrSearch =
    location.pathname === "/friends" || location.pathname === "/search";
  const urlQuery = searchParams.get("q") ?? "";

  // Chữ đang gõ trong ô tìm kiếm. null = chưa sửa gì -> hiện từ khoá đang tìm trên URL (?q=)
  const [draft, setDraft] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const query = draft ?? (isFriendsOrSearch ? urlQuery : "");

  // Gõ chỉ đổi chữ trong ô, CHƯA gọi API
  const handleSearchChange = (val: string) => {
    setDraft(val);
  };

  // Chỉ khi bấm Enter mới đưa từ khoá lên URL -> FriendsPage thấy ?q= đổi mới gọi API tìm kiếm
  const handleSearchSubmit = () => {
    const q = query.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setDraft(q); // giữ nguyên chữ trong ô sau khi tìm
  };

  // Nút X: xoá chữ; đang ở trang tìm kiếm thì bỏ luôn ?q= để quay về danh sách bạn bè
  const handleSearchClear = () => {
    setDraft("");
    if (isFriendsOrSearch && urlQuery) {
      setSearchParams(
        (prev) => {
          prev.delete("q");
          return prev;
        },
        { replace: true }
      );
    }
  };

  const unreadConversations = useUnreadConversationCount();

  const isChatsActive =
    location.pathname === "/" || location.pathname.startsWith("/chat");
  const isFriendsActive = isFriendsOrSearch;

  const NAV_TABS = [
    {
      id: "chats",
      icon: "chat",
      label: "Đoạn chat",
      path: "/",
      isActive: isChatsActive,
    },
    {
      id: "friends",
      icon: "group",
      label: "Bạn bè",
      path: "/friends",
      isActive: isFriendsActive,
    },
    {
      id: "stories",
      icon: "amp_stories",
      label: "Bảng tin",
      path: "/#stories",
      isActive: false,
    },
    {
      id: "calls",
      icon: "call",
      label: "Cuộc gọi",
      path: "/#calls",
      isActive: false,
    },
    {
      id: "archive",
      icon: "archive",
      label: "Đã lưu trữ",
      path: "/#archive",
      isActive: false,
    },
  ];

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full shrink-0 select-none items-center justify-between border-b border-slate-200/80 bg-surface-container-lowest px-3 text-on-surface shadow-[0_1px_4px_rgba(0,0,0,0.03)] md:px-4">
      {/* 1. Left: Brand Logo & Global Search Capsule */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center gap-2 transition-transform hover:scale-105"
          title="Streamline Chat"
        >
          <img
            src={messengerLogo}
            alt="Streamline Chat"
            className="h-8 w-8 object-contain"
          />
          <span className="font-headline-sm hidden text-sm font-bold text-on-surface sm:inline-block lg:text-base">
            Streamline
          </span>
        </button>

        {/* Global Search Capsule */}
        <div className="flex h-10 w-44 items-center rounded-full bg-surface-container-low px-3.5 text-on-surface-variant transition-colors focus-within:bg-surface-container focus-within:ring-2 focus-within:ring-primary-container/30 sm:w-60 md:w-64 lg:w-72 xl:w-80">
          <Icon
            name="search"
            size={19}
            className="mr-2 shrink-0 text-outline"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit();
              }
            }}
            placeholder="Tìm kiếm bạn bè, người dùng..."
            className="w-full bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={handleSearchClear}
              className="cursor-pointer rounded-full p-1 text-outline transition-colors hover:bg-surface-container-high hover:text-on-surface"
              title="Xóa tìm kiếm"
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Center: Global Navigation Tabs (Desktop only) */}
      <nav className="hidden h-full max-w-lg flex-1 items-center justify-center gap-1 px-2 md:flex lg:max-w-xl">
        {NAV_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              navigate(tab.path);
              if (tab.path.startsWith("/#")) {
                toast.info(`Mục: ${tab.label}`);
              }
            }}
            title={tab.label}
            className={cn(
              "relative flex h-full flex-1 cursor-pointer items-center justify-center rounded-xl transition-colors",
              tab.isActive
                ? "font-semibold text-primary-container"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            )}
          >
            <span className="relative">
              <Icon
                name={tab.icon}
                size={24}
                filled={tab.isActive}
                className={tab.isActive ? "text-primary-container" : undefined}
              />
              {tab.id === "chats" && <CountBadge count={unreadConversations} />}
            </span>
            {tab.isActive && (
              <span className="absolute bottom-0 left-3 right-3 h-1 rounded-t-full bg-primary-container" />
            )}
          </button>
        ))}
      </nav>

      {/* 3. Right: Action Buttons (Apps, New Message, Notifications, Profile Avatar) */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Apps Menu button */}
        <button
          type="button"
          title="Ứng dụng & Menu"
          onClick={() => toast.info("Menu ứng dụng")}
          className="hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-surface-container text-on-surface transition-colors hover:bg-surface-container-high sm:flex"
        >
          <Icon name="apps" size={19} />
        </button>

        {/* New message / Edit button */}
        <button
          type="button"
          onClick={() => {
            navigate("/");
            toast.info("Soạn tin nhắn mới");
          }}
          title="Soạn tin nhắn mới"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-surface-container text-on-surface transition-colors hover:bg-surface-container-high"
        >
          <Icon name="edit_square" size={19} />
        </button>

        {/* Chuông thông báo: số chưa đọc + danh sách, cập nhật realtime qua socket */}
        <NotificationBell />

        {/* User Profile Avatar with dropdown arrow */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="relative flex cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-105"
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
              <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-slate-200/80 bg-surface-container-lowest p-2 text-on-surface shadow-2xl">
                <div className="border-b border-slate-100 p-2.5">
                  <p className="truncate text-sm font-semibold text-on-surface">
                    {user?.username || "Tài khoản của bạn"}
                  </p>
                  <p className="truncate text-xs text-on-surface-variant">
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
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-low"
                  >
                    <Icon name="person" size={18} />
                    Trang cá nhân & Cài đặt
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/");
                    }}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-low"
                  >
                    <Icon name="chat" size={18} />
                    Đoạn chat
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/friends");
                    }}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-low"
                  >
                    <Icon name="group" size={18} />
                    Bạn bè & Khám phá
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-error transition-colors hover:bg-error-container/20"
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
