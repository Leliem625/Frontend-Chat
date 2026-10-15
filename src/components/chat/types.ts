import type { Attachment } from "@/types/api";

export interface ChatReaction {
  emoji: string;
  count?: number;
}

export interface QuotedReplyData {
  senderName: string;
  text: string;
}

export interface AudioNoteData {
  duration?: string;
  current?: string;
}

export type MessageDeliveryStatus = "sending" | "sent" | "failed";

export interface DirectMessageItemData {
  id: string;
  senderId: string;
  text?: string;
  time: string;
  isMe: boolean;
  avatar?: string | null;
  mediaUrl?: string | null;
  attachments?: Attachment[]; // Ảnh / file đính kèm
  replyTo?: QuotedReplyData;
  audioNote?: AudioNoteData;
  locationName?: string | null;
  reactions?: ChatReaction[];
  isSent?: boolean;
  status?: MessageDeliveryStatus;
  errorMessage?: string;
  onRetry?: () => void;
  seenAvatar?: string | null;
  seenTime?: string | null;
  createdAt?: string; // Thời gian gốc từ backend, dùng để so với lúc đối phương xem
  isRecalled?: boolean; // Tin đã thu hồi -> hiện "Tin nhắn đã được thu hồi", không còn nội dung / file
}
