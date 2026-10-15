import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { acceptFriendRequest, declineFriendRequest } from "@/api/friend";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/api/notification";
import { Avatar, Icon, Spinner } from "@/components/common";
import { useNotification, useSocketConnect } from "@/socket";
import type { AppNotification } from "@/types/api";
import { formatRelativeTime } from "@/utils/date";

const PAGE_SIZE = 15;

// Câu chữ do frontend ghép từ type + tên người gây ra (backend chỉ lưu "ai làm gì")
function notificationText(n: AppNotification) {
  const name = n.actor?.username ?? "Ai đó";
  switch (n.type) {
    case "FRIEND_REQUEST":
      return { name, action: "đã gửi cho bạn lời mời kết bạn." };
    case "FRIEND_ACCEPTED":
      return { name, action: "đã chấp nhận lời mời kết bạn của bạn." };
    default:
      return { name, action: "có hoạt động mới." };
  }
}

// Chuông thông báo trên header:
// - Số chưa đọc: lấy khi mở app / kết nối lại socket, tăng ngay khi có socket "notification"
// - Bấm mở: tải danh sách, đánh dấu tất cả đã đọc (badge về 0, giống Facebook)
// - Lời mời kết bạn: Chấp nhận / Từ chối ngay trong thông báo
export function NotificationBell() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  // null = chưa tải danh sách lần nào (chỉ tải khi mở dropdown lần đầu)
  const [items, setItems] = useState<AppNotification[] | null>(null);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  // Số chưa đọc: lúc mở app và mỗi lần socket kết nối lại (lúc offline có thể đã lỡ thông báo)
  useSocketConnect(() => {
    getUnreadNotificationCount()
      .then((r) => setUnreadCount(r.count))
      .catch(() => {});
  });

  // Realtime: có thông báo mới -> tăng số, chèn đầu danh sách (nếu đã tải), hiện toast
  useNotification(({ notification, unreadCount: count }) => {
    setUnreadCount(open ? 0 : count);
    setItems((prev) => (prev ? [notification, ...prev.filter((n) => n.id !== notification.id)] : prev));
    if (open) {
      markNotificationRead(notification.id).catch(() => {});
    }
    const { name, action } = notificationText(notification);
    toast(`${name} ${action}`, {
      action:
        notification.type === "FRIEND_ACCEPTED" && notification.actor
          ? { label: "Xem", onClick: () => navigate(`/user/${notification.actor!.id}`) }
          : undefined,
    });
  });

  const handleOpen = async () => {
    const next = !open;
    setOpen(next);
    if (!next) return;

    // Mở chuông -> badge về 0, các thông báo đang hiển thị vẫn giữ kiểu "chưa đọc" tới lần mở sau
    if (unreadCount > 0) {
      setUnreadCount(0);
      markAllNotificationsRead().catch(() => {});
    }
    if (items === null) {
      try {
        const page = await getNotifications(PAGE_SIZE);
        setItems(page.notifications);
        setNextCursor(page.nextCursor);
        setHasMore(page.hasMore);
      } catch (e: any) {
        setItems([]);
        toast.error("Không tải được thông báo", { description: e?.message });
      }
    }
  };

  const handleLoadMore = async () => {
    if (!hasMore || !nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await getNotifications(PAGE_SIZE, nextCursor);
      setItems((prev) => [...(prev ?? []), ...page.notifications]);
      setNextCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch {
      // bỏ qua, người dùng có thể bấm lại
    } finally {
      setLoadingMore(false);
    }
  };

  // Chấp nhận / từ chối -> backend xoá thông báo lời mời, ở đây bỏ khỏi danh sách luôn
  const handleRequest = async (n: AppNotification, accept: boolean) => {
    if (!n.referenceId) return;
    setBusyId(n.id);
    try {
      if (accept) {
        await acceptFriendRequest(n.referenceId);
        toast.success(`Bạn và ${n.actor?.username ?? "người này"} đã là bạn bè`);
      } else {
        await declineFriendRequest(n.referenceId);
      }
      setItems((prev) => prev?.filter((x) => x.id !== n.id) ?? prev);
    } catch (e: any) {
      toast.error("Không thực hiện được", { description: e?.message });
    } finally {
      setBusyId(null);
    }
  };

  const handleClickItem = (n: AppNotification) => {
    if (!n.read) {
      markNotificationRead(n.id).catch(() => {});
      setItems((prev) => prev?.map((x) => (x.id === n.id ? { ...x, read: true } : x)) ?? prev);
    }
    if (n.actor) {
      setOpen(false);
      navigate(`/user/${n.actor.id}`);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        title="Thông báo"
        onClick={handleOpen}
        className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors ${
          open
            ? "bg-primary-container/15 text-primary"
            : "bg-surface-container text-on-surface hover:bg-surface-container-high"
        }`}
      >
        <Icon name="notifications" size={19} filled={open} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white ring-2 ring-surface-container-lowest">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 flex max-h-[70dvh] w-[360px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-surface-container-lowest text-on-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h3 className="text-base font-bold">Thông báo</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-1.5">
              {items === null ? (
                <div className="flex justify-center py-8 text-primary">
                  <Spinner size={22} />
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center text-on-surface-variant">
                  <Icon name="notifications_off" size={36} className="text-outline" />
                  <p className="text-sm">Bạn chưa có thông báo nào</p>
                </div>
              ) : (
                items.map((n) => {
                  const { name, action } = notificationText(n);
                  return (
                    <div
                      key={n.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleClickItem(n)}
                      onKeyDown={(e) => e.key === "Enter" && handleClickItem(n)}
                      className={`flex cursor-pointer gap-3 rounded-xl p-2.5 transition-colors hover:bg-surface-container-low ${
                        n.read ? "" : "bg-primary-container/5"
                      }`}
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                        <Avatar uri={n.actor?.avatarUrl} size={48} name={n.actor?.username} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-snug">
                          <span className="font-semibold">{name}</span> {action}
                        </p>
                        <p className={`mt-0.5 text-xs ${n.read ? "text-outline" : "font-semibold text-primary"}`}>
                          {formatRelativeTime(n.createdAt)}
                        </p>

                        {n.type === "FRIEND_REQUEST" && n.referenceId && (
                          <div className="mt-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              disabled={busyId === n.id}
                              onClick={() => handleRequest(n, true)}
                              className="flex-1 cursor-pointer rounded-lg bg-primary-container py-1.5 text-xs font-semibold text-white hover:bg-primary disabled:opacity-60"
                            >
                              Chấp nhận
                            </button>
                            <button
                              type="button"
                              disabled={busyId === n.id}
                              onClick={() => handleRequest(n, false)}
                              className="flex-1 cursor-pointer rounded-lg bg-surface-container py-1.5 text-xs font-semibold hover:bg-surface-container-high disabled:opacity-60"
                            >
                              Từ chối
                            </button>
                          </div>
                        )}
                      </div>
                      {!n.read && <span className="mt-4 h-2.5 w-2.5 shrink-0 rounded-full bg-primary-container" />}
                    </div>
                  );
                })
              )}

              {hasMore && (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="mt-1 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold text-primary hover:bg-surface-container-low"
                >
                  {loadingMore && <Spinner size={14} />} Xem thông báo trước đó
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
