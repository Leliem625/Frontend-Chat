import { useState } from "react";
import { Icon } from "@/components/common";
import type { SearchCategoryId } from "./types";

export interface SearchFilterSidebarProps {
  activeCategory: SearchCategoryId;
  onSelectCategory: (id: SearchCategoryId) => void;
  onlineOnly?: boolean;
  onToggleOnline?: (online: boolean) => void;
  selectedLocation?: string;
  onSelectLocation?: (loc: string) => void;
  className?: string;
}

export function SearchFilterSidebar({
  activeCategory,
  onSelectCategory,
  onlineOnly = false,
  onToggleOnline,
  selectedLocation = "all",
  onSelectLocation,
  className = "",
}: SearchFilterSidebarProps) {
  const [openLocationDropdown, setOpenLocationDropdown] = useState(false);

  const CATEGORIES: { id: SearchCategoryId; label: string; icon: string }[] = [
    { id: "all", label: "Tất cả mọi người", icon: "group" },
    { id: "friends", label: "Bạn bè của bạn", icon: "how_to_reg" },
    { id: "suggestions", label: "Gợi ý kết bạn", icon: "person_add" },
    { id: "received", label: "Lời mời kết bạn", icon: "person_check" },
    { id: "requests", label: "Lời mời đã gửi", icon: "outgoing_mail" },
  ];

  const LOCATIONS = [
    { id: "all", label: "Tất cả vị trí" },
    { id: "hanoi", label: "Hà Nội" },
    { id: "hcm", label: "TP. Hồ Chí Minh" },
    { id: "danang", label: "Đà Nẵng" },
  ];

  const currentLocationLabel =
    LOCATIONS.find((l) => l.id === selectedLocation)?.label || "Tất cả vị trí";

  return (
    <aside
      className={`w-72 lg:w-80 shrink-0 bg-surface-container-lowest h-full overflow-y-auto p-4 text-on-surface border-r border-slate-200/80 select-none ${className}`}
    >
      {/* 1. Header */}
      <h1 className="text-xl lg:text-2xl font-bold text-on-surface pb-3">
        Tìm kiếm bạn bè
      </h1>

      <div className="border-b border-slate-100" />

      {/* 2. Sub-header */}
      <h2 className="text-sm font-semibold text-on-surface-variant pt-3.5 pb-2 uppercase tracking-wide">
        Bộ lọc tìm kiếm
      </h2>

      {/* 3. Category Items */}
      <div className="flex flex-col gap-1">
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex w-full items-center gap-3 p-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                isSelected
                  ? "bg-surface-container text-primary font-semibold"
                  : "text-on-surface hover:bg-surface-container-low font-medium"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                  isSelected
                    ? "bg-primary-container text-white shadow-sm"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                <Icon
                  name={cat.icon}
                  size={20}
                  filled={isSelected}
                  className={isSelected ? "text-white" : undefined}
                />
              </div>
              <span className="text-sm">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Sub-filters */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          Tùy chọn hiển thị
        </h3>

        {/* Toggle: Chỉ người đang online */}
        <div className="flex items-center justify-between py-1 text-sm text-on-surface">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-tertiary" />
            <span className="text-sm font-medium">Đang hoạt động</span>
          </div>
          <button
            type="button"
            onClick={() => onToggleOnline?.(!onlineOnly)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              onlineOnly ? "bg-primary-container" : "bg-slate-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                onlineOnly ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Dropdown: Vị trí / Tỉnh thành */}
        <div className="relative">
          <label className="block text-xs font-medium text-on-surface-variant mb-1">
            Khu vực / Tỉnh thành
          </label>
          <button
            type="button"
            onClick={() => setOpenLocationDropdown((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-xl bg-surface-container-low px-3 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span>{currentLocationLabel}</span>
            <Icon
              name="arrow_drop_down"
              size={20}
              className={`text-on-surface-variant transition-transform ${
                openLocationDropdown ? "rotate-180" : ""
              }`}
            />
          </button>
          {openLocationDropdown && (
            <div className="mt-1 rounded-xl bg-surface-container-lowest p-1 shadow-lg border border-slate-200/80 text-xs z-10 relative">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => {
                    onSelectLocation?.(loc.id);
                    setOpenLocationDropdown(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedLocation === loc.id
                      ? "bg-primary-container/10 text-primary font-semibold"
                      : "hover:bg-surface-container-low text-on-surface"
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

