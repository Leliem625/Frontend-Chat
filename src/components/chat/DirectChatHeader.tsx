import { Avatar, Icon } from "@/components/common";

export interface DirectChatHeaderProps {
  title?: string;
  myAvatarUrl?: string | null;
  onBack: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onProfilePress?: () => void;
}

export function DirectChatHeader({
  title = "Direct Chat",
  myAvatarUrl,
  onBack,
  onCall,
  onVideoCall,
  onProfilePress,
}: DirectChatHeaderProps) {
  return (
    <div className="z-50 w-full border-b border-slate-100 bg-white/95 px-2 py-1 shadow-sm">
      <div className="flex h-14 flex-row items-center justify-between px-1">
        {/* Nhóm bên trái: Nút quay lại & Tiêu đề */}
        <div className="flex flex-row items-center gap-1.5">
          <button
            type="button"
            onClick={onBack}
            aria-label="Quay lại"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-100"
          >
            <Icon name="arrow-back-ios" size={20} color="#1e293b" />
          </button>

          <span className="max-w-[190px] truncate text-[18px] font-bold tracking-tight text-slate-900">
            {title}
          </span>
        </div>

        {/* Nhóm bên phải: Nút Gọi thoại, Gọi video, Avatar cá nhân */}
        <div className="flex flex-row items-center gap-1">
          <button
            type="button"
            onClick={onCall}
            aria-label="Gọi thoại"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-100"
          >
            <Icon name="call" size={22} color="#0084ff" />
          </button>

          <button
            type="button"
            onClick={onVideoCall}
            aria-label="Gọi video"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-100"
          >
            <Icon name="videocam" size={24} color="#0084ff" />
          </button>

          <button
            type="button"
            onClick={onProfilePress}
            className="ml-1 flex h-9 w-9 items-center justify-center"
          >
            <Avatar uri={myAvatarUrl} size={32} />
          </button>
        </div>
      </div>
    </div>
  );
}
