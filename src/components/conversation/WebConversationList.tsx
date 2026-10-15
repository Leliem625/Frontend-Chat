import { useState } from "react";

import { Avatar, Icon, Spinner } from "@/components/common";
import { useOnlineUsers } from "@/socket";
import type { ConversationItemData, FilterType } from "./types";
import type { StoryItem } from "@/components/story/types";

export interface WebConversationListProps {
  conversations: ConversationItemData[];
  selectedId?: string;
  onSelectConversation: (id: string) => void;
  onlineFriends?: StoryItem[];
  onSelectFriend?: (friend: StoryItem) => void;
  loading?: boolean;
  onNewChat?: () => void;
}

export function WebConversationList({
  conversations,
  selectedId,
  onSelectConversation,
  onlineFriends = [],
  onSelectFriend,
  loading = false,
  onNewChat,
}: WebConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const { isOnline } = useOnlineUsers();

  const filteredConversations = conversations.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchMessage = item.lastMessage.toLowerCase().includes(q);
      if (!matchName && !matchMessage) return false;
    }

    if (activeFilter === "unread") {
      return item.isUnread || (item.unreadCount ?? 0) > 0;
    }
    if (activeFilter === "groups") {
      return item.isGroup && item.category === "group";
    }
    return true;
  });

  return (
    <section className="flex h-full w-full shrink-0 flex-col border-r border-slate-100 bg-surface-container-lowest shadow-[1px_0_12px_rgba(0,0,0,0.03)] md:w-80 lg:w-[350px]">
      {/* Header Area */}
      <div className="flex flex-col gap-space-md p-space-lg pb-space-sm">
        <div className="flex items-center justify-between">
          <h1 className="font-headline-md text-headline-md tracking-tight text-on-surface">
            Đoạn chat
          </h1>
          <div className="flex items-center gap-space-xs">
            <button
              type="button"
              aria-label="Menu tuỳ chọn"
              className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container"
            >
              <Icon name="more_horiz" size={20} />
            </button>
            <button
              type="button"
              onClick={onNewChat}
              aria-label="Soạn tin mới"
              className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container"
            >
              <Icon name="edit_square" size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center rounded-full bg-surface-container-low px-space-md py-space-xs text-on-surface-variant transition-colors focus-within:bg-surface-container-highest">
          <Icon name="search" size={20} className="mr-space-sm text-outline" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm trên Messenger..."
            className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-space-xs overflow-x-auto pt-1">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`rounded-full px-space-md py-1 font-label-md text-label-md transition-all ${
              activeFilter === "all"
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            Tất cả
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("unread")}
            className={`rounded-full px-space-md py-1 font-label-md text-label-md transition-all ${
              activeFilter === "unread"
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            Chưa đọc
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("groups")}
            className={`rounded-full px-space-md py-1 font-label-md text-label-md transition-all ${
              activeFilter === "groups"
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            Nhóm
          </button>
        </div>
      </div>

      {/* Active Friends Carousel / Avatar Row */}
      <div className="flex items-center gap-space-md overflow-x-auto px-space-lg py-space-sm scrollbar-none">
        {/* Story / Note Creation Button */}
        <div className="group flex shrink-0 cursor-pointer flex-col items-center gap-1">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-primary transition-colors group-hover:bg-primary-fixed">
            <Icon name="add" size={24} />
          </div>
          <span className="w-14 truncate text-center font-label-sm text-label-sm text-on-surface-variant">
            Ghi chú
          </span>
        </div>

        {/* Online Contacts */}
        {onlineFriends.map((f) => (
          <div
            key={f.id}
            onClick={() => onSelectFriend?.(f)}
            className="flex shrink-0 cursor-pointer flex-col items-center gap-1"
          >
            <div className="relative">
              <div className="h-12 w-12 overflow-hidden rounded-full shadow-sm ring-2 ring-surface-container-lowest">
                <Avatar uri={f.avatar} size={48} name={f.name} />
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-tertiary ring-2 ring-surface-container-lowest" />
            </div>
            <span className="w-14 truncate text-center font-label-sm text-label-sm text-on-surface">
              {f.name}
            </span>
          </div>
        ))}
      </div>

      {/* Conversations List */}
      <div className="flex-1 space-y-0.5 overflow-y-auto px-space-xs py-space-xs pb-16 md:pb-space-xs">
        {loading && conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-primary">
            <Spinner size={22} />
            <p className="mt-3 text-xs text-slate-400">
              Đang tải danh sách đoạn chat...
            </p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <p className="font-headline-sm text-sm font-semibold text-slate-700">
              Không tìm thấy đoạn chat nào
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Thử tìm kiếm tên khác hoặc chọn một liên hệ để bắt đầu trò chuyện.
            </p>
          </div>
        ) : (
          filteredConversations.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectConversation(item.id)}
                className={`relative flex cursor-pointer items-center gap-space-md rounded-2xl p-space-sm transition-colors ${
                  isSelected
                    ? "bg-surface-container-low"
                    : "hover:bg-surface-container-low"
                }`}
              >
                {/* Avatar with status indicator */}
                <div className="relative shrink-0">
                  <div className="h-12 w-12 overflow-hidden rounded-full shadow-sm">
                    <Avatar
                      uri={item.avatar}
                      size={48}
                      name={item.name}
                      isGroup={item.isGroup}
                    />
                  </div>
                  {(item.isOnline || isOnline(item.userId)) && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-tertiary ring-2 ring-surface-container-lowest" />
                  )}
                </div>

                {/* Info & Last message */}
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center justify-between">
                    <span className="truncate font-headline-sm text-[15px] font-semibold text-on-surface">
                      {item.name}
                    </span>
                    <span
                      className={`font-label-sm text-label-sm ${
                        item.isUnread ? "font-semibold text-primary" : "text-outline"
                      }`}
                    >
                      {item.time}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-space-sm">
                    <p
                      className={`truncate font-body-sm text-body-sm ${
                        item.isUnread
                          ? "font-semibold text-on-surface"
                          : "text-on-surface-variant"
                      }`}
                    >
                      {item.senderPrefix && (
                        <span className="font-medium text-on-surface">
                          {item.senderPrefix}{" "}
                        </span>
                      )}
                      {item.lastMessage}
                    </p>

                    {item.isUnread ? (
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                    ) : (
                      <Icon
                        name="check_circle"
                        size={16}
                        filled
                        className="shrink-0 text-tertiary"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
