import type { BlockStatus } from "@/types/api";

export type ConversationCategory = "direct" | "group" | "channel";

export interface ConversationItemData {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
  isOnline?: boolean;
  userId?: number | string;
  isGroup?: boolean;
  groupIcon?: string;
  lastMessage: string;
  senderPrefix?: string;
  time: string;
  unreadCount?: number;
  isUnread?: boolean;
  hasUnreadDot?: boolean;
  isRead?: boolean;
  hasAttachment?: boolean;
  attachmentThumbnail?: string;
  isMissedCall?: boolean;
  isSent?: boolean;
  category: ConversationCategory;
  isFriend?: boolean;
  blockStatus?: BlockStatus; // chat 1-1: đã chặn nhau -> khoá ô nhập tin nhắn
}

export type FilterType = "all" | "unread" | "groups" | "channels";
