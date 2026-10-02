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
};

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
  createdAt: string;
  updatedAt: string;
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
