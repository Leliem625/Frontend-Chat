import { MaterialIcons } from "@expo/vector-icons";

export type ConversationCategory = "direct" | "group" | "channel";

export interface ConversationItemData {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
  isOnline?: boolean;
  userId?: number | string;
  isGroup?: boolean;
  groupIcon?: keyof typeof MaterialIcons.glyphMap;
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
}

export type FilterType = "all" | "unread" | "groups" | "channels";
