// Kiểu dữ liệu khớp với các DTO của backend (Backend-Chat)

export type ApiResponse<T> = {
  status: "success" | "error";
  message: string;
  data: T;
};

export type User = {
  id: number;
  username: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
};
export type StoryStatus = {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  hasStory: boolean;
};
// Kết quả của /api/auth/login
export type LoginResponse = User & {
  accessToken: string;
  refreshToken: string;
};

export type ConversationType = "DIRECT" | "GROUP";

export type Conversation = {
  id: number;
  type: ConversationType;
  title: string | null;
  avatarUrl: string | null;
  lastMessage: string | null;
  lastMessageSenderId: number | null;
  lastMessageAt: string | null;
  unreadCount: number;
  createdBy: number;
  otherUserId?: number | null; // chat 1-1: id của đối phương (nhóm: null)
  blockStatus?: BlockStatus;
};

// NONE: bình thường; BLOCKED_BY_ME: mình đã chặn họ; BLOCKED_ME: họ đã chặn mình
export type BlockStatus = "NONE" | "BLOCKED_BY_ME" | "BLOCKED_ME";

export type MessageType = "TEXT" | "IMAGE" | "FILE" | "SYSTEM";

export type Attachment = {
  id: number;
  url: string;
  fileName?: string;
  resourceType: "image" | "raw";
  mimeType?: string;
  size?: number;
};

export type Message = {
  id: number;
  conversationId: number;
  senderId: number;
  sender?: User;
  content?: string;
  type: MessageType;
  attachments?: Attachment[];
  recalled?: boolean; // true = đã thu hồi (content + attachments đã bị xoá)
  createdAt: string;
  updatedAt: string;
};

// Kết quả của /api/message/{conversationId}: 1 trang tin nhắn, mới nhất trước
export type MessagePage = {
  messages: Message[];
  nextCursor: string | null; // gửi lại làm cursor để tải tin cũ hơn
  hasMore: boolean;
  seenBy: SeenInfo[]; // các thành viên khác đã xem đến thời điểm nào
};

// Thời điểm 1 thành viên xem cuộc trò chuyện lần cuối
export type SeenInfo = {
  userId: number;
  avatarUrl: string | null;
  lastSeenAt: string;
};

// Kết quả của /api/upload
export type UploadResult = {
  url: string;
  publicId: string;
  resourceType: "image" | "raw";
  mimeType: string;
  name: string;
  size: number;
};

// Quan hệ giữa mình và 1 người trong kết quả tìm kiếm
export type FriendRelation = "FRIEND" | "REQUEST_SENT" | "REQUEST_RECEIVED" | "NONE";

// Kết quả của /api/friend/search
export type FriendSearchResult = {
  id: number;
  username: string;
  avatarUrl: string | null;
  relation: FriendRelation;
  requestId: number | null; // REQUEST_RECEIVED: id lời mời để bấm "Chấp nhận"
  currentCity: string | null; // nơi sống: phân biệt người trùng tên
  hometown: string | null;
};

// ===== Trang cá nhân =====
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type OrganizationType = "SCHOOL" | "COMPANY";

// 1 trường / công ty trong danh mục dùng chung (giống "Trang" trên Facebook)
export type Organization = {
  id: number;
  name: string;
  type: OrganizationType;
  city: string | null;
  verified: boolean;
};

export type Education = {
  id: number;
  school: Organization;
  major: string | null;
  fromYear: number | null;
  toYear: number | null; // null = đang học
};

export type Work = {
  id: number;
  company: Organization;
  position: string | null;
  fromYear: number | null;
  toYear: number | null; // null = đang làm
};

// Gửi lên khi thêm / sửa học vấn hoặc công việc:
// chọn từ gợi ý -> organizationId; gõ tên mới -> organizationName (+ city) để tạo mới
export type ExperienceInput = {
  organizationId?: number;
  organizationName?: string;
  city?: string;
  major?: string;    // học vấn
  position?: string; // công việc
  fromYear?: number | null;
  toYear?: number | null;
};

export type UserProfile = {
  id: number;
  username: string;
  email?: string; // chỉ có khi xem hồ sơ của mình
  avatarUrl?: string | null;
  bio?: string | null;
  gender?: Gender | null;
  birthday?: string | null; // "2003-05-20"
  hometown?: string | null;
  currentCity?: string | null;
  educations: Education[];
  works: Work[];
  interests: string[];
  friendCount: number;
  mutualFriendCount: number;
  me: boolean;
  relation?: FriendRelation; // không có khi xem hồ sơ của mình
  requestId?: number;
};

export type UpdateProfileInput = {
  username?: string;
  bio?: string | null;
  gender?: Gender | null;
  birthday?: string | null;
  hometown?: string | null;
  currentCity?: string | null;
};

// ===== Thông báo (kết bạn) =====
export type NotificationType = "FRIEND_REQUEST" | "FRIEND_ACCEPTED";

export type AppNotification = {
  id: number;
  type: NotificationType;
  actor: { id: number; username: string; avatarUrl: string | null } | null; // người gây ra thông báo
  referenceId: number | null; // FRIEND_REQUEST: id lời mời
  read: boolean;
  createdAt: string;
};

// Kết quả của /api/notification: 1 trang thông báo, mới nhất trước
export type NotificationPage = {
  notifications: AppNotification[];
  nextCursor: number | null;
  hasMore: boolean;
  unreadCount: number;
};

// 1 người trong danh sách "Người đã chặn"
export type BlockedUser = {
  id: number;
  username: string | null;
  avatarUrl: string | null;
  blockedAt: string;
};

// 1 lời mời kết bạn mình nhận được (/api/friend/pending-requests)
export type FriendRequestItem = {
  id: number; // id lời mời -> Chấp nhận / Từ chối
  fromUserId: number;
  username: string | null;
  avatarUrl: string | null;
  currentCity: string | null;
  message: string | null;
  createdAt: string;
};
