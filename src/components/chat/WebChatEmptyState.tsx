import { useNavigate } from "react-router";
import messengerLogo from "@/assets/messenger_app_icon.png";
import { Icon } from "@/components/common";
import { useAuth } from "@/context/auth";

export interface WebChatEmptyStateProps {
  onNewChat?: () => void;
}

export function WebChatEmptyState({ onNewChat }: WebChatEmptyStateProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-surface px-6 py-10 font-sans antialiased select-none">
      <div className="flex max-w-lg flex-col items-center text-center">
        {/* Glowing Logo Icon */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-surface-container-lowest shadow-[0_4px_24px_rgba(0,115,223,0.12)] ring-1 ring-slate-200/80 transition-transform duration-300 hover:scale-105">
            <img
              src={messengerLogo}
              alt="Streamline Chat"
              className="h-14 w-14 object-contain drop-shadow-sm"
            />
          </div>
        </div>

        {/* Heading & Subheading */}
        <h2 className="font-headline-md text-2xl font-bold tracking-tight text-on-surface">
          {user?.username
            ? `Xin chào, ${user.username}!`
            : "Chưa chọn cuộc trò chuyện nào"}
        </h2>
        <p className="mt-2.5 max-w-sm text-sm text-on-surface-variant leading-relaxed">
          Chọn một cuộc trò chuyện từ danh sách bên trái hoặc bắt đầu tin nhắn mới để kết nối cùng bạn bè.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onNewChat}
            className="flex items-center gap-2 rounded-2xl bg-primary-container px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <Icon name="edit_square" size={18} />
            <span>Soạn tin nhắn mới</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/friends")}
            className="flex items-center gap-2 rounded-2xl bg-surface-container px-5 py-2.5 text-sm font-semibold text-on-surface transition-all hover:bg-surface-container-high active:scale-95 cursor-pointer"
          >
            <Icon name="person_search" size={18} />
            <span>Tìm kiếm bạn bè</span>
          </button>
        </div>

        {/* Quick Feature Highlights */}
        <div className="mt-10 grid w-full grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="rounded-2xl border border-slate-200/70 bg-surface-container-lowest p-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-colors hover:border-primary-container/40">
            <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary">
              <Icon name="chat" size={20} />
            </div>
            <h3 className="text-xs font-bold text-on-surface">Nhắn tin tức thì</h3>
            <p className="mt-1 text-[11px] text-on-surface-variant leading-normal">
              Gửi tin nhắn, hình ảnh và tài liệu nhanh chóng.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-surface-container-lowest p-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-colors hover:border-primary-container/40">
            <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Icon name="videocam" size={20} />
            </div>
            <h3 className="text-xs font-bold text-on-surface">Gọi thoại & Video</h3>
            <p className="mt-1 text-[11px] text-on-surface-variant leading-normal">
              Kết nối trực tiếp chất lượng cao mượt mà.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-surface-container-lowest p-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-colors hover:border-primary-container/40">
            <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Icon name="security" size={20} />
            </div>
            <h3 className="text-xs font-bold text-on-surface">Bảo mật cao</h3>
            <p className="mt-1 text-[11px] text-on-surface-variant leading-normal">
              Quyền riêng tư được bảo vệ an toàn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
