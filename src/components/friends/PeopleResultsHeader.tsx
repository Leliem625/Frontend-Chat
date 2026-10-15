import { useState } from "react";
import { Icon } from "@/components/common";
import { PeopleSearchBar } from "./PeopleSearchBar";

export interface PeopleResultsHeaderProps {
  title?: string;
  query?: string;
  onQueryChange?: (val: string) => void;
  onSearch?: (val: string) => void;
  totalResults?: number;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  placeholder?: string;
  showSearchBar?: boolean;
  className?: string;
}

export function PeopleResultsHeader({
  title = "Mọi người",
  query = "",
  onQueryChange,
  onSearch,
  totalResults = 0,
  sortBy = "Phù hợp nhất",
  onSortChange,
  placeholder,
  showSearchBar = true,
  className = "",
}: PeopleResultsHeaderProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortOptions = ["Phù hợp nhất", "Mới nhất", "Bạn chung nhiều nhất"];

  const handleSelectSort = (option: string) => {
    setShowSortDropdown(false);
    onSortChange?.(option);
  };

  return (
    <div
      className={`bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col gap-space-md ${className}`}
    >
      {/* 1. Prominent Search Bar */}
      {showSearchBar && onQueryChange && (
        <PeopleSearchBar
          value={query}
          onChange={onQueryChange}
          onSearch={onSearch}
          placeholder={placeholder}
        />
      )}

      {/* 2. Meta Information & Sort Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs border-t border-slate-100/80">
        {/* Title & Results Count Badge */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <span className="font-headline-md text-headline-md font-semibold text-on-surface">
            {title}
          </span>
          {query.trim() ? (
            <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container px-space-sm py-0.5 rounded-full">
              Khoảng {totalResults} kết quả cho “{query}”
            </span>
          ) : (
            <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container px-space-sm py-0.5 rounded-full">
              {totalResults} người dùng
            </span>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="relative flex items-center gap-space-xs self-start sm:self-auto">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Sắp xếp theo:
          </span>
          <button
            type="button"
            onClick={() => setShowSortDropdown((prev) => !prev)}
            className="font-label-md text-label-md text-primary flex items-center gap-1 hover:underline transition-colors cursor-pointer"
          >
            <span>{sortBy}</span>
            <Icon
              name="expand_more"
              size={16}
              className={`transition-transform duration-200 ${
                showSortDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showSortDropdown && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowSortDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-40 w-48 rounded-xl bg-surface-container-lowest p-1.5 shadow-lg border border-slate-100">
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectSort(opt)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      sortBy === opt
                        ? "bg-primary-container text-white"
                        : "text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
