import { useState } from "react";
import { toast } from "sonner";

import { Avatar, Icon } from "@/components/common";
import type { Attachment, BlockStatus } from "@/types/api";
import { formatFileSize, openAttachmentFile } from "@/utils/file";
import type { DirectMessageItemData } from "./types";

export interface WebChatInfoSidebarProps {
  name: string;
  avatar?: string;
  isOnline?: boolean;
  messages: DirectMessageItemData[];
  onImageClick?: (image: Attachment, allImages: Attachment[]) => void;
  onClose?: () => void;
  onViewProfile?: () => void;
  blockStatus?: BlockStatus;
  onToggleBlock?: () => void; // chặn / bỏ chặn (chỉ có ở chat 1-1)
}

export function WebChatInfoSidebar({
  name,
  avatar,
  isOnline = false,
  messages,
  onImageClick,
  onClose,
  onViewProfile,
  blockStatus = "NONE",
  onToggleBlock,
}: WebChatInfoSidebarProps) {
  const [infoOpen, setInfoOpen] = useState(true);
  const [mediaOpen, setMediaOpen] = useState(true);
  const [privacyOpen, setPrivacyOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Trích xuất toàn bộ ảnh và file từ các tin nhắn
  const allAttachments: Attachment[] = messages.flatMap(
    (m) => m.attachments ?? []
  );
  const sharedImages = allAttachments.filter((a) => a.resourceType === "image");
  const sharedFiles = allAttachments.filter((a) => a.resourceType !== "image");

  return (
    <aside className="relative flex h-full w-72 shrink-0 flex-col overflow-y-auto border-l border-slate-100 bg-surface-container-lowest p-space-md shadow-[-1px_0_12px_rgba(0,0,0,0.03)] lg:w-80">
      {/* Mobile close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container lg:hidden"
        >
          <Icon name="close" size={18} />
        </button>
      )}

      {/* User Profile Card */}
      <div className="flex flex-col items-center pb-space-sm pt-space-lg text-center">
        <div className="relative mb-space-sm">
          <div className="h-20 w-20 overflow-hidden rounded-full shadow-md ring-2 ring-surface-container-lowest">
            <Avatar uri={avatar} size={80} name={name} />
          </div>
          {isOnline && (
            <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-tertiary ring-2 ring-surface-container-lowest" />
          )}
        </div>

        <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
          {name}
        </h3>
        <span
          className={`font-label-sm mt-0.5 text-label-sm ${
            isOnline ? "text-tertiary" : "text-outline"
          }`}
        >
          {isOnline ? "Đang hoạt động" : "Không hoạt động"}
        </span>

        {/* Quick Action Shortcuts */}
        <div className="mt-space-lg flex w-full items-center justify-center gap-space-lg">
          {/* Không biết đối phương (vd tài khoản đã chặn mình) -> không có nút Trang cá nhân */}
          {onViewProfile && (
            <div className="group flex cursor-pointer flex-col items-center gap-1">
              <button
                type="button"
                onClick={onViewProfile}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface transition-colors group-hover:bg-surface-container-high"
              >
                <Icon name="person" size={20} />
              </button>
              <span className="font-label-sm text-[11px] text-on-surface-variant">
                Trang cá nhân
              </span>
            </div>
          )}

          <div className="group flex cursor-pointer flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setIsMuted((prev) => !prev);
                toast.success(
                  isMuted
                    ? "Đã bật thông báo"
                    : "Đã tắt thông báo cuộc trò chuyện"
                );
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                isMuted
                  ? "bg-primary-container text-white"
                  : "bg-surface-container text-on-surface group-hover:bg-surface-container-high"
              }`}
            >
              <Icon
                name={isMuted ? "notifications_off" : "notifications"}
                size={20}
              />
            </button>
            <span className="font-label-sm text-[11px] text-on-surface-variant">
              {isMuted ? "Bật thông báo" : "Tắt thông báo"}
            </span>
          </div>

          <div className="group flex cursor-pointer flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => toast.info("Tính năng tìm kiếm tin nhắn sắp mở")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface transition-colors group-hover:bg-surface-container-high"
            >
              <Icon name="search" size={20} />
            </button>
            <span className="font-label-sm text-[11px] text-on-surface-variant">
              Tìm kiếm
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {/* Accordion 1: Thông tin đoạn chat */}
        <div className="rounded-2xl bg-surface-container-low p-space-sm">
          <button
            type="button"
            onClick={() => setInfoOpen((prev) => !prev)}
            className="font-headline-sm flex w-full items-center justify-between p-space-xs text-left text-[14px] font-semibold text-on-surface"
          >
            <span>Thông tin đoạn chat</span>
            <Icon
              name="expand_more"
              size={20}
              className={`text-outline transition-transform duration-200 ${
                infoOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {infoOpen && (
            <div className="mt-space-xs space-y-1">
              <div
                onClick={() => toast.info("Đổi chủ đề chat")}
                className="flex cursor-pointer items-center justify-between rounded-xl p-space-xs transition-colors hover:bg-surface-container"
              >
                <div className="flex items-center gap-space-sm">
                  <Icon name="palette" size={18} className="text-primary" />
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Đổi chủ đề
                  </span>
                </div>
                <span className="inline-block h-4 w-4 rounded-full bg-primary" />
              </div>

              <div
                onClick={() => toast.info("Đổi biểu tượng cảm xúc")}
                className="flex cursor-pointer items-center justify-between rounded-xl p-space-xs transition-colors hover:bg-surface-container"
              >
                <div className="flex items-center gap-space-sm">
                  <Icon name="thumb_up" size={18} className="text-primary" />
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Biểu tượng cảm xúc
                  </span>
                </div>
                <span className="text-sm">👍</span>
              </div>

              <div
                onClick={() => toast.info("Chỉnh sửa biệt danh")}
                className="flex cursor-pointer items-center justify-between rounded-xl p-space-xs transition-colors hover:bg-surface-container"
              >
                <div className="flex items-center gap-space-sm">
                  <Icon name="badge" size={18} className="text-primary" />
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Chỉnh sửa biệt danh
                  </span>
                </div>
                <Icon name="chevron_right" size={16} className="text-outline" />
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2: File phương tiện & file */}
        <div className="rounded-2xl bg-surface-container-low p-space-sm">
          <button
            type="button"
            onClick={() => setMediaOpen((prev) => !prev)}
            className="font-headline-sm flex w-full items-center justify-between p-space-xs text-left text-[14px] font-semibold text-on-surface"
          >
            <span>File phương tiện &amp; file</span>
            <Icon
              name="expand_more"
              size={20}
              className={`text-outline transition-transform duration-200 ${
                mediaOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {mediaOpen && (
            <div className="mt-space-sm">
              {/* Shared Images Grid Preview */}
              <div className="grid grid-cols-3 gap-1.5">
                <div
                  onClick={() =>
                    onImageClick?.(
                      sharedImages[0] || {
                        id: 201,
                        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLvS4kA6TWXqPgCZ7kG7VXSs7GFyXQ79KginZp8uJQdOZuA4svNWMElBJmXUOuAehW9G5LAwlLqKwE_8L6_qbC2kRRsseFdyn-ZjSyEq7WOOXi9ZrksKH6iZ9UIUknI9Pk0w1wmCIS3SKsytiKpZM03vFrTVWQJtTFlT6P6pJKc0GMnEv7w2kziIRsW8RKvsA39ngTpj_MYKx3i541O_zMDKVUIbmMczov3e6LDqHSnrzgRgZKiNFH",
                        resourceType: "image",
                      },
                      sharedImages
                    )
                  }
                  className="aspect-square cursor-pointer overflow-hidden rounded-lg bg-surface-container"
                >
                  <img
                    src={
                      sharedImages[0]?.url ||
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLvS4kA6TWXqPgCZ7kG7VXSs7GFyXQ79KginZp8uJQdOZuA4svNWMElBJmXUOuAehW9G5LAwlLqKwE_8L6_qbC2kRRsseFdyn-ZjSyEq7WOOXi9ZrksKH6iZ9UIUknI9Pk0w1wmCIS3SKsytiKpZM03vFrTVWQJtTFlT6P6pJKc0GMnEv7w2kziIRsW8RKvsA39ngTpj_MYKx3i541O_zMDKVUIbmMczov3e6LDqHSnrzgRgZKiNFH"
                    }
                    alt=""
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>

                <div
                  onClick={() =>
                    onImageClick?.(
                      sharedImages[1] || {
                        id: 202,
                        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjdFSdsF4leOKQqZcXHim1sOYVg0mKVMCQPlzK2_dFwAVzujopRokDoeEnLL_KhaEncy2rZ9_l_cnrnITRFq-7wPobP3lvwM5kshxRQEBAg-WWVjBLoJ3dTIoC7qpqbYfZrBKbwDKb40hbx18v48LlLJAZjHDMGFEqPq2_U10GycLUjOYUuZw49luW9UdBzRBdgzyevOWfx_4ZgeUMND8OVCVV2bwPssBF5oMuf1x6H7zgemz7ojp4",
                        resourceType: "image",
                      },
                      sharedImages
                    )
                  }
                  className="aspect-square cursor-pointer overflow-hidden rounded-lg bg-surface-container"
                >
                  <img
                    src={
                      sharedImages[1]?.url ||
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjdFSdsF4leOKQqZcXHim1sOYVg0mKVMCQPlzK2_dFwAVzujopRokDoeEnLL_KhaEncy2rZ9_l_cnrnITRFq-7wPobP3lvwM5kshxRQEBAg-WWVjBLoJ3dTIoC7qpqbYfZrBKbwDKb40hbx18v48LlLJAZjHDMGFEqPq2_U10GycLUjOYUuZw49luW9UdBzRBdgzyevOWfx_4ZgeUMND8OVCVV2bwPssBF5oMuf1x6H7zgemz7ojp4"
                    }
                    alt=""
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>

                <div
                  onClick={() =>
                    onImageClick?.(
                      sharedImages[2] || {
                        id: 203,
                        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRLlitQ2MLz4AXr8eQ6xbQjeu_9fiHu0gRKqBhNMwhkZz4vBmAWS1x-R04t3F-ox9FDUt94oQOb5a63wekhIffIhNahrLzKKtXsrI16QdDcGRhetRnd6q9CnrvkrBT8eC6sb4Jnow7PeNW-6yGRZnt0SyK3lFwTu7G1Spy6-DKuVZ4RJaula28VizftbCCbJ_Kpb_kdId9c2YcJbm6pQyX5PY3syo9nXx61r6_L5ex8IooekMg9D1w",
                        resourceType: "image",
                      },
                      sharedImages
                    )
                  }
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-surface-container"
                >
                  <img
                    src={
                      sharedImages[2]?.url ||
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBRLlitQ2MLz4AXr8eQ6xbQjeu_9fiHu0gRKqBhNMwhkZz4vBmAWS1x-R04t3F-ox9FDUt94oQOb5a63wekhIffIhNahrLzKKtXsrI16QdDcGRhetRnd6q9CnrvkrBT8eC6sb4Jnow7PeNW-6yGRZnt0SyK3lFwTu7G1Spy6-DKuVZ4RJaula28VizftbCCbJ_Kpb_kdId9c2YcJbm6pQyX5PY3syo9nXx61r6_L5ex8IooekMg9D1w"
                    }
                    alt=""
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="font-label-md absolute inset-0 flex items-center justify-center bg-on-background/40 text-label-md text-white">
                    +{sharedImages.length > 3 ? sharedImages.length - 2 : "18"}
                  </div>
                </div>
              </div>

              {/* Files list item preview */}
              <div className="mt-space-sm space-y-1 pt-space-xs">
                {sharedFiles.length > 0 ? (
                  sharedFiles.slice(0, 4).map((file) => (
                    <div
                      key={file.id}
                      onClick={() => openAttachmentFile(file)}
                      className="flex cursor-pointer items-center gap-space-sm rounded-xl p-space-xs transition-colors hover:bg-surface-container"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-container/10 text-primary">
                        <Icon name="description" size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-body-sm truncate text-body-sm font-medium text-on-surface">
                          {file.fileName || "Tệp tài liệu"}
                        </p>
                        <span className="font-label-sm text-[11px] text-outline">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    onClick={() =>
                      toast.info("Xem tài liệu Design_System_v3.pdf")
                    }
                    className="flex cursor-pointer items-center gap-space-sm rounded-xl p-space-xs transition-colors hover:bg-surface-container"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-container/10 text-primary">
                      <Icon name="description" size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-body-sm truncate text-body-sm font-medium text-on-surface">
                        Design_System_v3.pdf
                      </p>
                      <span className="font-label-sm text-[11px] text-outline">
                        4.2 MB • Hôm qua
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Accordion 3: Quyền riêng tư & hỗ trợ */}
        <div className="rounded-2xl bg-surface-container-low p-space-sm">
          <button
            type="button"
            onClick={() => setPrivacyOpen((prev) => !prev)}
            className="font-headline-sm flex w-full items-center justify-between p-space-xs text-left text-[14px] font-semibold text-on-surface"
          >
            <span>Quyền riêng tư &amp; hỗ trợ</span>
            <Icon
              name="expand_more"
              size={20}
              className={`text-outline transition-transform duration-200 ${
                privacyOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {privacyOpen && (
            <div className="mt-space-xs space-y-0.5">
              {onToggleBlock && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={onToggleBlock}
                  onKeyDown={(e) => e.key === "Enter" && onToggleBlock()}
                  className={`flex cursor-pointer items-center gap-space-sm rounded-xl p-space-xs transition-colors hover:bg-surface-container ${
                    blockStatus === "BLOCKED_BY_ME"
                      ? "text-on-surface"
                      : "text-error"
                  }`}
                >
                  <Icon
                    name={
                      blockStatus === "BLOCKED_BY_ME" ? "lock_open" : "block"
                    }
                    size={18}
                  />
                  <span className="font-body-sm text-body-sm">
                    {blockStatus === "BLOCKED_BY_ME"
                      ? `Bỏ chặn ${name}`
                      : "Chặn người dùng"}
                  </span>
                </div>
              )}

              <div
                onClick={() => toast.info("Gửi báo cáo sự cố thành công")}
                className="flex cursor-pointer items-center gap-space-sm rounded-xl p-space-xs text-error transition-colors hover:bg-surface-container"
              >
                <Icon name="report" size={18} />
                <span className="font-body-sm text-body-sm">Báo cáo sự cố</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
