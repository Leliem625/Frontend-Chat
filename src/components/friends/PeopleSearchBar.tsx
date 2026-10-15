import { Icon } from "@/components/common";

export interface PeopleSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch?: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export function PeopleSearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Tìm kiếm người dùng, bạn bè, @username, công ty...",
  className = "",
}: PeopleSearchBarProps) {
  return (
    <div
      className={`relative flex items-center rounded-full bg-surface-container-low px-space-md py-2.5 text-on-surface-variant transition-colors focus-within:bg-surface-container-highest focus-within:ring-2 focus-within:ring-primary/25 ${className}`}
    >
      <Icon
        name="search"
        size={20}
        className="mr-space-sm text-outline shrink-0"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch?.(value);
          }
        }}
        placeholder={placeholder}
        className="w-full bg-transparent font-body-sm md:font-body-md text-body-sm md:text-body-md text-on-surface placeholder:text-outline focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          title="Xóa tìm kiếm"
          className="p-1 rounded-full hover:bg-surface-container text-outline hover:text-on-surface shrink-0 transition-colors cursor-pointer"
        >
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );
}
