import { Icon } from "@/components/common";

export interface ChatsSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onVoiceSearchPress?: () => void;
  placeholder?: string;
}

export function ChatsSearchBar({
  value,
  onChangeText,
  onVoiceSearchPress,
  placeholder = "Tìm kiếm trên đoạn chat hoặc tin nhắn...",
}: ChatsSearchBarProps) {
  return (
    <div className="px-4 pb-2 pt-1">
      <div className="flex h-11 flex-row items-center rounded-full bg-slate-100 px-3.5">
        <Icon name="search" size={20} color="#94a3b8" />
        <input
          type="search"
          className="ml-2.5 h-full min-w-0 flex-1 bg-transparent text-[14px] text-slate-900 outline-none placeholder:text-slate-400"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
        />
        <button
          type="button"
          onClick={onVoiceSearchPress}
          aria-label="Tìm kiếm bằng giọng nói"
          className="p-1 transition active:opacity-70"
        >
          <Icon name="mic" size={19} color="#94a3b8" />
        </button>
      </div>
    </div>
  );
}
