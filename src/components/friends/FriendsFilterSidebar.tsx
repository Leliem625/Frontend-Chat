import { Icon } from "@/components/common";
import { FILTER_CATEGORIES } from "./mockData";
import type { FilterCategoryId } from "./types";

export interface FriendsFilterSidebarProps {
  activeCategory: FilterCategoryId;
  onSelectCategory: (id: FilterCategoryId) => void;
  onReset?: () => void;
  className?: string;
}

export function FriendsFilterSidebar({
  activeCategory,
  onSelectCategory,
  onReset,
  className = "",
}: FriendsFilterSidebarProps) {
  return (
    <aside
      className={`col-span-12 md:col-span-4 xl:col-span-3 sticky top-4 md:top-6 bg-surface-container-lowest rounded-lg p-space-lg shadow-sm ${className}`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-space-md border-b border-surface-variant">
        <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
          Bộ lọc tìm kiếm
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="font-label-md text-label-md text-primary hover:underline transition-colors cursor-pointer"
        >
          Đặt lại
        </button>
      </div>

      {/* Filter Categories */}
      <div className="py-space-md flex flex-col gap-space-xs">
        <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase px-space-sm mb-space-xs">
          Danh mục
        </span>

        {FILTER_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;

          if (isActive) {
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className="flex items-center justify-between px-space-md py-space-sm rounded-full bg-primary-container text-on-primary-container shadow-sm w-full transition-all text-left"
              >
                <div className="flex items-center gap-space-md">
                  <Icon
                    name={cat.icon}
                    size={20}
                    filled
                    className="text-white shrink-0"
                  />
                  <span className="font-label-lg text-label-lg font-semibold">
                    {cat.label}
                  </span>
                </div>
                {cat.badge && (
                  <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded-full bg-primary text-on-primary font-bold">
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          }

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className="flex items-center gap-space-md px-space-md py-space-sm rounded-full text-on-surface-variant hover:bg-surface-container transition-colors text-left w-full cursor-pointer"
            >
              <Icon name={cat.icon} size={20} className="shrink-0" />
              <span className="font-body-md text-body-md font-medium">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
