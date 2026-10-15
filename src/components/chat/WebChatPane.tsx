import {
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type UIEvent,
  type ChangeEvent,
} from "react";
import { toast } from "sonner";

import { Avatar, Icon, Spinner } from "@/components/common";
import type { Attachment, BlockStatus } from "@/types/api";
import { ChatAttachments } from "./ChatAttachments";
import { ImageViewerModal } from "./ImageViewerModal";
import type { DirectMessageItemData } from "./types";

export interface WebChatPaneProps {
  conversationId: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  messages: DirectMessageItemData[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadOlder?: () => void;
  onSendMessage: (text: string) => Promise<void>;
  onSendFiles?: (files: FileList) => Promise<void>;
  isTyping?: boolean;
  onTypingStatus?: (typing: boolean) => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onBackMobile?: () => void;
  blockStatus?: BlockStatus; // đã chặn nhau -> thay ô nhập bằng thông báo
  onUnblock?: () => void; // bấm "Bỏ chặn" ngay tại ô nhập
  onRecallMessage?: (messageId: string) => Promise<void>; // thu hồi tin của mình
}

export function WebChatPane({
  conversationId,
  name,
  avatar,
  isOnline = false,
  messages,
  loading = false,
  hasMore = false,
  onLoadOlder,
  onSendMessage,
  onSendFiles,
  isTyping = false,
  onTypingStatus,
  onToggleSidebar,
  isSidebarOpen = true,
  onBackMobile,
  blockStatus = "NONE",
  onUnblock,
  onRecallMessage,
}: WebChatPaneProps) {
  const [inputText, setInputText] = useState("");
  // Tin nhắn đang mở menu "⋯" (thu hồi)
  const [menuMessageId, setMenuMessageId] = useState<string | null>(null);

  const handleRecall = async (messageId: string) => {
    setMenuMessageId(null);
    if (!onRecallMessage) return;
    if (!window.confirm("Thu hồi tin nhắn này với mọi người?")) return;
    try {
      await onRecallMessage(messageId);
    } catch (e: any) {
      toast.error("Không thu hồi được", { description: e?.message });
    }
  };
  const [sending, setSending] = useState(false);
  const [viewingImage, setViewingImage] = useState<Attachment | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sendingRef = useRef(false);

  // Quản lý vị trí cuộn: vào phòng thì nhảy ngay xuống đáy (không cuộn chậm từ trên xuống)
  const prevConversationIdRef = useRef<string>(conversationId);
  const prevMessagesLengthRef = useRef<number>(messages.length);
  const isInitialScrollDoneRef = useRef(false);
  const prevScrollHeightRef = useRef<number>(0);

  // Cuộn ngay xuống tin nhắn mới nhất khi mới mở cuộc trò chuyện
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Đổi cuộc trò chuyện khác -> reset cờ để nhảy ngay xuống đáy
    if (prevConversationIdRef.current !== conversationId) {
      prevConversationIdRef.current = conversationId;
      isInitialScrollDoneRef.current = false;
      prevMessagesLengthRef.current = 0;
      prevScrollHeightRef.current = 0;
    }

    // Lần đầu tải tin nhắn của hội thoại: Nhảy NGAY LẬP TỨC xuống đáy (không dùng smooth scroll)
    if (!isInitialScrollDoneRef.current && messages.length > 0) {
      el.scrollTop = el.scrollHeight;
      isInitialScrollDoneRef.current = true;
      prevMessagesLengthRef.current = messages.length;
      return;
    }

    // Nếu vừa tải thêm tin nhắn cũ ở phía trên (khi cuộn lên đỉnh):
    // Giữ nguyên vị trí cuộn của người dùng, không cho bị nhảy hay cuộn xuống đáy
    if (
      prevScrollHeightRef.current > 0 &&
      messages.length > prevMessagesLengthRef.current
    ) {
      const addedHeight = el.scrollHeight - prevScrollHeightRef.current;
      el.scrollTop = el.scrollTop + addedHeight;
      prevScrollHeightRef.current = 0;
      prevMessagesLengthRef.current = messages.length;
      return;
    }

    // Có tin nhắn mới được gửi / nhận ở cuối danh sách:
    if (messages.length > prevMessagesLengthRef.current) {
      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 180;
      if (isNearBottom) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
    } else if (isTyping) {
      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 180;
      if (isNearBottom) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
    }

    prevMessagesLengthRef.current = messages.length;
  }, [conversationId, messages, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

    if (onTypingStatus) {
      onTypingStatus(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        onTypingStatus(false);
      }, 2000);
    }
  };

  const handleSend = async () => {
    const textToSend = inputText.trim() || "👍";
    if (sendingRef.current) return;

    try {
      sendingRef.current = true;
      setSending(true);
      setInputText("");
      if (onTypingStatus) onTypingStatus(false);
      await onSendMessage(textToSend);
    } catch {
      toast.error("Không gửi được tin nhắn");
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Tránh gửi 2 lần khi gõ tiếng Việt (IME composition)
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Nếu ô nhập trống thì không gửi (chỉ nút bấm ngón tay cái mới gửi 👍)
      if (!inputText.trim()) return;
      handleSend();
    }
  };

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;

    // Không kích hoạt tải tin cũ nếu chưa xong bước cuộn xuống đáy ban đầu
    if (!isInitialScrollDoneRef.current) return;
    // Không kích hoạt nếu đang tải hoặc không còn tin cũ
    if (loading || !hasMore) return;

    // Khi người dùng chủ động cuộn lên gần đỉnh (dưới 40px)
    if (el.scrollTop < 40) {
      prevScrollHeightRef.current = el.scrollHeight;
      onLoadOlder?.();
    }
  };

  const handleSelectPhotos = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onSendFiles?.(files);
      e.target.value = "";
    }
  };

  const handleSelectFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onSendFiles?.(files);
      e.target.value = "";
    }
  };

  const hasText = inputText.trim().length > 0;

  return (
    <main className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-surface-container-lowest">
      {/* Hidden file pickers */}
      <input
        ref={photoInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleSelectPhotos}
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleSelectFiles}
      />

      {/* Header */}
      <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-100/80 bg-surface-container-lowest px-space-md shadow-[0_1px_4px_rgba(0,0,0,0.03)] md:px-space-lg">
        <div className="flex min-w-0 items-center gap-space-sm md:gap-space-md">
          {onBackMobile && (
            <button
              type="button"
              onClick={onBackMobile}
              className="mr-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container md:hidden"
            >
              <Icon name="arrow_back" size={22} />
            </button>
          )}

          <div className="relative shrink-0 cursor-pointer">
            <div className="h-10 w-10 overflow-hidden rounded-full shadow-sm">
              <Avatar uri={avatar} size={40} name={name} />
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-tertiary ring-2 ring-surface-container-lowest" />
            )}
          </div>

          <div className="min-w-0">
            <h2 className="font-headline-sm truncate text-headline-sm leading-tight text-on-surface">
              {name}
            </h2>
            {/* Bị chặn: không hiện trạng thái hoạt động (tài khoản như không còn hoạt động) */}
            {blockStatus !== "BLOCKED_ME" && (
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isOnline ? "bg-tertiary" : "bg-outline"
                  }`}
                />
                <span
                  className={`font-label-sm text-label-sm ${
                    isOnline ? "text-tertiary" : "text-outline"
                  }`}
                >
                  {isOnline ? "Đang hoạt động" : "Không hoạt động"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex shrink-0 items-center gap-0.5 text-primary md:gap-space-xs">
          <button
            type="button"
            title="Bắt đầu gọi thoại"
            onClick={() => toast.info(`Gọi thoại cho ${name}`)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-surface-container md:h-10 md:w-10"
          >
            <Icon name="call" size={22} />
          </button>
          <button
            type="button"
            title="Bắt đầu gọi video"
            onClick={() => toast.info(`Gọi video cho ${name}`)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-surface-container md:h-10 md:w-10"
          >
            <Icon name="videocam" size={22} />
          </button>
          <button
            type="button"
            title="Tìm kiếm trong cuộc trò chuyện"
            onClick={() => toast.info("Tìm kiếm trong cuộc trò chuyện")}
            className="hidden h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-surface-container sm:flex md:h-10 md:w-10"
          >
            <Icon name="search" size={22} />
          </button>
          <button
            type="button"
            title="Thông tin cuộc trò chuyện"
            onClick={onToggleSidebar}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors md:h-10 md:w-10 ${
              isSidebarOpen
                ? "bg-primary-container text-white"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <Icon name="info" size={22} />
          </button>
        </div>
      </header>

      {/* Message Stream Canvas */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex min-h-0 flex-1 flex-col space-y-space-md overflow-y-auto px-space-md py-space-lg md:px-space-xl"
      >
        {loading && (
          <div className="flex justify-center py-4">
            <Spinner size={20} />
          </div>
        )}

        {/* Timestamp Divider */}
        <div className="my-space-xs flex items-center justify-center">
          <span className="font-label-sm rounded-full bg-surface-container px-space-md py-0.5 text-label-sm text-on-surface-variant">
            Hôm nay
          </span>
        </div>

        {/* Message List */}
        {messages.map((m, index) => {
          const prevMsg = messages[index - 1];
          const nextMsg = messages[index + 1];

          const isFromSameSenderAsPrev =
            Boolean(prevMsg) &&
            prevMsg.isMe === m.isMe &&
            prevMsg.senderId === m.senderId;
          const isFromSameSenderAsNext =
            Boolean(nextMsg) &&
            nextMsg.isMe === m.isMe &&
            nextMsg.senderId === m.senderId;

          const isClusterStart = !isFromSameSenderAsPrev;
          const isClusterEnd = !isFromSameSenderAsNext;

          // Single image attachment
          const singleImage =
            m.attachments &&
            m.attachments.length === 1 &&
            m.attachments[0].resourceType === "image"
              ? m.attachments[0]
              : null;

          const otherAttachments =
            m.attachments && (!singleImage || m.attachments.length > 1)
              ? m.attachments
              : null;

          // Tin đã thu hồi: không còn nội dung / file, chỉ hiện dòng thông báo
          if (m.isRecalled) {
            return (
              <div
                key={m.id}
                className={`flex max-w-xl items-end gap-space-sm ${m.isMe ? "ml-auto flex-row-reverse" : ""}`}
              >
                {!m.isMe &&
                  (isClusterEnd ? (
                    <div className="mb-1 h-7 w-7 shrink-0 overflow-hidden rounded-full shadow-sm">
                      <Avatar uri={m.avatar || avatar} size={28} name={name} />
                    </div>
                  ) : (
                    <div className="w-7 shrink-0" />
                  ))}
                <div
                  className={`flex flex-col gap-1 ${m.isMe ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-1.5 rounded-2xl border border-slate-300/80 px-space-lg py-space-sm text-sm italic text-outline">
                    <Icon name="block" size={15} />
                    {m.isMe
                      ? "Bạn đã thu hồi một tin nhắn"
                      : "Tin nhắn đã được thu hồi"}
                  </div>
                  {isClusterEnd && (
                    <span className="font-label-sm mx-1 text-[11px] text-outline">
                      {m.time}
                    </span>
                  )}
                </div>
              </div>
            );
          }

          // Chỉ tin đã gửi thành công (có id thật) mới thu hồi được
          const canRecall =
            m.isMe &&
            Boolean(onRecallMessage) &&
            !m.id.startsWith("temp-") &&
            m.status !== "sending" &&
            m.status !== "failed";

          if (m.isMe) {
            return (
              <div
                key={m.id}
                className="group relative ml-auto flex max-w-xl flex-col items-end gap-1"
              >
                {/* Nút "⋯" hiện khi rê chuột vào tin -> menu Thu hồi */}
                {canRecall && (
                  <div className="absolute -left-10 top-1">
                    <button
                      type="button"
                      onClick={() =>
                        setMenuMessageId((prev) =>
                          prev === m.id ? null : m.id
                        )
                      }
                      title="Tuỳ chọn"
                      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-outline transition-opacity hover:bg-surface-container ${
                        menuMessageId === m.id
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <Icon name="more_vert" size={18} />
                    </button>
                    {menuMessageId === m.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setMenuMessageId(null)}
                        />
                        <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-xl border border-slate-200/80 bg-surface-container-lowest p-1 shadow-xl">
                          <button
                            type="button"
                            onClick={() => handleRecall(m.id)}
                            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-on-surface hover:bg-surface-container-low"
                          >
                            <Icon name="undo" size={18} />
                            Thu hồi
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {/* 1. Voice Note Bubble */}
                {m.audioNote ? (
                  <div className="flex w-72 items-center gap-space-md rounded-2xl rounded-br-sm bg-primary-container p-space-md text-on-primary-container shadow-sm">
                    <button
                      type="button"
                      onClick={() => toast.info("Đang phát ghi âm...")}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-sm transition-transform hover:scale-105"
                    >
                      <Icon name="play_arrow" size={20} filled />
                    </button>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex h-6 items-center gap-0.5">
                        <span className="h-2 w-1 rounded-full bg-white/60" />
                        <span className="h-4 w-1 rounded-full bg-white/70" />
                        <span className="h-5 w-1 rounded-full bg-white" />
                        <span className="h-3 w-1 rounded-full bg-white" />
                        <span className="h-6 w-1 rounded-full bg-white" />
                        <span className="h-4 w-1 rounded-full bg-white" />
                        <span className="h-2 w-1 rounded-full bg-white/60" />
                        <span className="h-5 w-1 rounded-full bg-white/50" />
                        <span className="h-3 w-1 rounded-full bg-white/50" />
                        <span className="h-4 w-1 rounded-full bg-white/40" />
                        <span className="h-2 w-1 rounded-full bg-white/40" />
                      </div>
                      <div className="font-label-sm flex justify-between text-[11px] text-white/80">
                        <span>{m.audioNote.current || "0:24"}</span>
                        <span>{m.audioNote.duration || "0:45"}</span>
                      </div>
                    </div>
                  </div>
                ) : m.replyTo ? (
                  /* 2. Quoted Reply Bubble */
                  <div className="space-y-1 rounded-2xl rounded-br-sm bg-primary-container p-space-sm text-on-primary-container shadow-sm">
                    <div className="rounded-lg border-l-2 border-white/60 bg-on-primary-container/10 px-space-sm py-1 text-xs text-white/90">
                      <span className="font-semibold">
                        {m.replyTo.senderName}:{" "}
                      </span>
                      <span>{m.replyTo.text}</span>
                    </div>
                    <p className="font-body-md whitespace-pre-wrap break-words px-1 pt-0.5 text-body-md">
                      {m.text}
                    </p>
                  </div>
                ) : singleImage ? (
                  /* 3. Unified Media Card */
                  <div className="relative max-w-sm overflow-hidden rounded-2xl rounded-br-sm bg-primary-container p-1 text-on-primary-container shadow-sm">
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={singleImage.url}
                        alt={singleImage.fileName || ""}
                        onClick={() => {
                          if (m.status !== "sending" && m.status !== "failed") {
                            setViewingImage(singleImage);
                          }
                        }}
                        className={`h-52 w-full object-cover transition-all ${
                          m.status === "sending"
                            ? "brightness-75"
                            : m.status === "failed"
                              ? "brightness-50"
                              : "cursor-pointer hover:opacity-95"
                        } ${m.text ? "mb-1" : ""}`}
                      />

                      {/* Sending overlay */}
                      {m.status === "sending" && (
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white backdrop-blur-[1.5px]">
                          <div className="flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-1.5 shadow-md backdrop-blur-md">
                            <Spinner
                              size={16}
                              className="border-white border-t-transparent"
                            />
                            <span className="font-label-sm text-xs font-medium">
                              Đang gửi...
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Failed overlay */}
                      {m.status === "failed" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 p-3 text-center backdrop-blur-[2px]">
                          <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-error/20 text-rose-300">
                            <Icon
                              name="error_outline"
                              size={22}
                              className="text-rose-400"
                            />
                          </div>
                          <span className="font-label-sm text-xs font-semibold text-rose-200">
                            {m.errorMessage || "Gửi lỗi"}
                          </span>
                          {m.onRetry && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                m.onRetry?.();
                              }}
                              className="mt-2.5 flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-xs font-medium text-white shadow-sm transition-all hover:bg-white/40 active:scale-95"
                            >
                              <Icon name="refresh" size={14} />
                              <span>Thử lại</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {m.text && (
                      <div className="px-space-md py-space-xs">
                        <p className="font-body-md whitespace-pre-wrap break-words text-body-md">
                          {m.text}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* 4. Standard Message / Attachments */
                  <>
                    {otherAttachments && otherAttachments.length > 0 && (
                      <ChatAttachments
                        attachments={otherAttachments}
                        isMe
                        status={m.status}
                        errorMessage={m.errorMessage}
                        onRetry={m.onRetry}
                        onImagePress={(img) => setViewingImage(img)}
                      />
                    )}
                    {m.text && (
                      <div
                        className={`font-body-md break-words rounded-2xl bg-primary-container px-space-lg py-space-sm text-body-md text-on-primary-container shadow-sm ${
                          !isClusterStart
                            ? "rounded-br-sm rounded-tr-sm"
                            : "rounded-br-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.text}</p>
                      </div>
                    )}
                  </>
                )}

                {/* Status indicator (timestamp & done_all / sending / failed / seen avatar) */}
                {(isClusterEnd ||
                  m.status === "sending" ||
                  m.status === "failed" ||
                  m.seenAvatar != null) && (
                  <div className="mr-1 mt-0.5 flex items-center gap-1.5">
                    <span className="font-label-sm text-[11px] text-outline">
                      {m.time}
                    </span>
                    {m.status === "sending" ? (
                      <span className="font-label-sm flex items-center gap-1 text-[11px] font-medium text-primary">
                        <Spinner
                          size={11}
                          className="border-primary border-t-transparent"
                        />
                        <span>Đang gửi...</span>
                      </span>
                    ) : m.status === "failed" ? (
                      <span className="font-label-sm flex items-center gap-1 text-[11px] font-medium text-error">
                        <Icon name="error" size={13} className="text-error" />
                        <span>Gửi lỗi</span>
                        {m.onRetry && (
                          <button
                            type="button"
                            onClick={m.onRetry}
                            className="ml-1 cursor-pointer font-semibold text-primary hover:underline"
                          >
                            Thử lại
                          </button>
                        )}
                      </span>
                    ) : m.seenAvatar != null ? (
                      /* Đã xem: hiện nhãn "Đã xem" và avatar nhỏ của đối phương */
                      <div
                        className="font-label-sm flex cursor-default select-none items-center gap-1 text-[11px] text-outline"
                        title={
                          m.seenTime ? `Đã xem lúc ${m.seenTime}` : "Đã xem"
                        }
                      >
                        <span>Đã xem</span>
                        <div className="shadow-xs relative h-4 w-4 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200/90">
                          <Avatar uri={m.seenAvatar} size={16} name={name} />
                        </div>
                      </div>
                    ) : (
                      /* Đã gửi: hiện chữ "Đã gửi" và icon done_all */
                      <span className="font-label-sm flex items-center gap-1 text-[11px] text-outline">
                        <span>Đã gửi</span>
                        <Icon
                          name="done_all"
                          size={14}
                          filled
                          className="text-primary"
                        />
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          }

          // Incoming Message
          return (
            <div key={m.id} className="flex max-w-xl items-end gap-space-sm">
              {/* Avatar on cluster end */}
              {isClusterEnd ? (
                <div className="mb-1 h-7 w-7 shrink-0 overflow-hidden rounded-full shadow-sm">
                  <Avatar uri={m.avatar || avatar} size={28} name={name} />
                </div>
              ) : (
                <div className="w-7 shrink-0" />
              )}

              <div className="flex flex-col items-start gap-1">
                {/* 1. Voice Note Bubble */}
                {m.audioNote ? (
                  <div className="shadow-xs flex w-72 items-center gap-space-md rounded-2xl rounded-bl-sm bg-surface-container p-space-md text-on-surface">
                    <button
                      type="button"
                      onClick={() => toast.info("Đang phát ghi âm...")}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-transform hover:scale-105"
                    >
                      <Icon name="play_arrow" size={20} filled />
                    </button>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex h-6 items-center gap-0.5">
                        <span className="h-2 w-1 rounded-full bg-primary/40" />
                        <span className="h-4 w-1 rounded-full bg-primary/60" />
                        <span className="h-5 w-1 rounded-full bg-primary" />
                        <span className="h-3 w-1 rounded-full bg-primary" />
                        <span className="h-6 w-1 rounded-full bg-primary" />
                        <span className="h-4 w-1 rounded-full bg-primary" />
                        <span className="h-2 w-1 rounded-full bg-primary/60" />
                        <span className="h-5 w-1 rounded-full bg-primary/50" />
                        <span className="h-3 w-1 rounded-full bg-primary/50" />
                        <span className="h-4 w-1 rounded-full bg-primary/40" />
                        <span className="h-2 w-1 rounded-full bg-primary/40" />
                      </div>
                      <div className="font-label-sm flex justify-between text-[11px] text-on-surface-variant">
                        <span>{m.audioNote.current || "0:00"}</span>
                        <span>{m.audioNote.duration || "0:30"}</span>
                      </div>
                    </div>
                  </div>
                ) : m.replyTo ? (
                  /* 2. Quoted Reply Bubble */
                  <div className="shadow-xs space-y-1 rounded-2xl rounded-bl-sm bg-surface-container p-space-sm text-on-surface">
                    <div className="rounded-lg border-l-2 border-primary bg-surface-container-high px-space-sm py-1 text-xs text-on-surface-variant">
                      <span className="font-semibold">
                        {m.replyTo.senderName}:{" "}
                      </span>
                      <span>{m.replyTo.text}</span>
                    </div>
                    <p className="font-body-md whitespace-pre-wrap break-words px-1 pt-0.5 text-body-md">
                      {m.text}
                    </p>
                  </div>
                ) : singleImage ? (
                  /* 3. Unified Media Card */
                  <div className="shadow-xs max-w-sm overflow-hidden rounded-2xl rounded-bl-sm bg-surface-container p-1">
                    <img
                      src={singleImage.url}
                      alt={singleImage.fileName || ""}
                      onClick={() => setViewingImage(singleImage)}
                      className={`h-48 w-full cursor-pointer rounded-xl object-cover transition-opacity hover:opacity-95 ${
                        m.text ? "mb-2" : ""
                      }`}
                    />
                    {m.text && (
                      <div className="px-space-md pb-space-sm">
                        <p className="font-body-md whitespace-pre-wrap break-words text-body-md text-on-surface">
                          {m.text}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* 4. Standard Message / Attachments */
                  <>
                    {otherAttachments && otherAttachments.length > 0 && (
                      <ChatAttachments
                        attachments={otherAttachments}
                        isMe={false}
                        onImagePress={(img) => setViewingImage(img)}
                      />
                    )}
                    {m.text && (
                      <div
                        className={`font-body-md shadow-xs break-words rounded-2xl bg-surface-container px-space-lg py-space-sm text-body-md text-on-surface ${
                          !isClusterStart
                            ? "rounded-bl-sm rounded-tl-sm"
                            : "rounded-bl-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.text}</p>
                      </div>
                    )}
                  </>
                )}

                {/* Timestamp */}
                {isClusterEnd && (
                  <span className="font-label-sm ml-1 text-[11px] text-outline">
                    {m.time}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-outline">
            <div className="h-6 w-6 overflow-hidden rounded-full">
              <Avatar uri={avatar} size={24} name={name} />
            </div>
            <span className="italic">{name} đang soạn tin nhắn...</span>
          </div>
        )}
      </div>

      {/* Chat Input Footer: đã chặn nhau thì không nhắn được -> hiện thông báo thay ô nhập */}
      {blockStatus !== "NONE" ? (
        <footer className="z-10 flex shrink-0 flex-col items-center gap-2 border-t border-slate-100/60 bg-surface-container-lowest p-space-md text-center">
          {blockStatus === "BLOCKED_BY_ME" ? (
            <>
              <p className="text-sm font-semibold text-on-surface">
                Bạn đã chặn {name}
              </p>
              <p className="text-xs text-on-surface-variant">
                Hai bạn không thể nhắn tin hay tìm thấy nhau. Bỏ chặn sẽ không
                tự kết bạn lại.
              </p>
              {onUnblock && (
                <button
                  type="button"
                  onClick={onUnblock}
                  className="mt-1 cursor-pointer rounded-xl bg-surface-container px-4 py-2 text-sm font-semibold hover:bg-surface-container-high"
                >
                  Bỏ chặn
                </button>
              )}
            </>
          ) : (
            // Bị chặn: hiện như tài khoản không còn hoạt động, không nói rõ là bị chặn (giống Messenger)
            <>
              <p className="text-sm font-semibold text-on-surface">
                Người này hiện không có mặt trên Messenger
              </p>
              <p className="text-xs text-on-surface-variant">
                Bạn không thể nhắn tin hay gọi cho tài khoản này.
              </p>
            </>
          )}
        </footer>
      ) : (
        <footer className="z-10 shrink-0 border-t border-slate-100/60 bg-surface-container-lowest p-space-md shadow-[0_-2px_12px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-space-sm">
            {/* Leading Media Action Icons */}
            <div className="flex shrink-0 items-center gap-0.5 text-primary">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                title="Đính kèm ảnh"
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
              >
                <Icon name="photo_library" size={22} />
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Chọn file tài liệu"
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
              >
                <Icon name="attachment" size={22} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputText((prev) => prev + "😊");
                }}
                title="Chọn nhãn dán"
                className="hidden h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-surface-container sm:flex"
              >
                <Icon name="sentiment_satisfied" size={22} />
              </button>

              <button
                type="button"
                onClick={() => toast.info("Chọn ảnh GIF")}
                title="Gửi file GIF"
                className="hidden h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-colors hover:bg-surface-container sm:flex"
              >
                GIF
              </button>
            </div>

            {/* Input Capsule */}
            <div className="flex flex-1 items-center rounded-full bg-surface-container-low px-space-md py-space-xs transition-colors focus-within:bg-surface-container-highest">
              <input
                type="text"
                id="chat-input"
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tin nhắn..."
                className="font-body-md w-full bg-transparent text-body-md text-on-surface placeholder:text-outline focus:outline-none"
              />
              <button
                type="button"
                title="Biểu tượng cảm xúc"
                onClick={() => setInputText((prev) => prev + "❤️")}
                className="ml-space-xs shrink-0 text-primary transition-transform hover:scale-110"
              >
                <Icon name="mood" size={22} />
              </button>
            </div>

            {/* Quick Thumbs Up / Send Button */}
            <button
              type="button"
              id="send-btn"
              disabled={sending}
              onClick={handleSend}
              title={hasText ? "Gửi tin nhắn" : "Thích"}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary transition-transform hover:bg-surface-container active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {hasText ? (
                <Icon name="send" size={24} filled className="text-primary" />
              ) : (
                <Icon
                  name="thumb_up"
                  size={24}
                  filled
                  className="text-primary"
                />
              )}
            </button>
          </div>
        </footer>
      )}

      {/* Fullscreen image viewer */}
      {viewingImage && (
        <ImageViewerModal
          image={viewingImage}
          onClose={() => setViewingImage(null)}
        />
      )}
    </main>
  );
}
