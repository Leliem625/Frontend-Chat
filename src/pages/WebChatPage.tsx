import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { getConversations } from "@/api/conversation";
import { getListFriend } from "@/api/friend";
import { blockUser, unblockUser } from "@/api/block";
import {
  getMessages,
  markSeen,
  recallMessage,
  sendMessageContent,
  sendMessageFiles,
} from "@/api/message";
import { uploadFile, type LocalFile } from "@/api/upload";
import { WebChatEmptyState } from "@/components/chat/WebChatEmptyState";
import { WebChatInfoSidebar } from "@/components/chat/WebChatInfoSidebar";
import { WebChatPane } from "@/components/chat/WebChatPane";
import type { DirectMessageItemData } from "@/components/chat/types";
import { WebConversationList } from "@/components/conversation/WebConversationList";
import type { ConversationItemData } from "@/components/conversation/types";
import type { StoryItem } from "@/components/story/types";
import { useAuth } from "@/context/auth";
import {
  emitTyping,
  useBlockChanged,
  useConversationRead,
  useMessageRecalled,
  useMessageSeen,
  useNewMessage,
  useOnlineUsers,
  useTyping,
} from "@/socket";
import type { Attachment, BlockStatus, Conversation, Message, SeenInfo, UploadResult, User } from "@/types/api";
import { formatConversationTime } from "@/utils/date";

const PAGE_SIZE = 20;

const DEFAULT_MESSAGES: Record<string, DirectMessageItemData[]> = {
  "3": [
    {
      id: "m1",
      senderId: "3",
      text: "Alo bạn ơi, dự án client vừa chốt bản prototype xong rồi! 🎉",
      time: "10:35",
      isMe: false,
    },
    {
      id: "m2",
      senderId: "3",
      text: "Mọi người khen animation mượt và tốc độ phản hồi rất tốt.",
      time: "10:35",
      isMe: false,
    },
    {
      id: "m3",
      senderId: "me",
      text: "Tuyệt vời quá! Đội ngũ dev thức trắng đêm hôm qua xứng đáng công sức bỏ ra rồi 🚀",
      time: "10:38",
      isMe: true,
      isSent: true,
      status: "sent",
      replyTo: {
        senderName: "Nguyễn Hoàng Nam",
        text: "Alo bạn ơi, dự án client vừa chốt...",
      },
    },
    {
      id: "m4",
      senderId: "3",
      text: "View quán cafe hôm nay đây, siêu chill luôn!",
      time: "10:40",
      isMe: false,
      attachments: [
        {
          id: 101,
          url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxZIJRLX6qN0vvFdQQm1cshEuVbYnEs4QFTE53Ay7wLPUeVbuUiTAod9ryjmcs4zYDblczmZ7_TDjp64QESvMd9BXEySRUKU2T7ZZFZZGC3YkTkzMHsIz9nMpZjSt6BFCtdpSC3430KQ7taaxrHUPNKVUsdJ15CIo06TdY3pP1iaEyDFdjq91F2k6QCHzZtT1mdO93iazKTzVrlaGhsddC4taLfYJ4JwRtjp-dQ7_hhxdd1jp45zE5",
          resourceType: "image",
          fileName: "cafe-view.jpg",
        },
      ],
    },
    {
      id: "m5",
      senderId: "me",
      time: "10:41",
      createdAt: "2026-10-15T10:41:00.000Z",
      isMe: true,
      isSent: true,
      status: "sent",
      seenAvatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD652T6OBKeQqQDucopa7u1I4b0kCECGftKSOX9r3C2OZFedflOMBMSgSLmH3JBu90AEVY09hT9iUKQQw_11aK9Fgrxv-aZr4cvCfB9qhkz2OB9Y7Z_zA440wua9sBVLcOrqpjiwiT_yyO3UVs4hgfHuNgzPJK4y7rNK-F1EPCfLD2xVKmnrqJIS1fDh5Mw7lcjwey20IVEyC8a-EIuTNQQGb_d_Vcjgrompk1IUIsOs_74NQWWxMqs",
      seenTime: "10:41",
      audioNote: {
        current: "0:24",
        duration: "0:45",
      },
    },
    {
      id: "m6",
      senderId: "3",
      text: "Tối nay qua Landmark 81 uống cafe nha ông ơi! 7h tối nhé?",
      time: "10:42",
      isMe: false,
    },
  ],
};

function mapMessageToUI(
  msg: Message,
  currentUserId?: number,
  fallbackAvatar?: string
): DirectMessageItemData {
  const isMe = currentUserId != null && msg.senderId === currentUserId;
  return {
    id: String(msg.id),
    senderId: String(msg.senderId),
    createdAt: msg.createdAt,
    text: msg.recalled ? undefined : msg.content || undefined,
    attachments: msg.recalled ? undefined : msg.attachments,
    isRecalled: Boolean(msg.recalled),
    time: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    isMe,
    isSent: isMe,
    status: isMe ? "sent" : undefined,
    avatar: isMe ? undefined : msg.sender?.avatarUrl || fallbackAvatar,
  };
}

function mapConversationToUI(
  conv: Conversation,
  currentUserId?: number,
  friendList: User[] = []
): ConversationItemData {
  const isMe = currentUserId && conv.lastMessageSenderId === currentUserId;
  const isGroup = conv.type === "GROUP";

  // Id đối phương lấy từ backend (otherUserId). Trước đây dò trong danh sách bạn bè theo tên
  // -> sai khi trùng tên, và mất luôn khi huỷ kết bạn (không mở được trang cá nhân)
  const otherUserId = !isGroup ? (conv.otherUserId ?? undefined) : undefined;
  const isFriend = otherUserId != null && friendList.some((f) => f.id === otherUserId);

  return {
    id: String(conv.id),
    name: conv.title || (isGroup ? "Nhóm trò chuyện" : "Người dùng"),
    avatar: conv.avatarUrl ?? undefined,
    isGroup,
    lastMessage: conv.lastMessage || "Chưa có tin nhắn nào",
    senderPrefix: isMe ? "Bạn:" : undefined,
    time: formatConversationTime(conv.lastMessageAt),
    unreadCount: conv.unreadCount > 0 ? conv.unreadCount : undefined,
    isUnread: conv.unreadCount > 0,
    category: isGroup ? "group" : "direct",
    userId: otherUserId,
    isFriend,
    blockStatus: conv.blockStatus ?? "NONE",
  };
}

export default function WebChatPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOnline } = useOnlineUsers();

  const [conversations, setConversations] = useState<ConversationItemData[]>(
    []
  );
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [friends, setFriends] = useState<User[]>([]);

  // selectedId bắt nguồn từ param URL `id` (rỗng khi mới vào chưa chọn cuộc trò chuyện nào)
  const selectedId = id ?? "";

  const [messages, setMessages] = useState<DirectMessageItemData[]>(
    selectedId && DEFAULT_MESSAGES[selectedId]
      ? DEFAULT_MESSAGES[selectedId]
      : []
  );
  const [seenBy, setSeenBy] = useState<SeenInfo[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Tìm cuộc trò chuyện đang được chọn
  const activeConversation = conversations.find((c) => c.id === selectedId);

  // Danh bạ bạn bè đang hoạt động cho carousel
  const onlineStories: StoryItem[] = friends
    .filter((f) => isOnline(f.id))
    .map((f) => ({
      id: String(f.id),
      name: f.username,
      avatar: f.avatarUrl ?? "",
      isOnline: true,
      hasStory: false,
    }));

  const displayedStories: StoryItem[] =
    onlineStories.length > 0 ? onlineStories : [];

  // Tải danh sách cuộc trò chuyện và bạn bè từ Backend
  const loadConversations = useCallback(async () => {
    let loadedFriends: User[] = [];
    try {
      const friendData = await getListFriend();
      if (Array.isArray(friendData)) {
        loadedFriends = friendData;
        setFriends(loadedFriends);
      }
    } catch {
      // Dùng mock nếu chưa kết nối
    }

    try {
      const data = await getConversations();
      if (Array.isArray(data) && data.length > 0) {
        setConversations(
          data.map((c) => mapConversationToUI(c, user?.id, loadedFriends))
        );
      }
    } catch {
      // Dùng mock
    } finally {
      setLoadingConversations(false);
    }
  }, [user?.id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- tải dữ liệu ban đầu
    loadConversations();
  }, [loadConversations]);

  // Tải tin nhắn của cuộc trò chuyện được chọn
  useEffect(() => {
    if (!selectedId) return;

    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingMessages(true);

    getMessages(selectedId, PAGE_SIZE)
      .then((page) => {
        if (!active) return;
        if (page.messages && page.messages.length > 0) {
          setMessages(
            [...page.messages]
              .reverse()
              .map((m) =>
                mapMessageToUI(m, user?.id, activeConversation?.avatar)
              )
          );
        } else if (DEFAULT_MESSAGES[selectedId]) {
          setMessages(DEFAULT_MESSAGES[selectedId]);
        } else {
          setMessages([]);
        }
        setSeenBy(page.seenBy ?? []);
        setNextCursor(page.nextCursor);
        setHasMore(page.hasMore);
        markSeen(selectedId).catch(() => {});
      })
      .catch(() => {
        if (DEFAULT_MESSAGES[selectedId]) {
          setMessages(DEFAULT_MESSAGES[selectedId]);
        } else {
          setMessages([]);
        }
        setSeenBy([]);
      })
      .finally(() => {
        if (active) setLoadingMessages(false);
      });

    return () => {
      active = false;
    };
  }, [selectedId, user?.id, activeConversation?.avatar]);

  // ===== Socket: tin nhắn mới, đang soạn, đã xem, đã đọc =====

  useNewMessage((msg) => {
    const isMine = msg.senderId === user?.id;
    const preview =
      msg.content ||
      (msg.type === "IMAGE"
        ? "[Hình ảnh]"
        : msg.type === "FILE"
          ? "[Tệp đính kèm]"
          : "");

    // Đang mở đúng cuộc trò chuyện này thì coi như đã đọc, không tăng badge
    const isOpen = String(msg.conversationId) === String(selectedId);

    setConversations((prev) => {
      const target = prev.find((c) => c.id === String(msg.conversationId));
      if (!target) return prev;
      const unread = isMine || isOpen ? 0 : (target.unreadCount ?? 0) + 1;
      const updated: ConversationItemData = {
        ...target,
        lastMessage: preview,
        senderPrefix: isMine ? "Bạn:" : undefined,
        time: formatConversationTime(msg.createdAt),
        unreadCount: unread > 0 ? unread : undefined,
        isUnread: unread > 0,
      };
      return [updated, ...prev.filter((c) => c.id !== target.id)];
    });

    if (String(msg.conversationId) === String(selectedId)) {
      setMessages((prev) => {
        const msgIdStr = String(msg.id);
        // 1. Đã có tin nhắn này rồi thì bỏ qua
        if (prev.some((m) => m.id === msgIdStr)) {
          return prev;
        }

        // 2. Nếu là tin nhắn của chính mình, thay thế tin nhắn optimistic tạm thời (temp-...)
        if (isMine) {
          const hasAttachments = Boolean(msg.attachments && msg.attachments.length > 0);
          const tempIndex = prev.findIndex((m) => {
            if (!m.id.startsWith("temp-")) return false;
            if (hasAttachments) {
              return Boolean(m.attachments && m.attachments.length > 0);
            }
            return (
              (msg.content && m.text === msg.content) ||
              (!msg.content && !m.text)
            );
          });
          if (tempIndex !== -1) {
            const updated = [...prev];
            updated[tempIndex] = {
              ...mapMessageToUI(
                msg,
                user?.id,
                activeConversation?.avatar
              ),
              status: "sent",
            };
            return updated;
          }
        }

        // 3. Thêm tin nhắn mới
        return [
          ...prev,
          mapMessageToUI(msg, user?.id, activeConversation?.avatar),
        ];
      });
      if (!isMine) {
        setIsTyping(false);
        markSeen(selectedId).catch(() => {});
      }
    }
  });

  useTyping((data) => {
    if (
      String(data.conversationId) === String(selectedId) &&
      data.userId !== user?.id
    ) {
      setIsTyping(data.isTyping);
    }
  });

  useMessageSeen((data) => {
    if (String(data.conversationId) !== String(selectedId)) return;
    const seenInfo = data.seen;
    setSeenBy((prev) => [
      ...prev.filter((s) => s.userId !== seenInfo.userId),
      seenInfo,
    ]);
  });

  // Mình đã đọc cuộc trò chuyện (ở tab / thiết bị này hoặc nơi khác) -> xoá badge chưa đọc
  useConversationRead((data) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === String(data.conversationId)
          ? { ...c, unreadCount: undefined, isUnread: false }
          : c
      )
    );
  });

  // ===== Thu hồi tin nhắn =====
  const markRecalled = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, isRecalled: true, text: undefined, attachments: undefined } : m
      )
    );
  };

  const handleRecallMessage = async (messageId: string) => {
    await recallMessage(messageId);
    markRecalled(messageId);
    // Tin cuối cùng bị thu hồi -> sửa dòng xem trước ở danh sách
    if (messages[messages.length - 1]?.id === messageId && selectedId) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === String(selectedId) ? { ...c, lastMessage: "Tin nhắn đã được thu hồi" } : c
        )
      );
    }
  };

  // Người khác (hoặc mình ở tab khác) thu hồi -> cập nhật ngay
  useMessageRecalled((msg) => {
    if (String(msg.conversationId) === String(selectedId)) {
      markRecalled(String(msg.id));
    }
    setConversations((prev) =>
      prev.map((c) =>
        c.id === String(msg.conversationId) &&
        String(msg.conversationId) === String(selectedId) &&
        messages[messages.length - 1]?.id === String(msg.id)
          ? { ...c, lastMessage: "Tin nhắn đã được thu hồi" }
          : c
      )
    );
  });

  // ===== Chặn / bỏ chặn =====
  const setBlockStatusOf = (userId: number | string, blockStatus: BlockStatus) => {
    setConversations((prev) =>
      prev.map((c) =>
        String(c.userId) === String(userId)
          ? { ...c, blockStatus, isFriend: blockStatus === "NONE" ? c.isFriend : false }
          : c
      )
    );
  };

  const handleToggleBlock = async () => {
    const partnerId = activeConversation?.userId;
    if (!partnerId || !activeConversation) return;
    try {
      if (activeConversation.blockStatus === "BLOCKED_BY_ME") {
        await unblockUser(Number(partnerId));
        setBlockStatusOf(partnerId, "NONE");
        toast.success(`Đã bỏ chặn ${activeConversation.name}`);
      } else {
        if (
          !window.confirm(
            `Chặn ${activeConversation.name}? Hai bạn sẽ không nhắn tin, tìm thấy hay thấy trạng thái online của nhau, và sẽ tự huỷ kết bạn.`
          )
        )
          return;
        await blockUser(Number(partnerId));
        setBlockStatusOf(partnerId, "BLOCKED_BY_ME");
        toast.success(`Đã chặn ${activeConversation.name}`);
      }
    } catch (e: any) {
      toast.error("Không thực hiện được", { description: e?.message });
    }
  };

  // Chặn / bỏ chặn ở tab / thiết bị khác của mình -> đồng bộ
  useBlockChanged((data) => {
    setBlockStatusOf(data.userId, data.blocked ? "BLOCKED_BY_ME" : "NONE");
  });

  // Chuyển cuộc trò chuyện khi bấm vào danh sách
  const handleSelectConversation = (convId: string) => {
    // Xoá badge ngay khi bấm, không chờ API (backend xác nhận lại qua socket "conversation_read")
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId ? { ...c, unreadCount: undefined, isUnread: false } : c
      )
    );
    navigate(`/chat/${convId}`);
  };

  // Gửi tin nhắn văn bản
  const handleSendMessage = async (text: string) => {
    if (!selectedId) return;

    const optimisticId = `temp-${Date.now()}`;
    const optimisticMsg: DirectMessageItemData = {
      id: optimisticId,
      senderId: String(user?.id ?? "me"),
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      isMe: true,
      isSent: true,
      status: "sending",
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    // Cập nhật danh sách cuộc trò chuyện ngay lập tức
    setConversations((prev) => {
      const target = prev.find((c) => c.id === String(selectedId));
      if (!target) return prev;
      const updated: ConversationItemData = {
        ...target,
        lastMessage: text,
        senderPrefix: "Bạn:",
        time: "Vừa xong",
      };
      return [updated, ...prev.filter((c) => c.id !== target.id)];
    });

    try {
      const res = await sendMessageContent(selectedId, text);
      if (res) {
        setMessages((prev) => {
          const realIdStr = String(res.id);
          // Nếu socket đã nhanh hơn thêm tin nhắn thật vào rồi, chỉ cần xoá tin optimistic
          const alreadyAddedBySocket = prev.some((m) => m.id === realIdStr);
          if (alreadyAddedBySocket) {
            return prev.filter((m) => m.id !== optimisticId);
          }
          // Ngược lại, thay thế tin optimistic bằng tin thật trả về từ API
          return prev.map((m) =>
            m.id === optimisticId
              ? {
                  ...mapMessageToUI(res, user?.id, activeConversation?.avatar),
                  status: "sent",
                }
              : m
          );
        });
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticId
            ? {
                ...m,
                status: "failed",
                errorMessage: "Gửi lỗi",
                onRetry: () => handleSendMessage(text),
              }
            : m
        )
      );
    }
  };

  // Gửi file đính kèm (Optimistic UI: Đưa ngay vào chat, tải ngầm và hiển thị trạng thái)
  const handleSendFiles = async (fileList: FileList) => {
    if (!selectedId) return;

    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;

    // 1. Tạo danh sách file hiển thị tức thì (Optimistic Attachments)
    const optimisticAttachments: Attachment[] = filesArray.map((f, idx) => ({
      id: -(Date.now() + idx),
      url: URL.createObjectURL(f),
      fileName: f.name,
      resourceType: f.type.startsWith("image/") ? "image" : "raw",
      mimeType: f.type,
      size: f.size,
    }));

    const optimisticId = `temp-${Date.now()}`;
    const optimisticMsg: DirectMessageItemData = {
      id: optimisticId,
      senderId: String(user?.id ?? "me"),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      isMe: true,
      isSent: false,
      status: "sending",
      attachments: optimisticAttachments,
    };

    // 2. Thêm ngay vào khung chat
    setMessages((prev) => [...prev, optimisticMsg]);

    // 3. Cập nhật preview cuộc trò chuyện ở sidebar
    const hasImages = optimisticAttachments.some((a) => a.resourceType === "image");
    const previewText = hasImages
      ? optimisticAttachments.length === 1
        ? "[Hình ảnh]"
        : `[${optimisticAttachments.length} hình ảnh]`
      : optimisticAttachments.length === 1
      ? `[Tệp: ${optimisticAttachments[0].fileName || "đính kèm"}]`
      : `[${optimisticAttachments.length} tệp đính kèm]`;

    setConversations((prev) => {
      const target = prev.find((c) => c.id === String(selectedId));
      if (!target) return prev;
      const updated: ConversationItemData = {
        ...target,
        lastMessage: previewText,
        senderPrefix: "Bạn:",
        time: "Vừa xong",
      };
      return [updated, ...prev.filter((c) => c.id !== target.id)];
    });

    // 4. Hàm thực hiện tải lên ngầm và gửi
    const doUploadAndSend = async () => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticId
            ? { ...m, status: "sending", errorMessage: undefined }
            : m
        )
      );

      try {
        // Tải các file lên server (Cloudinary) song song
        const uploaded: UploadResult[] = await Promise.all(
          filesArray.map((f) => {
            const localFile: LocalFile = {
              uri: URL.createObjectURL(f),
              name: f.name,
              mimeType: f.type,
              size: f.size,
              file: f,
            };
            return uploadFile(localFile);
          })
        );

        const res = await sendMessageFiles(selectedId, uploaded);
        if (res) {
          setMessages((prev) => {
            const realIdStr = String(res.id);
            if (prev.some((m) => m.id === realIdStr)) {
              return prev.filter((m) => m.id !== optimisticId);
            }
            return prev.map((m) =>
              m.id === optimisticId
                ? {
                    ...mapMessageToUI(res, user?.id, activeConversation?.avatar),
                    status: "sent",
                  }
                : m
            );
          });
        }
      } catch (error) {
        console.error("Gửi file thất bại:", error);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticId
              ? {
                  ...m,
                  status: "failed",
                  errorMessage: "Gửi lỗi",
                  onRetry: () => doUploadAndSend(),
                }
              : m
          )
        );
        toast.error("Gửi file thất bại, vui lòng nhấn Thử lại.");
      }
    };

    doUploadAndSend();
  };

  // Báo trạng thái gõ phím
  const handleTypingStatus = (typing: boolean) => {
    if (!selectedId) return;
    emitTyping(selectedId, typing);
  };

  // Tải thêm tin nhắn cũ
  const handleLoadOlder = async () => {
    if (!selectedId || !hasMore || !nextCursor) return;
    try {
      const page = await getMessages(selectedId, PAGE_SIZE, nextCursor);
      const older = [...page.messages]
        .reverse()
        .map((m) => mapMessageToUI(m, user?.id, activeConversation?.avatar));
      setMessages((prev) => [...older, ...prev]);
      setNextCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch {
      // Ignored
    }
  };

  // Có cuộc trò chuyện thật thì dùng đúng tên / avatar backend trả (avatar null -> avatar mặc định,
  // vd tài khoản đã chặn mình); ảnh mẫu chỉ dùng cho dữ liệu demo khi chưa có cuộc trò chuyện
  const partnerName = activeConversation?.name || "Nguyễn Hoàng Nam";
  const partnerAvatar = activeConversation
    ? activeConversation.avatar
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuD652T6OBKeQqQDucopa7u1I4b0kCECGftKSOX9r3C2OZFedflOMBMSgSLmH3JBu90AEVY09hT9iUKQQw_11aK9Fgrxv-aZr4cvCfB9qhkz2OB9Y7Z_zA440wua9sBVLcOrqpjiwiT_yyO3UVs4hgfHuNgzPJK4y7rNK-F1EPCfLD2xVKmnrqJIS1fDh5Mw7lcjwey20IVEyC8a-EIuTNQQGb_d_Vcjgrompk1IUIsOs_74NQWWxMqs";
  // Online chỉ có với bạn bè (backend chỉ gửi trạng thái online của bạn bè)
  const partnerOnline =
    activeConversation?.isOnline ||
    (activeConversation?.userId ? isOnline(activeConversation.userId) : false);

  // Gắn avatar đã xem (seenAvatar) vào tin nhắn tương ứng của mình (Facebook Messenger style)
  const displayMessages = useMemo(() => {
    if (messages.length === 0) return messages;

    const result = messages.map((m) => ({ ...m }));

    if (seenBy.length > 0) {
      for (const seen of seenBy) {
        // Tìm tin nhắn mới nhất của tôi được đối phương xem (createdAt <= seen.lastSeenAt)
        let lastSeenIndex = -1;
        for (let i = result.length - 1; i >= 0; i--) {
          const m = result[i];
          if (m.isMe && m.createdAt && m.createdAt <= seen.lastSeenAt) {
            lastSeenIndex = i;
            break;
          }
        }
        if (lastSeenIndex !== -1) {
          // Chỉ gắn avatar đã xem nếu sau tin nhắn đó đối phương chưa gửi tin mới
          const theyRepliedAfter = result
            .slice(lastSeenIndex + 1)
            .some((m) => !m.isMe);
          if (!theyRepliedAfter) {
            result[lastSeenIndex].seenAvatar =
              seen.avatarUrl || partnerAvatar || "";
            result[lastSeenIndex].seenTime = formatConversationTime(seen.lastSeenAt);
          }
        }
      }
    }

    return result;
  }, [messages, seenBy, partnerAvatar]);

  return (
    <div className="flex h-full w-full overflow-hidden bg-surface-container-lowest">
      {/* 1. Left Panel: Conversations List */}
      <div
        className={`${
          id ? "hidden md:flex" : "flex"
        } h-full w-full shrink-0 md:w-80 lg:w-[350px]`}
      >
        <WebConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelectConversation={handleSelectConversation}
          onlineFriends={displayedStories}
          onSelectFriend={(f) => {
            const matched = conversations.find(
              (c) => c.name.toLowerCase() === f.name.toLowerCase()
            );
            if (matched) {
              handleSelectConversation(matched.id);
            } else {
              toast.info(`Bắt đầu chat với ${f.name}`);
            }
          }}
          loading={loadingConversations}
          onNewChat={() => toast.info("Tạo cuộc trò chuyện mới")}
        />
      </div>

      {/* 2. Central Panel: Active Chat Pane or Empty State */}
      <div
        className={`${
          !selectedId ? "hidden md:flex" : "flex"
        } h-full w-full min-w-0 flex-1 flex-col`}
      >
        {selectedId ? (
          <WebChatPane
            conversationId={selectedId}
            name={partnerName}
            avatar={partnerAvatar}
            isOnline={partnerOnline}
            messages={displayMessages}
            loading={loadingMessages}
            hasMore={hasMore}
            onLoadOlder={handleLoadOlder}
            onSendMessage={handleSendMessage}
            onSendFiles={handleSendFiles}
            isTyping={isTyping}
            onTypingStatus={handleTypingStatus}
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            isSidebarOpen={isSidebarOpen}
            onBackMobile={() => navigate("/")}
            blockStatus={activeConversation?.blockStatus}
            onUnblock={handleToggleBlock}
            onRecallMessage={handleRecallMessage}
          />
        ) : (
          <WebChatEmptyState
            onNewChat={() => {
              if (conversations.length > 0) {
                handleSelectConversation(conversations[0].id);
              } else {
                toast.info("Tạo cuộc trò chuyện mới");
              }
            }}
          />
        )}
      </div>

      {/* 3. Right Panel: Chat Info Sidebar (chỉ hiện khi đã chọn cuộc trò chuyện) */}
      {selectedId && isSidebarOpen && (
        <div className="hidden h-full shrink-0 xl:flex">
          <WebChatInfoSidebar
            name={partnerName}
            avatar={partnerAvatar}
            isOnline={partnerOnline}
            messages={messages}
            onClose={() => setIsSidebarOpen(false)}
            blockStatus={activeConversation?.blockStatus}
            onToggleBlock={activeConversation?.userId && !activeConversation.isGroup ? handleToggleBlock : undefined}
            onViewProfile={
              activeConversation?.userId
                ? () => navigate(`/user/${activeConversation.userId}`)
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}
