import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getBlockedUsers, unblockUser } from "@/api/block";
import { Avatar, Icon, Spinner } from "@/components/common";
import type { BlockedUser } from "@/types/api";

export interface BlockedUsersModalProps {
  onClose: () => void;
}

// Danh sách người mình đã chặn + nút "Bỏ chặn" (Cài đặt -> Người đã chặn)
export function BlockedUsersModal({ onClose }: BlockedUsersModalProps) {
  const [users, setUsers] = useState<BlockedUser[] | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    getBlockedUsers()
      .then((list) => {
        if (active) setUsers(list);
      })
      .catch((e) => {
        if (!active) return;
        setUsers([]);
        toast.error("Không tải được danh sách", { description: e?.message });
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleUnblock = async (user: BlockedUser) => {
    setBusyId(user.id);
    try {
      await unblockUser(user.id);
      setUsers((prev) => prev?.filter((u) => u.id !== user.id) ?? prev);
      toast.success(`Đã bỏ chặn ${user.username ?? "người dùng"}`);
    } catch (e: any) {
      toast.error("Không bỏ chặn được", { description: e?.message });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[80dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <h3 className="text-base font-bold text-on-surface">Người đã chặn</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-surface-container"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-2">
          {users === null ? (
            <div className="flex justify-center py-8 text-primary">
              <Spinner size={22} />
            </div>
          ) : users.length === 0 ? (
            <p className="py-8 text-center text-sm text-on-surface-variant">Bạn chưa chặn ai.</p>
          ) : (
            users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-surface-container-low">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <Avatar uri={u.avatarUrl} size={44} name={u.username ?? undefined} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-on-surface">{u.username ?? "Người dùng"}</p>
                  <p className="text-xs text-on-surface-variant">
                    Đã chặn ngày {new Date(u.blockedAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busyId === u.id}
                  onClick={() => handleUnblock(u)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-surface-container px-3 py-1.5 text-xs font-semibold hover:bg-surface-container-high disabled:opacity-60"
                >
                  {busyId === u.id && <Spinner size={12} />}
                  Bỏ chặn
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
