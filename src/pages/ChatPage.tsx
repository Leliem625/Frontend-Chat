import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type UIEvent,
} from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "sonner";

import { ApiError } from "@/api/client";
import { getListFriend, sendFriendRequest } from "@/api/friend";
import {
  getMessages,
  markSeen,
  sendMessageContent,
  sendMessageFiles,
} from "@/api/message";
import { uploadFile, type LocalFile } from "@/api/upload";
import {
  ChatDateDivider,
  ChatEmptyConversation,
  ChatInputBar,
  ChatMessageItem,
  ChatProfileBar,
  ChatTypingIndicator,
  ImageViewerModal,
  type DirectMessageItemData,
} from "@/components/chat";
import { Spinner } from "@/components/common";
import { useAuth } from "@/context/auth";
import {
  emitTyping,
  useMessageSeen,
  useNewMessage,
  useOnlineUsers,
  useTyping,
} from "@/socket";
import type { Attachment, Message, SeenInfo } from "@/types/api";

const PAGE_SIZE = 15;

// Giới hạn giống backend (FileStorageServiceImpl, MessageServiceImpl)
const MAX_ATTACHMENTS = 10;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_FILE_SIZE = 20 * 1024 * 1024;

function showError(message: string) {
  toast.error("Không gửi được", { description: message });
}

// Chuyển tin nhắn từ backend -> dữ liệu hiển thị của ChatMessageItem
function mapMessageToUI(
  msg: Message,
  currentUserId: number | undefined,
  friendAvatar?: string
): DirectMessageItemData {
  const isMe = msg.senderId === currentUserId;
  return {
    id: String(msg.id),
    senderId: String(msg.senderId),
    createdAt: msg.createdAt,
    text: msg.content || undefined,
    attachments: msg.attachments,
    time: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    isMe,
    isSent: isMe,
    avatar: isMe ? undefined : msg.sender?.avatarUrl || friendAvatar,
  };
}

// File chọn từ máy -> LocalFile, kèm object URL để hiện ảnh ngay khi đang tải lên
function toLocalFiles(fileList: FileList | null): LocalFile[] {
  return Array.from(fileList ?? []).map((file) => ({
    uri: URL.createObjectURL(file),
    name: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    file,
  }));
}

// Array.prototype.findLastIndex cần ES2023, tự viết để không phải nâng target
function findLastIndex<T>(items: T[], predicate: (item: T) => boolean) {
  for (let i = items.length - 1; i >= 0; i--) {
    if (predicate(items[i])) return i;
  }
  return -1;
}

function revokeLocalFiles(files: LocalFile[]) {
  files.forEach((f) => URL.revokeObjectURL(f.uri));
}

export default function ChatPage() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { isOnline: checkIsOnline } = useOnlineUsers();

  // id = conversationId; name/avatar/userId = thông tin đối phương, truyền từ danh sách chat
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") ?? "";
  const avatar = searchParams.get("avatar") ?? "";
  const userId = searchParams.get("userId") ?? "";
  const isFriendParam = searchParams.get("isFriend") ?? "";

  // Thông tin đối phương (avatar rỗng -> Avatar tự hiện ảnh mặc định)
  const friendName = name || "Người dùng";
  const friendAvatar = avatar || undefined;

  // Online phải kiểm tra theo userId của bạn bè, không phải conversationId
  const isUserOnline = checkIsOnline(userId);

  // Trạng thái bạn bè từ API (nếu param không truyền)
  const [isFriendFromApi, setIsFriendFromApi] = useState<boolean | null>(null);
  const [isFriendRequested, setIsFriendRequested] = useState(false);

  // Giá trị tính toán: ưu tiên param, sau đó đến kết quả tra cứu API
  const isFriend =
    isFriendParam === "true"
      ? true
      : isFriendParam === "false"
        ? false
        : (isFriendFromApi ?? true);

  useEffect(() => {
    // Nếu đã có param thì không cần tra cứu API
    if (isFriendParam === "true" || isFriendParam === "false") return;

    let active = true;
    getListFriend()
      .then((friends) => {
        if (!active || !Array.isArray(friends)) return;
        const matched = friends.some(
          (f) =>
            (userId && String(f.id) === String(userId)) ||
            (name && f.username.toLowerCase() === name.toLowerCase())
        );
        setIsFriendFromApi(matched);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [isFriendParam, userId, name]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Danh sách tin nhắn (cũ -> mới, tin mới nhất ở dưới cùng)
  const [messages, setMessages] = useState<DirectMessageItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  // Đối phương đã xem đến thời điểm nào (để hiện avatar dưới tin đã xem)
  const [seenBy, setSeenBy] = useState<SeenInfo[]>([]);

  // Ảnh đang xem toàn màn hình (null = không xem)
  const [viewingImage, setViewingImage] = useState<Attachment | null>(null);

  // Cuộn xuống tin mới nhất
  const scrollToEnd = useCallback((smooth = true) => {
    setTimeout(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    }, 50);
  }, []);

  // Chiều cao nội dung trước khi chèn tin cũ lên trên, để giữ nguyên vị trí đang xem
  const heightBeforePrepend = useRef<number | null>(null);
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || heightBeforePrepend.current == null) return;
    el.scrollTop += el.scrollHeight - heightBeforePrepend.current;
    heightBeforePrepend.current = null;
  }, [messages]);

  // Object URL của ảnh / file đang gửi, thu hồi khi rời màn hình
  const pendingObjectUrls = useRef(new Set<LocalFile>());
  useEffect(() => {
    const pending = pendingObjectUrls.current;
    return () => {
      revokeLocalFiles([...pending]);
      pending.clear();
    };
  }, []);

  // Đối phương đang soạn tin -> hiện dòng "đang soạn"
  // Phòng khi gói "dừng soạn" không tới (họ tắt tab, mất mạng): tự ẩn sau 5 giây
  const hideTypingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useTyping((data) => {
    if (!id || String(data.conversationId) !== String(id) || data.userId === user?.id) return;
    if (hideTypingTimeout.current) clearTimeout(hideTypingTimeout.current);
    setIsTyping(data.isTyping);
    if (data.isTyping) {
      hideTypingTimeout.current = setTimeout(() => setIsTyping(false), 5000);
      scrollToEnd();
    }
  });
  useEffect(
    () => () => {
      if (hideTypingTimeout.current) clearTimeout(hideTypingTimeout.current);
    },
    []
  );

  // Lần đầu vào màn hình: lấy 15 tin mới nhất rồi cuộn xuống cuối
  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      try {
        const page = await getMessages(id, PAGE_SIZE);
        if (!active) return;
        // Backend trả mới nhất trước -> đảo lại để tin cũ ở trên, tin mới ở dưới
        setMessages(
          [...page.messages]
            .reverse()
            .map((m) => mapMessageToUI(m, user?.id, friendAvatar))
        );
        setNextCursor(page.nextCursor);
        setHasMore(page.hasMore);
        setSeenBy(page.seenBy ?? []);
        scrollToEnd(false);
        // Mình vừa mở xem -> báo cho đối phương
        markSeen(id).catch((e) =>
          console.warn("Không đánh dấu đã xem được:", e)
        );
      } catch (error) {
        console.warn("Không tải được tin nhắn:", error);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, user?.id, friendAvatar, scrollToEnd]);

  // Đối phương mở xem cuộc trò chuyện này -> cập nhật ngay không cần tải lại
  useMessageSeen((data) => {
    if (!id || String(data.conversationId) !== String(id)) return;
    setSeenBy((prev) => [...prev.filter((s) => s.userId !== data.seen.userId), data.seen]);
  });

  // Có tin nhắn mới qua socket -> thêm vào cuối nếu chưa có
  useNewMessage((msg) => {
    if (!id || String(msg.conversationId) !== String(id)) return;
    setMessages((prev) =>
      prev.some((m) => m.id === String(msg.id))
        ? prev // tin mình vừa gửi, REST đã thêm rồi
        : [...prev, mapMessageToUI(msg, user?.id, friendAvatar)]
    );
    if (msg.senderId !== user?.id) {
      // Họ đã gửi xong -> ẩn "đang soạn" (phòng gói dừng soạn đến muộn)
      setIsTyping(false);
      // Đang mở màn này nên coi như đã xem luôn
      markSeen(id).catch((e) => console.warn("Không đánh dấu đã xem được:", e));
    }
    scrollToEnd();
  });

  const lastMessage = messages[messages.length - 1];
  const seenAvatarByMessageId = new Map<string, string>();
  if (lastMessage?.isMe) {
    for (const seen of seenBy) {
      // So chuỗi ISO cùng định dạng của backend, tránh new Date() làm sai với phần giây lẻ 6 chữ số
      const index = findLastIndex(
        messages,
        (m) => m.isMe && !!m.createdAt && m.createdAt <= seen.lastSeenAt
      );
      if (index < 0) continue;
      const theyReplied = messages.slice(index + 1).some((m) => !m.isMe);
      const messageId = messages[index].id;
      if (!theyReplied && !seenAvatarByMessageId.has(messageId)) {
        // Chuỗi rỗng = đã xem nhưng không có ảnh -> hiện avatar mặc định
        seenAvatarByMessageId.set(
          messageId,
          seen.avatarUrl || friendAvatar || ""
        );
      }
    }
  }

  // Kéo lên gần đầu danh sách -> tải thêm tin cũ hơn và chèn lên trên
  const loadOlderMessages = useCallback(async () => {
    if (!id || !hasMore || !nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await getMessages(id, PAGE_SIZE, nextCursor);
      const older = [...page.messages]
        .reverse()
        .map((m) => mapMessageToUI(m, user?.id, friendAvatar));
      heightBeforePrepend.current = scrollRef.current?.scrollHeight ?? null;
      setMessages((prev) => [...older, ...prev]);
      setNextCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch (error) {
      console.warn("Không tải được tin nhắn cũ:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [id, hasMore, nextCursor, loadingMore, user?.id, friendAvatar]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop < 60) {
      loadOlderMessages();
    }
  };

  // Hành động điều hướng & tương tác
  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleCall = () => {
    console.log("Bắt đầu gọi thoại với:", friendName);
  };

  const handleVideoCall = () => {
    console.log("Bắt đầu gọi video với:", friendName);
  };

  const handleInfo = () => {
    console.log("Xem thông tin cuộc trò chuyện #", id);
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !id) return;

    // Hiện tin ngay lập tức (chưa có dấu "Đã gửi"), backend lưu xong mới thay bằng tin thật
    const tempId = `temp-${Date.now()}`;
    const tempMsg: DirectMessageItemData = {
      id: tempId,
      senderId: "me",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      isMe: true,
      isSent: false,
    };

    setMessages((prev) => [...prev, tempMsg]);
    setInputText("");
    scrollToEnd();

    try {
      const saved = await sendMessageContent(id, text);
      setMessages((prev) =>
        // Socket có thể đã thêm tin thật trước khi REST trả về -> chỉ bỏ tin tạm
        prev.some((m) => m.id === String(saved.id))
          ? prev.filter((m) => m.id !== tempId)
          : prev.map((m) =>
              m.id === tempId
                ? mapMessageToUI(saved, user?.id, friendAvatar)
                : m
            )
      );
    } catch (error) {
      // Gửi lỗi: bỏ tin tạm và trả lại nội dung vào ô nhập để gửi lại
      console.warn("Gửi tin nhắn thất bại:", error);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setInputText(text);
    }
  };

  const handleLike = () => {
    const likeMsg: DirectMessageItemData = {
      id: Date.now().toString(),
      senderId: "me",
      text: "👍",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
      isSent: true,
    };

    setMessages((prev) => [...prev, likeMsg]);
    scrollToEnd();
  };

  // Gửi ảnh / file: hiện ngay bằng ảnh trong máy, tải lên xong mới thay bằng tin thật
  const sendAttachments = async (files: LocalFile[]) => {
    if (!id || files.length === 0) return;

    if (files.length > MAX_ATTACHMENTS) {
      revokeLocalFiles(files);
      showError(`Chỉ được gửi tối đa ${MAX_ATTACHMENTS} file một lần.`);
      return;
    }
    const tooBig = files.find((f) =>
      f.mimeType.startsWith("image/")
        ? (f.size ?? 0) > MAX_IMAGE_SIZE
        : (f.size ?? 0) > MAX_FILE_SIZE
    );
    if (tooBig) {
      revokeLocalFiles(files);
      showError(`"${tooBig.name}" quá lớn (ảnh tối đa 5MB, file tối đa 20MB).`);
      return;
    }

    files.forEach((f) => pendingObjectUrls.current.add(f));
    const tempId = `temp-${Date.now()}`;
    const tempMsg: DirectMessageItemData = {
      id: tempId,
      senderId: "me",
      attachments: files.map((f, index) => ({
        id: -(index + 1),
        url: f.uri,
        fileName: f.name,
        resourceType: f.mimeType.startsWith("image/") ? "image" : "raw",
        mimeType: f.mimeType,
        size: f.size,
      })),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      isMe: true,
      isSent: false,
    };
    setMessages((prev) => [...prev, tempMsg]);
    scrollToEnd();

    try {
      const uploaded = await Promise.all(files.map(uploadFile));
      const saved = await sendMessageFiles(id, uploaded);
      setMessages((prev) =>
        // Socket có thể đã thêm tin thật trước khi REST trả về -> chỉ bỏ tin tạm
        prev.some((m) => m.id === String(saved.id))
          ? prev.filter((m) => m.id !== tempId)
          : prev.map((m) =>
              m.id === tempId ? mapMessageToUI(saved, user?.id, friendAvatar) : m
            )
      );
    } catch (error) {
      console.warn("Gửi ảnh / file thất bại:", error);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      showError(
        error instanceof ApiError ? error.message : "Không gửi được, vui lòng thử lại."
      );
    } finally {
      // Tin tạm đã bị thay / xoá -> không cần ảnh trong máy nữa
      files.forEach((f) => pendingObjectUrls.current.delete(f));
      revokeLocalFiles(files);
    }
  };

  // Chọn xong ảnh / file từ hộp thoại của trình duyệt
  const handleFilesSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const files = toLocalFiles(e.target.files);
    // Xoá giá trị để chọn lại đúng file đó lần sau vẫn nhận
    e.target.value = "";
    sendAttachments(files);
  };

  const handlePickPhoto = () => {
    photoInputRef.current?.click();
  };

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingSent = useRef(false);

  const handleChangeText = (text: string) => {
    setInputText(text); // việc 1: cập nhật ô nhập

    // việc 2: báo đang soạn, chỉ bắn 1 lần khi bắt đầu gõ
    if (!id) return;
    if (!isTypingSent.current) {
      emitTyping(id, true);
      isTypingSent.current = true;
    }

    // ngừng gõ 2 giây (hoặc xoá hết chữ) thì báo dừng
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    const stop = () => {
      emitTyping(id, false);
      isTypingSent.current = false;
    };
    if (!text) stop();
    else typingTimeout.current = setTimeout(stop, 2000);
  };

  const handleWave = () => {
    const waveMsg: DirectMessageItemData = {
      id: Date.now().toString(),
      senderId: "me",
      text: "👋",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
      isSent: true,
    };

    setMessages((prev) => [...prev, waveMsg]);
    scrollToEnd();
  };

  const handleAddFriend = async () => {
    if (!userId) {
      setIsFriendRequested(true);
      return;
    }
    try {
      await sendFriendRequest(Number(userId));
      setIsFriendRequested(true);
    } catch (error) {
      console.warn("Không gửi được lời mời kết bạn:", error);
      setIsFriendRequested(true);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface">
      {/* 2. Sub-bar thông tin bạn bè */}
      <ChatProfileBar
        name={friendName}
        avatar={friendAvatar}
        isOnline={isUserOnline}
        onBack={handleBack}
        onCall={handleCall}
        onVideoCall={handleVideoCall}
        onInfo={handleInfo}
      />

      {/* 3. Vùng hiển thị tin nhắn (Chat Timeline) */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4"
      >
        {/* Trạng thái tải tin nhắn ban đầu */}
        {loading ? (
          <div className="flex flex-1 items-center justify-center py-20 text-primary">
            <Spinner size={32} />
          </div>
        ) : messages.length === 0 ? (
          /* Hiển thị khi chưa có tin nhắn nào: Avatar, Tên và trạng thái quan hệ bạn bè */
          <ChatEmptyConversation
            name={friendName}
            avatar={friendAvatar}
            isFriend={isFriend}
            onAddFriend={handleAddFriend}
            onWave={handleWave}
            isFriendRequested={isFriendRequested}
          />
        ) : (
          <>
            {loadingMore && (
              <div className="flex items-center justify-center py-3 text-primary">
                <Spinner size={20} />
              </div>
            )}

            {/* Dải phân cách ngày */}
            <ChatDateDivider label="Hôm nay, 14:20" />

            {/* Danh sách tin nhắn */}
            <div className="flex flex-col">
              {messages.map((msg) => (
                <ChatMessageItem
                  key={msg.id}
                  message={{
                    ...msg,
                    isSent: msg.isSent && msg.id === lastMessage?.id,
                    seenAvatar: seenAvatarByMessageId.get(msg.id),
                  }}
                  onImagePress={(image) => setViewingImage(image)}
                />
              ))}
            </div>

            {/* Trạng thái đang soạn tin nhắn */}
            {isTyping && (
              <ChatTypingIndicator
                avatar={friendAvatar}
                name={friendName}
                visible={isTyping}
              />
            )}
          </>
        )}
      </div>

      {/* 4. Khung nhập tin nhắn dưới cùng */}
      <ChatInputBar
        value={inputText}
        onChangeText={handleChangeText}
        onSend={handleSend}
        onLike={handleLike}
        onAttach={handleAttach}
        onPickPhoto={handlePickPhoto}
        onEmojiPress={() => console.log("Chọn emoji")}
      />

      {/* Hộp thoại chọn ảnh / file của trình duyệt (ẩn, bấm nút ở ô nhập để mở) */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFilesSelected}
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={handleFilesSelected}
      />

      {/* Xem ảnh toàn màn hình + nút tải về */}
      <ImageViewerModal
        image={viewingImage}
        onClose={() => setViewingImage(null)}
      />
    </div>
  );
}
