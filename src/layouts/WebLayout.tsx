import { NavLink, Outlet, useLocation } from "react-router";

import { CountBadge, Icon } from "@/components/common";
import { useUnreadConversationCount } from "@/hooks/useUnreadConversationCount";
import { WebTopHeader } from "@/components/layout/WebTopHeader";
import { cn } from "@/utils/cn";

export function WebLayout() {
  const location = useLocation();
  const isInsideChat =
    location.pathname.startsWith("/chat/") && location.pathname !== "/chat";
  const isChatsActive =
    location.pathname === "/" || location.pathname.startsWith("/chat");
  const isFriendsActive =
    location.pathname === "/friends" || location.pathname === "/search";
  const isProfileActive = location.pathname === "/profile";
  const unreadConversations = useUnreadConversationCount();

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-surface font-sans text-on-surface">
      {/* 1. Global Unified Top Header - Shared across ALL pages */}
      <WebTopHeader />

      {/* 2. Main content viewport */}
      <div className="relative flex flex-1 w-full overflow-hidden">
        <main className="relative flex-1 w-full bg-surface overflow-hidden">
          <Outlet />
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation Bar (< md, hidden inside specific active chat) */}
      {!isInsideChat && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-slate-200/80 bg-surface-container-lowest px-2 shadow-[0_-1px_8px_rgba(0,0,0,0.04)] md:hidden">
          <NavLink
            to="/"
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-4 py-1 text-[11px] font-medium transition-colors",
              isChatsActive
                ? "text-primary-container font-semibold"
                : "text-on-surface-variant"
            )}
          >
            <span className="relative">
              <Icon name="chat" size={22} filled={isChatsActive} />
              <CountBadge count={unreadConversations} />
            </span>
            <span>Đoạn chat</span>
          </NavLink>

          <NavLink
            to="/friends"
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-4 py-1 text-[11px] font-medium transition-colors",
              isFriendsActive
                ? "text-primary-container font-semibold"
                : "text-on-surface-variant"
            )}
          >
            <Icon name="group" size={22} filled={isFriendsActive} />
            <span>Bạn bè</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-4 py-1 text-[11px] font-medium transition-colors",
              isProfileActive
                ? "text-primary-container font-semibold"
                : "text-on-surface-variant"
            )}
          >
            <Icon name="person" size={22} filled={isProfileActive} />
            <span>Cá nhân</span>
          </NavLink>
        </nav>
      )}
    </div>
  );
}
