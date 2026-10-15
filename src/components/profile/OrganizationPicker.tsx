import { useEffect, useState } from "react";

import { searchOrganizations } from "@/api/profile";
import { Icon, Spinner } from "@/components/common";
import type { Organization, OrganizationType } from "@/types/api";

import { inputClass } from "./constants";

export type OrganizationValue = {
  organizationId?: number; // có = đã chọn từ gợi ý
  name: string;
  city?: string | null;
};

export interface OrganizationPickerProps {
  type: OrganizationType;
  value: OrganizationValue;
  onChange: (value: OrganizationValue) => void;
  placeholder?: string;
}

// Ô nhập tên trường / công ty có gợi ý (giống Facebook):
// chọn gợi ý -> liên kết đúng trường đó; không có trong gợi ý -> lưu sẽ tạo mới
export function OrganizationPicker({ type, value, onChange, placeholder }: OrganizationPickerProps) {
  const [open, setOpen] = useState(false);
  // Kết quả gợi ý kèm từ khoá đã tìm (để biết đang chờ kết quả của từ khoá mới)
  const [suggestions, setSuggestions] = useState<{ query: string; items: Organization[] } | null>(
    null
  );

  const q = value.name.trim();
  const showDropdown = open && q.length > 0 && !value.organizationId;
  const loading = showDropdown && suggestions?.query !== q;
  const items = suggestions?.query === q ? suggestions.items : [];

  // Gợi ý khi gõ: chờ 250ms sau khi ngừng gõ mới gọi API
  useEffect(() => {
    if (!showDropdown) return;
    let active = true;
    const timer = setTimeout(() => {
      searchOrganizations(type, q)
        .then((result) => {
          if (active) setSuggestions({ query: q, items: result });
        })
        .catch(() => {
          if (active) setSuggestions({ query: q, items: [] });
        });
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [showDropdown, type, q]);

  const icon = type === "SCHOOL" ? "school" : "work";

  return (
    <div className="relative">
      <div className="relative">
        <Icon name={icon} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
        <input
          type="text"
          value={value.name}
          onChange={(e) => {
            // Gõ lại -> bỏ liên kết với trường đã chọn, giữ thành phố đang nhập
            onChange({ name: e.target.value, city: value.organizationId ? null : value.city });
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)} // chờ để kịp bấm vào gợi ý
          placeholder={placeholder}
          className={`${inputClass} pl-9 ${value.organizationId ? "pr-9" : ""}`}
        />
        {value.organizationId && (
          <Icon
            name="check_circle"
            size={18}
            filled
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
          />
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-surface-container-lowest py-1 shadow-xl">
          {loading && (
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-on-surface-variant">
              <Spinner size={12} /> Đang tìm...
            </div>
          )}
          {items.map((org) => (
            <button
              key={org.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()} // giữ focus để onBlur không đóng trước khi chọn
              onClick={() => {
                onChange({ organizationId: org.id, name: org.name, city: org.city });
                setOpen(false);
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left hover:bg-surface-container-low"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-container/10 text-primary">
                <Icon name={icon} size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 truncate text-sm font-semibold text-on-surface">
                  {org.name}
                  {org.verified && <Icon name="verified" size={14} filled className="text-primary" />}
                </span>
                {org.city && <span className="block truncate text-xs text-on-surface-variant">{org.city}</span>}
              </span>
            </button>
          ))}
          {!loading && (
            <div className="border-t border-slate-100 px-3 py-2 text-xs text-on-surface-variant">
              {items.length === 0 ? "Không có trong danh sách. " : "Không thấy? "}
              Lưu sẽ thêm mới <span className="font-semibold text-on-surface">"{q}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
