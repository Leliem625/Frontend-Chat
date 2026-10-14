import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getListFriend, sendFriendRequest } from "@/api/friend";
import { ApiError } from "@/api/client";
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
  DirectMessageItemData,
  ImageViewerModal,
} from "@/components/chat";
import { useAuth } from "@/context/auth";
import { useOnlineUsers } from "@/hook/useOnlineUser";
import { getSocket, useSocket } from "@/socket/socket";
import type { Attachment, Message, SeenInfo } from "@/types/api";

const PAGE_SIZE = 15;

// Giới hạn giống backend (FileStorageServiceImpl, MessageServiceImpl)
const MAX_ATTACHMENTS = 10;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_FILE_SIZE = 20 * 1024 * 1024;

// Alert.alert không hiện gì trên web
function showError(message: string) {
  if (Platform.OS === "web") {
    window.alert(message);
  } else {
    Alert.alert("Không gửi được", message);
  }
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

export default function ChatDetailScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const { user } = useAuth();
  const { isOnline: checkIsOnline } = useOnlineUsers();
  const socket = useSocket();

  // id = conversationId; name/avatar/userId = thông tin đối phương, truyền từ danh sách chat
  const {
    id,
    name,
    avatar,
    userId,
    isFriend: isFriendParam,
  } = useLocalSearchParams<{
    id: string;
    name?: string;
    avatar?: string;
    userId?: string;
    isFriend?: string;
  }>();

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

  // Đối phương đang soạn tin -> hiện dòng "đang soạn"
  useEffect(() => {
    if (!socket || !id) return;
    // Phòng khi gói "dừng soạn" không tới (họ tắt app, mất mạng): tự ẩn sau 5 giây
    let hideTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleTyping = (data: {
      conversationId: number;
      userId: number;
      isTyping: boolean;
    }) => {
      if (String(data.conversationId) !== String(id) || data.userId === user?.id) return;
      if (hideTimeout) clearTimeout(hideTimeout);
      setIsTyping(data.isTyping);
      if (data.isTyping) {
        hideTimeout = setTimeout(() => setIsTyping(false), 5000);
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      }
    };

    socket.on("typing", handleTyping);
    return () => {
      socket.off("typing", handleTyping);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [socket, id, user?.id]);
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
        setTimeout(
          () => scrollViewRef.current?.scrollToEnd({ animated: false }),
          50
        );
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
  }, [id, user?.id, friendAvatar]);

  // Đối phương mở xem cuộc trò chuyện này -> cập nhật ngay không cần tải lại
  useEffect(() => {
    if (!socket || !id) return;
    const handleSeen = (data: { conversationId: number; seen: SeenInfo }) => {
      if (String(data.conversationId) !== String(id)) return;
      setSeenBy((prev) => [
        ...prev.filter((s) => s.userId !== data.seen.userId),
        data.seen,
      ]);
    };
    socket.on("message_seen", handleSeen);
    return () => {
      socket.off("message_seen", handleSeen);
    };
  }, [socket, id]);

  // Có tin nhắn mới qua socket -> thêm vào cuối nếu chưa có
  useEffect(() => {
    if (!socket || !id) return;
    const handleNewMessage = (msg: Message) => {
      if (String(msg.conversationId) !== String(id)) return;
      setMessages((prev) =>
        prev.some((m) => m.id === String(msg.id))
          ? prev // tin mình vừa gửi, REST đã thêm rồi
          : [...prev, mapMessageToUI(msg, user?.id, friendAvatar)]
      );
      if (msg.senderId !== user?.id) {
        // Họ đã gửi xong -> ẩn "đang soạn" (phòng gói dừng soạn đến muộn)
        setIsTyping(false);
        // Đang mở màn này nên coi như đã xem luôn
        markSeen(id).catch((e) =>
          console.warn("Không đánh dấu đã xem được:", e)
        );
      }
      setTimeout(
        () => scrollViewRef.current?.scrollToEnd({ animated: true }),
        100
      );
    };
    socket.on("new_message", handleNewMessage);
    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, id, user?.id, friendAvatar]);

  const lastMessage = messages[messages.length - 1];
  const seenAvatarByMessageId = new Map<string, string>();
  if (lastMessage?.isMe) {
    for (const seen of seenBy) {
      // So chuỗi ISO cùng định dạng của backend, tránh new Date() làm sai với phần giây lẻ 6 chữ số
      const index = messages.findLastIndex(
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
      setMessages((prev) => [...older, ...prev]);
      setNextCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch (error) {
      console.warn("Không tải được tin nhắn cũ:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [id, hasMore, nextCursor, loadingMore, user?.id, friendAvatar]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (e.nativeEvent.contentOffset.y < 60) {
      loadOlderMessages();
    }
  };

  // Hành động điều hướng & tương tác
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
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

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

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

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  // Gửi ảnh / file: hiện ngay bằng ảnh trong máy, tải lên xong mới thay bằng tin thật
  const sendAttachments = async (files: LocalFile[]) => {
    if (!id || files.length === 0) return;

    if (files.length > MAX_ATTACHMENTS) {
      showError(`Chỉ được gửi tối đa ${MAX_ATTACHMENTS} file một lần.`);
      return;
    }
    const tooBig = files.find((f) =>
      f.mimeType.startsWith("image/")
        ? (f.size ?? 0) > MAX_IMAGE_SIZE
        : (f.size ?? 0) > MAX_FILE_SIZE
    );
    if (tooBig) {
      showError(`"${tooBig.name}" quá lớn (ảnh tối đa 5MB, file tối đa 20MB).`);
      return;
    }

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
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

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
    }
  };

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: MAX_ATTACHMENTS,
      // < 1 để nén lại thành JPEG: ảnh nhẹ hơn và iPhone không gửi HEIC (backend không nhận)
      quality: 0.8,
    });
    if (result.canceled) return;
    sendAttachments(
      result.assets.map((a, index) => ({
        uri: a.uri,
        name: a.fileName ?? `photo-${Date.now()}-${index}.jpg`,
        mimeType: a.mimeType ?? "image/jpeg",
        size: a.fileSize,
        file: a.file,
      }))
    );
  };

  const handleAttach = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    sendAttachments(
      result.assets.map((a) => ({
        uri: a.uri,
        name: a.name,
        mimeType: a.mimeType ?? "application/octet-stream",
        size: a.size,
        file: a.file,
      }))
    );
  };

  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingSent = useRef(false);

  const handleChangeText = (text: string) => {
    setInputText(text); // việc 1: cập nhật ô nhập

    // việc 2: báo đang soạn, chỉ bắn 1 lần khi bắt đầu gõ
    const socket = getSocket();
    if (!socket || !id) return;
    if (!isTypingSent.current) {
      socket.emit("typing", { conversationId: Number(id), isTyping: true });
      isTypingSent.current = true;
    }

    // ngừng gõ 2 giây (hoặc xoá hết chữ) thì báo dừng
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    const stop = () => {
      socket.emit("typing", { conversationId: Number(id), isTyping: false });
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

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
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
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={200}
          // Giữ nguyên vị trí đang xem khi chèn tin cũ lên trên
          maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            flexGrow: 1,
          }}
        >
          {/* Trạng thái tải tin nhắn ban đầu */}
          {loading ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#0084ff" />
            </View>
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
                <View className="items-center py-3">
                  <ActivityIndicator size="small" color="#0084ff" />
                </View>
              )}

              {/* Dải phân cách ngày */}
              <ChatDateDivider label="Hôm nay, 14:20" />

              {/* Danh sách tin nhắn */}
              <View className="flex-col">
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
              </View>

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
        </ScrollView>

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
      </KeyboardAvoidingView>

      {/* Xem ảnh toàn màn hình + nút tải về */}
      <ImageViewerModal
        image={viewingImage}
        onClose={() => setViewingImage(null)}
      />
    </SafeAreaView>
  );
}
