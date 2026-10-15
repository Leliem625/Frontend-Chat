import { NavLink, Outlet } from "react-router";

import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";

const TABS = [
  { to: "/", label: "Đoạn chat", icon: "chat-bubble", badge: 3 },
  { to: "/friends", label: "Bạn bè", icon: "people" },
  { to: "/profile", label: "Cá nhân", icon: "person" },
];

// Thanh tab dưới cùng (thay cho Tabs của Expo Router)
export function TabsLayout() {
  return (
    <>
      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
      <nav className="flex h-[60px] shrink-0 border-t border-slate-100 bg-white pb-2 pt-1.5">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold",
                isActive ? "text-primary" : "text-on-surface-variant"
              )
            }
          >
            <span className="relative">
              <Icon name={tab.icon} size={24} />
              {tab.badge ? (
                <span className="absolute -right-2.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                  {tab.badge}
                </span>
              ) : null}
            </span>
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
