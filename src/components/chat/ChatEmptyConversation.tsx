import { Avatar, Icon } from "@/components/common";

export interface ChatEmptyConversationProps {
  name: string;
  avatar?: string | null;
  isFriend: boolean;
  onAddFriend?: () => void;
  onWave?: () => void;
  isFriendRequested?: boolean;
}

export function ChatEmptyConversation({
  name,
  avatar,
  isFriend,
  onAddFriend,
  onWave,
  isFriendRequested = false,
}: ChatEmptyConversationProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      {/* Avatar lớn ở giữa */}
      <div className="relative flex items-center justify-center">
        <div className="rounded-full border border-slate-100 bg-white p-1 shadow-sm">
          <Avatar uri={avatar} size={92} />
        </div>
      </div>

      {/* Tên bạn bè */}
      <p className="mt-4 line-clamp-2 text-center text-[22px] font-bold text-slate-900">
        {name}
      </p>

      {/* Dòng trạng thái quan hệ bạn bè trên Chat App */}
      <p className="mt-1.5 text-center text-[14px] font-medium text-slate-500">
        {isFriend
          ? "Các bạn đã là bạn bè trên Chat App"
          : "Các bạn chưa là bạn bè trên Chat App"}
      </p>

      {/* Dòng gợi ý phụ */}
      <p className="mt-1 text-center text-[13px] text-slate-400">
        {isFriend
          ? "Hãy gửi lời chào để bắt đầu cuộc trò chuyện! 👋"
          : "Hãy kết nối để trò chuyện và chia sẻ cùng nhau"}
      </p>

      {/* Nút tương tác nhanh */}
      {isFriend ? (
        onWave && (
          <button
            type="button"
            onClick={onWave}
            className="mt-5 flex flex-row items-center gap-2 rounded-full bg-slate-100 px-5 py-2.5 hover:bg-slate-200 active:bg-slate-200"
          >
            <span className="text-[18px]">👋</span>
            <span className="text-[14px] font-semibold text-slate-700">
              Vẫy tay chào {name}
            </span>
          </button>
        )
      ) : isFriendRequested ? (
        <div className="mt-5 flex flex-row items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2">
          <Icon name="done" size={16} color="#0084ff" />
          <span className="text-[13px] font-medium text-primary">
            Đã gửi lời mời kết bạn
          </span>
        </div>
      ) : (
        onAddFriend && (
          <button
            type="button"
            onClick={onAddFriend}
            className="mt-5 flex flex-row items-center gap-2 rounded-full bg-primary px-5 py-2.5 shadow-sm hover:bg-primary/90 active:bg-primary/90"
          >
            <Icon name="person-add" size={18} color="#ffffff" />
            <span className="text-[14px] font-semibold text-white">
              Kết bạn trên Chat App
            </span>
          </button>
        )
      )}
    </div>
  );
}
