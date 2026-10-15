export type FilterCategoryId =
  | "people"
  | "posts"
  | "groups"
  | "pages"
  | "photos"
  | "videos";

export interface FilterCategoryItem {
  id: FilterCategoryId;
  label: string;
  icon: string;
  badge?: string;
}

export type PersonRelationship =
  | "friend" // Bạn bè hiện tại
  | "not_friend" // Chưa kết bạn
  | "request_sent" // Đã gửi lời mời
  | "request_received" // Có lời mời kết bạn đang chờ phản hồi
  | "suggestion" // Gợi ý người có thể quen
  | "public_figure"; // Người theo dõi / người của công chúng

export interface MutualFriendsInfo {
  count: number;
  avatars?: string[];
  names?: string;
}

export interface PersonItemData {
  id: string;
  name: string;
  handle: string;
  headline: string;
  avatar: string;
  isOnline?: boolean;
  isVerified?: boolean;
  relationship: PersonRelationship;
  badgeText?: string;
  work?: string;
  location?: string;
  education?: string;
  interests?: string;
  followers?: string;
  cameraRole?: string;
  domainRole?: string;
  seniorRole?: string;
  mutualFriends?: MutualFriendsInfo;
  mutualGroupsCount?: number;
}
