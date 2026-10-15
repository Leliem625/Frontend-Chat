import { useState } from "react";

import { Avatar, Icon } from "@/components/common";
import type { ProfileResultData } from "./types";

export interface ProfileResultCardProps {
  profile: ProfileResultData;
  onAction?: (profile: ProfileResultData) => void;
  onDecline?: (profile: ProfileResultData) => void;
  onMessage?: (profile: ProfileResultData) => void;
  onUnfriend?: (profile: ProfileResultData) => void;
  onNavigateProfile?: (profile: ProfileResultData) => void;
}

export function ProfileResultCard({
  profile,
  onAction,
  onDecline,
  onMessage,
  onUnfriend,
  onNavigateProfile,
}: ProfileResultCardProps) {
  const status = profile.relationshipStatus;
  const [showFriendMenu, setShowFriendMenu] = useState(false);

  // Dòng 2: Người theo dõi · Nơi sống (hoặc chuyên môn / handle nếu thiếu)
  const followersAndLocation = [profile.followers, profile.location]
    .filter(Boolean)
    .join(" · ");
  const line2 = followersAndLocation || profile.category || profile.handle;

  // Dòng 3: Số bạn chung (hoặc @username nếu dòng 2 đã hiển thị địa chỉ/người theo dõi)
  const line3 =
    profile.mutualFriends ||
    (followersAndLocation && profile.handle ? profile.handle : undefined);

  return (
    <article className="w-full flex items-center justify-between gap-3 sm:gap-4 rounded-2xl bg-surface-container-lowest border border-slate-200/80 p-3.5 sm:p-4 text-on-surface shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
      {/* 1. Bên trái: Avatar + Tên + Thông tin chi tiết */}
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onNavigateProfile?.(profile)}
          className="shrink-0 transition-opacity hover:opacity-90 cursor-pointer"
          title={`Xem trang cá nhân của ${profile.name}`}
        >
          <div className="h-[60px] w-[60px] overflow-hidden rounded-full ring-1 ring-slate-200/60 shadow-xs flex items-center justify-center">
            <Avatar uri={profile.avatar} size={60} name={profile.name} isOnline={profile.isOnline} />
          </div>
        </button>

        <div className="flex flex-col min-w-0 flex-1 justify-center">
          <button
            type="button"
            onClick={() => onNavigateProfile?.(profile)}
            className="text-left font-semibold text-base sm:text-[17px] text-on-surface hover:underline truncate cursor-pointer transition-colors leading-snug"
          >
            {profile.name}
          </button>

          {line2 && (
            <p className="text-xs sm:text-[13px] text-on-surface-variant truncate mt-0.5 leading-tight">
              {line2}
            </p>
          )}

          {line3 && (
            <p className="text-xs sm:text-[13px] text-on-surface-variant truncate mt-0.5 leading-tight">
              {line3}
            </p>
          )}
        </div>
      </div>

      {/* 2. Bên phải: Nút thao tác kết bạn chuẩn Facebook */}
      <div className="shrink-0 flex items-center gap-2">
        {status === "not_friend" && (
          <button
            type="button"
            onClick={() => onAction?.(profile)}
            className="px-4.5 sm:px-5 py-2.5 rounded-xl bg-[#0866ff] hover:bg-[#0055df] text-white text-sm font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            Thêm bạn bè
          </button>
        )}

        {status === "request_sent" && (
          <button
            type="button"
            onClick={() => onAction?.(profile)}
            className="px-4 sm:px-4.5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            Hủy lời mời
          </button>
        )}

        {status === "request_received" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onAction?.(profile)}
              className="px-4 py-2.5 rounded-xl bg-[#0866ff] hover:bg-[#0055df] text-white text-sm font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              Chấp nhận
            </button>
            <button
              type="button"
              onClick={() => onDecline?.(profile)}
              className="px-3.5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              Xóa
            </button>
          </div>
        )}

        {status === "friend" && (
          <>
            {/* Nút "Bạn bè" -> menu "Hủy kết bạn" */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFriendMenu((prev) => !prev)}
                title="Bạn bè"
                className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <Icon name="how_to_reg" size={18} />
                <span className="hidden sm:inline">Bạn bè</span>
              </button>
              {showFriendMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowFriendMenu(false)} />
                  <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-slate-200/80 bg-surface-container-lowest p-1 shadow-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setShowFriendMenu(false);
                        onUnfriend?.(profile);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-error hover:bg-error-container/20 cursor-pointer"
                    >
                      <Icon name="person_remove" size={18} />
                      Hủy kết bạn
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => onMessage?.(profile)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0866ff] hover:bg-[#0055df] text-white text-sm font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              <Icon name="chat" size={17} />
              <span>Nhắn tin</span>
            </button>
          </>
        )}
      </div>
    </article>
  );
}
