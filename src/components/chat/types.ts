import type { Attachment } from "@/types/api";

export interface ChatReaction {
  emoji: string;
  count?: number;
}

export interface DirectMessageItemData {
  id: string;
  senderId: string;
  text?: string;
  time: string;
  isMe: boolean;
  avatar?: string | null;
  mediaUrl?: string | null;
  attachments?: Attachment[]; // Ảnh / file đính kèm
  locationName?: string | null;
  reactions?: ChatReaction[];
  isSent?: boolean;
  seenAvatar?: string | null;
  seenTime?: string | null;
  createdAt?: string; // Thời gian gốc từ backend, dùng để so với lúc đối phương xem
}
