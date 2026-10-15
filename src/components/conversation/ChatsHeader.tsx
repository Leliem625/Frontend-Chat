import APP_LOGO from "@/assets/messenger_app_icon.png";
import { Avatar, Icon } from "@/components/common";

export interface ChatsHeaderProps {
  avatarUrl?: string;
  onCameraPress?: () => void;
  onNewChatPress?: () => void;
  onProfilePress?: () => void;
}

export function ChatsHeader({
  avatarUrl,
  onCameraPress,
  onNewChatPress,
  onProfilePress,
}: ChatsHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 flex-row items-center justify-between px-4">
      {/* Logo & Tiêu đề */}
      <div className="flex flex-row items-center gap-2.5">
        <img
          src={APP_LOGO}
          alt=""
          style={{ width: 34, height: 34, objectFit: "contain" }}
        />
        <h1 className="text-[20px] font-bold tracking-tight text-slate-900">
          Đoạn chat
        </h1>
      </div>

      {/* Cụm action bên phải */}
      <div className="flex flex-row items-center gap-1.5">
        <button
          type="button"
          onClick={onCameraPress}
          aria-label="Máy ảnh"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200 active:opacity-70"
        >
          <Icon name="photo-camera" size={21} color="#475569" />
        </button>

        <button
          type="button"
          onClick={onNewChatPress}
          aria-label="Tin nhắn mới"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200 active:opacity-70"
        >
          <Icon name="edit" size={20} color="#475569" />
        </button>

        <button
          type="button"
          onClick={onProfilePress}
          aria-label="Trang cá nhân"
          className="ml-1 transition active:opacity-70"
        >
          <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-primary/20">
            <Avatar uri={avatarUrl} size={34} />
          </div>
        </button>
      </div>
    </header>
  );
}
