import { Avatar, Icon, StatusChat } from "@/components/common";

export interface ChatProfileBarProps {
  name: string;
  avatar?: string | null;
  isOnline?: boolean;
  isVerified?: boolean;
  onBack?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onInfo?: () => void;
}

export function ChatProfileBar({
  name,
  avatar,
  isOnline = true,
  onBack,
  onCall,
  onVideoCall,
  onInfo,
}: ChatProfileBarProps) {
  return (
    <div className="mb-2 flex shrink-0 flex-row items-center justify-between border-b border-slate-100 bg-white px-3 py-2.5 shadow-sm">
      {/* Thông tin đối phương */}
      <div className="flex min-w-0 flex-1 flex-row items-center gap-2.5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Quay lại"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-100"
          >
            <Icon name="arrow-back-ios-new" size={18} color="#1e293b" />
          </button>
        )}

        <div className="relative h-12 w-12 shrink-0">
          <Avatar uri={avatar} size={48} isOnline={false} />
          {/* StatusChat ở góc Avatar */}
          <StatusChat status={isOnline ? "online" : "offline"} size={13} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex flex-row items-center gap-1">
            <span className="truncate text-[17px] font-bold text-slate-900">{name}</span>
          </div>

          <div className="mt-0.5 flex flex-row items-center gap-1.5">
            <span
              className={`text-[12px] font-medium ${
                isOnline ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              {isOnline ? "Đang hoạt động" : "Không hoạt động"}
            </span>
          </div>
        </div>
      </div>

      {/* Các nút hành động phụ: Call, Video, Info */}
      <div className="flex flex-row items-center gap-1.5">
        <button
          type="button"
          onClick={onCall}
          aria-label="Gọi thoại"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95"
        >
          <Icon name="call" size={20} color="#0084ff" />
        </button>

        <button
          type="button"
          onClick={onVideoCall}
          aria-label="Gọi video"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95"
        >
          <Icon name="videocam" size={20} color="#0084ff" />
        </button>

        <button
          type="button"
          onClick={onInfo}
          aria-label="Thông tin hội thoại"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95"
        >
          <Icon name="info-outline" size={20} color="#64748b" />
        </button>
      </div>
    </div>
  );
}
