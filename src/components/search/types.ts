export type SearchCategoryId =
  | "all"
  | "people"
  | "friends"
  | "suggestions"
  | "received" // lời mời kết bạn mình nhận được
  | "requests"; // lời mời mình đã gửi

export interface SearchCategoryItem {
  id: SearchCategoryId;
  label: string;
  icon: string;
}

export interface ProfileResultData {
  id: string;
  userId?: number;
  name: string;
  category?: string;
  followers?: string;
  handle: string;
  location?: string;
  mutualFriends?: string;
  avatar: string;
  relationshipStatus: "request_sent" | "request_received" | "friend" | "not_friend";
  requestId?: number; // request_received: id lời mời để bấm "Chấp nhận"
  isOnline?: boolean;
}

export interface PostResultData {
  id: string;
  authorName: string;
  authorAvatar: string;
  isAuthorOnline?: boolean;
  timeText: string;
  content: string;
  hashtags: string[];
  imageUrl?: string;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
}
