import { Avatar, Icon, StatusChat } from "@/components/common";
import { useOnlineUsers } from "@/socket";
import type { ConversationItemData } from "./types";

export interface ConversationListItemProps {
  item: ConversationItemData;
  onPress: (id: string) => void;
}

export function ConversationListItem({
  item,
  onPress,
}: ConversationListItemProps) {
  const { isOnline } = useOnlineUsers();
  const userIsOnline = Boolean((item.userId && isOnline(item.userId)) || item.isOnline);

  return (
    <button
      type="button"
      onClick={() => onPress(item.id)}
      className="flex w-full flex-row items-center gap-3.5 px-4 py-3 text-left transition hover:bg-slate-50 active:bg-slate-100/70"
    >
      {/* Cột 1: Avatar hoặc Icon nhóm */}
      <div className="relative h-14 w-14 shrink-0">
        <Avatar
          uri={item.avatar}
          size={56}
          isOnline={false}
          isGroup={item.isGroup}
        />

        {/* Badge nhóm nhỏ ở góc nếu là nhóm, hoặc StatusChat nếu là chat trực tiếp */}
        {item.isGroup ? (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-slate-100 shadow-sm">
            <Icon name="group" size={12} color="#0084ff" />
          </div>
        ) : (
          <StatusChat status={userIsOnline ? "online" : "offline"} />
        )}
      </div>

      {/* Cột 2: Nội dung tin nhắn & tên */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {/* Hàng 1: Tên & Thời gian */}
        <div className="mb-0.5 flex flex-row items-center justify-between gap-2">
          <span
            className={`truncate text-[16px] ${
              item.isUnread
                ? "font-bold text-slate-900"
                : "font-semibold text-slate-900"
            }`}
          >
            {item.name}
          </span>
          <span
            className={`shrink-0 text-[12px] ${
              item.isUnread ? "font-semibold text-primary" : "text-slate-400"
            }`}
          >
            {item.time}
          </span>
        </div>

        {/* Hàng 2: Trích đoạn tin nhắn & Icon trạng thái */}
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-row items-center gap-1.5">
            {/* Icon ảnh đính kèm nếu có */}
            {item.hasAttachment && (
              <Icon name="image" size={16} color="#0084ff" />
            )}

            {/* Icon cuộc gọi nhỡ nếu có */}
            {item.isMissedCall && (
              <Icon name="phone-missed" size={16} color="#ef4444" />
            )}

            <span
              className={`truncate text-[14px] ${
                item.isMissedCall
                  ? "font-medium text-red-500"
                  : item.isUnread
                    ? "font-semibold text-slate-900"
                    : "text-slate-500"
              }`}
            >
              {item.senderPrefix && (
                <span
                  className={
                    item.isUnread
                      ? "font-normal text-slate-600"
                      : "font-medium text-slate-700"
                  }
                >
                  {item.senderPrefix}{" "}
                </span>
              )}
              {item.lastMessage}
            </span>
          </div>

          {/* Phía bên phải: Badge số lượng tin chưa đọc / Thumbnail / Tick đã xem */}
          {item.unreadCount ? (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white shadow-sm">
              {item.unreadCount}
            </span>
          ) : item.hasUnreadDot ? (
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
          ) : item.attachmentThumbnail ? (
            <img
              src={item.attachmentThumbnail}
              alt=""
              style={{ width: 16, height: 16, borderRadius: 8, objectFit: "cover" }}
            />
          ) : item.isRead ? (
            <Icon name="done-all" size={17} color="#0084ff" />
          ) : item.isSent ? (
            <Icon name="done" size={16} color="#94a3b8" />
          ) : null}
        </div>
      </div>
    </button>
  );
}
