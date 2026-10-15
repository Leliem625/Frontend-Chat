import type { FilterType } from "./types";

export interface FilterTabsProps {
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
}

const TABS: { id: FilterType; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "unread", label: "Chưa đọc" },
  { id: "groups", label: "Nhóm" },
  { id: "channels", label: "Kênh" },
];

export function FilterTabs({ activeFilter, onSelectFilter }: FilterTabsProps) {
  return (
    <div className="px-4 py-2">
      <div className="flex flex-row gap-2 overflow-x-auto [scrollbar-width:none]">
        {TABS.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => onSelectFilter(tab.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition active:opacity-80 ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
