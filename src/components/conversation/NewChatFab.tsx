import { Icon } from "@/components/common";

export interface NewChatFabProps {
  onPress?: () => void;
}

export function NewChatFab({ onPress }: NewChatFabProps) {
  return (
    <div className="absolute bottom-5 right-5 z-40">
      <button
        type="button"
        onClick={onPress}
        aria-label="Tạo cuộc trò chuyện mới"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40 transition hover:bg-primary-container active:scale-95"
      >
        <Icon name="edit" size={24} color="#ffffff" />
      </button>
    </div>
  );
}
