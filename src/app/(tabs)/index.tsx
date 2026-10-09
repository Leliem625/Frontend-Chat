import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getConversations } from "@/api/conversation";
import { getListFriend } from "@/api/friend";
import {
  ChatsHeader,
  ChatsSearchBar,
  ConversationItemData,
  ConversationListItem,
  FilterTabs,
  FilterType,
  NewChatFab,
} from "@/components/conversation";
import { StoriesCarousel, StoryItem } from "@/components/story";
import { useAuth } from "@/context/auth";
import { useOnlineUsers } from "@/hook/useOnlineUser";
import type { Conversation, User } from "@/types/api";
import { formatConversationTime } from "@/utils/date";
const INITIAL_CONVERSATIONS: ConversationItemData[] = [
  {
    id: "1",
    name: "Mai Linh",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0ZK9KtsxDZVJJ48u2fRKepiXWo0x7At6mPNOwvRPElBMIabCSCTn_SbxK6PSrAMiDw3R5DSUsyrgfaHqqk2-PLMd-mEsVQYi_PLGYDZWav5oWg1L-8rrB29v7Wqg-M625rQY3Blnr2tRm0W3wUT-mzVoQNGRzbIUiEpRCBgYPWYZ-sUqk9WZ-21YrQcwM4Kghu_-QXU3kKAzvn4CHXq9HquIQM4A0mHJEBgyjWwARjtqh80uCgFpL",
    isOnline: true,
    lastMessage: "Chiều nay gặp nhau ở quán cà phê cũ nhé! ☕",
    time: "10:42",
    unreadCount: 2,
    isUnread: true,
    category: "direct",
    isFriend: true,
  },
  {
    id: "2",
    name: "Nhóm Thiết Kế UI/UX 🎨",
    isGroup: true,
    groupIcon: "palette",
    senderPrefix: "Hoàng:",
    lastMessage: "Mình vừa cập nhật bản prototype mới rồi nha mọi người",
    time: "09:15",
    isUnread: true,
    hasUnreadDot: true,
    category: "group",
  },
  {
    id: "3",
    name: "Hoàng Nam",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDnK0HqOcHzJQZ-NTkkKQxwDyWB-LAFNG2O_LIJaxArR9Zsc8_xQyXvU5oRR6lY8U42OzfMduO2NbVMvYDrHLvZbIPgXT1F2nokOjkF79J3AcEGmPTKbQcT4nZihAcxDFLIKaWRd_-nIgDH5HbpBCHB0G7L9r75jRis6_TwnWZt6rCdDtURY5q59O_UOOVC5t39oUd9s9wi5N4ni-J2RlQOdaHhP23oh9Q8iAomAWoqn4fR5hMq9PFI",
    isOnline: true,
    lastMessage: "Bản thiết kế đã gửi cho khách hàng duyệt rồi nhé.",
    time: "08:30",
    isRead: true,
    category: "direct",
    isFriend: true,
  },
  {
    id: "4",
    name: "Minh Đức",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVKMX9rNUsYvcFtecPxLjZLrlo2PM2OXGw1A3l2-jaY4yFvnHoRKRKrseUsy5LhwiDgB-H7ftrRNknFi2LmMvghV9lpnc7M9JKSus1tohcCcCRsQGWgGn17-O3lHJaQ1GgC025MZJFlO-4ZBfq1XnBxernIhT-Dm9I-XXLx0c4E94_0-NwzIzHvCORrhkCmMtwC_pLXnS9ZASJB3xJj4IPfRkiRdLestnMUJbXqSgvQmwOHACR3-DI",
    senderPrefix: "Bạn:",
    lastMessage: "Ok chốt vậy nhé! Cảm ơn bạn nhiều.",
    time: "Hôm qua",
    isRead: true,
    category: "direct",
    isFriend: false,
  },
  {
    id: "5",
    name: "Thảo My",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIcnqBO1nh4HWfPjbdfbpaCI97BruWoa5SwnXbmwnHpAbNn8PL-WEQ9lOM8B6XCKXVz0tMuSGth1O3ouI8uxLXiX-Sx32X1s9bpGo0h-gkQQ1LVIbaH6BuxIu6SnRtQDTiex08X1Ge4d26HNCD68wttxNqCo5NcY4kiQzjO0AEsfGVrBOcR2wV0NMTRtzEqzjjkZp-EcfN2E8to5G6FbIrH-mrj6KB5lsMrH3LYJ1rTLyG7-afQmH3",
    isOnline: true,
    hasAttachment: true,
    lastMessage: "Đã gửi một ảnh 📷",
    attachmentThumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCN3xHo7DdqQlAzkVoUDzZuPmo0Z09EzqgAOBGiqZtRtCctmVZGxWDmSr0pcHoD2SIsYC76NdAYlZ2JamMP9xyRVBLeOonIQSAl_RLoVcjpz4qh7brdxizZEn771x4ZpDfvkuNGeUYbiXrc3-GwnYh2nMqutEw_1P-l_dmUGnrzmY6b1NnrxuP70PdGvC2Hh4UNODAZHQkvKuXyvbo0JT0hvaSpsllfwZhXyPqThiQKj3Ee6WAoNbcK",
    time: "T2",
    category: "direct",
    isFriend: true,
  },
  {
    id: "6",
    name: "Nguyễn Văn An",
    // Không có avatar -> Tự động hiện Facebook Default Avatar
    isMissedCall: true,
    lastMessage: "Cuộc gọi nhỡ thoại (2)",
    time: "12 thg 5",
    category: "direct",
    isFriend: false,
  },
  {
    id: "7",
    name: "Team Dự Án Sáng Tạo",
    isGroup: true,
    // Không có avatar nhóm -> Tự động hiện Facebook Group Default Avatar
    senderPrefix: "Quỳnh Anh:",
    lastMessage: "Mọi người xem slide thuyết trình nhé",
    time: "10 thg 5",
    isSent: true,
    category: "channel",
  },
];

// Chuyển đổi dữ liệu Backend Conversation -> Giao diện UI
function mapConversationToUI(
  conv: Conversation,
  currentUserId?: number,
  friendList: User[] = []
): ConversationItemData {
  const isMe = currentUserId && conv.lastMessageSenderId === currentUserId;
  const isGroup = conv.type === "GROUP";

  // Tìm thông tin bạn bè để lấy userId cho chat 1-1
  const matchedFriend = !isGroup
    ? friendList.find(
        (f) =>
          f.username === conv.title ||
          (conv.avatarUrl && f.avatarUrl === conv.avatarUrl)
      )
    : undefined;

  return {
    id: String(conv.id),
    name: conv.title || (isGroup ? "Nhóm trò chuyện" : "Người dùng"),
    avatar: conv.avatarUrl ?? undefined,
    initials:
      !conv.avatarUrl && conv.title
        ? conv.title.substring(0, 2).toUpperCase()
        : undefined,
    isGroup,
    groupIcon: isGroup ? "group" : undefined,
    lastMessage: conv.lastMessage || "Chưa có tin nhắn nào",
    senderPrefix: isMe ? "Bạn:" : undefined,
    time: formatConversationTime(conv.lastMessageAt),
    unreadCount: conv.unreadCount > 0 ? conv.unreadCount : undefined,
    isUnread: conv.unreadCount > 0,
    category: isGroup ? "group" : "direct",
    userId: matchedFriend?.id,
    isFriend: !isGroup && Boolean(matchedFriend),
  };
}

export default function ChatsListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const currentUserId = user?.id;
  const { isOnline } = useOnlineUsers();
  const [friends, setFriends] = useState<User[]>([]);
  const activeStories: StoryItem[] = friends
    .filter((f) => isOnline(f.id))
    .map((f) => ({
      id: String(f.id),
      name: f.username,
      avatar: f.avatarUrl ?? "",
      isOnline: true,
      hasStory: false,
    }))
    .sort((a, b) => Number(b.isOnline) - Number(a.isOnline));
  // State danh sách cuộc trò chuyện: mặc định có sẵn mock data, khi backend có data sẽ cập nhật
  const [conversations, setConversations] = useState<ConversationItemData[]>(
    INITIAL_CONVERSATIONS
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // State tìm kiếm và lọc tab
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Gọi API lấy danh sách cuộc trò chuyện từ Backend
  const loadConversations = useCallback(
    async (isPull = false) => {
      if (isPull) {
        setRefreshing(true);
      }

      let loadedFriends: User[] = [];
      try {
        const friendData = await getListFriend();
        if (Array.isArray(friendData)) {
          loadedFriends = friendData;
          setFriends(loadedFriends);
        }
      } catch (error) {
        console.warn("Chưa lấy được danh sách bạn bè:", error);
      }

      try {
        const data = await getConversations();
        if (Array.isArray(data) && data.length > 0) {
          setConversations(
            data.map((c) =>
              mapConversationToUI(c, currentUserId, loadedFriends)
            )
          );
        }
      } catch (error) {
        console.warn("Chưa kết nối được danh sách chat backend:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    // Không đưa `friends` vào deps: hàm này tự setFriends -> sẽ tạo vòng lặp gọi API vô hạn
    [currentUserId]
  );

  // Tự động làm mới khi quay lại màn hình này
  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [loadConversations])
  );

  // Xử lý các sự kiện người dùng
  // Truyền kèm name/avatar/userId của đối phương sang màn chat để hiển thị ngay
  const handleOpenChat = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    router.push({
      pathname: "/chat/[id]",
      params: {
        id,
        name: conv?.name ?? "",
        avatar: conv?.avatar ?? "",
        userId: conv?.userId != null ? String(conv.userId) : "",
        isFriend: conv?.isFriend !== undefined ? String(conv.isFriend) : "",
      },
    });
  };

  const handleCamera = () => {
    console.log("Mở camera");
  };

  const handleNewChat = () => {
    console.log("Tạo tin nhắn mới");
  };

  const handleOpenProfile = () => {
    router.push("/(tabs)/profile");
  };

  const handleVoiceSearch = () => {
    console.log("Kích hoạt tìm kiếm giọng nói");
  };

  const handleStoryPress = (story: StoryItem) => {
    console.log("Xem tin của:", story.name);
  };

  const handleAddStory = () => {
    console.log("Đăng tin mới");
  };

  // Lọc cuộc trò chuyện theo filter & từ khóa tìm kiếm
  const filteredConversations = conversations.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchMessage = item.lastMessage.toLowerCase().includes(q);
      if (!matchName && !matchMessage) return false;
    }

    if (activeFilter === "unread") {
      return item.isUnread || (item.unreadCount ?? 0) > 0;
    }
    if (activeFilter === "groups") {
      return item.isGroup && item.category === "group";
    }
    if (activeFilter === "channels") {
      return item.category === "channel";
    }
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <StatusBar style="dark" />

      {/* 1. Header trên cùng */}
      <ChatsHeader
        avatarUrl={user?.avatarUrl}
        onCameraPress={handleCamera}
        onNewChatPress={handleNewChat}
        onProfilePress={handleOpenProfile}
      />

      {/* 2. Nội dung cuộn chính */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadConversations(true)}
            colors={["#0084ff"]}
            tintColor="#0084ff"
          />
        }
      >
        {/* Thanh tìm kiếm */}
        <ChatsSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onVoiceSearchPress={handleVoiceSearch}
        />

        {/* Stories & Danh bạ đang hoạt động */}
        <StoriesCarousel
          stories={activeStories}
          onAddStory={handleAddStory}
          onStoryPress={handleStoryPress}
        />

        {/* Thanh phân loại (Filter Pills) */}
        <FilterTabs
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        {/* 3. Danh sách cuộc trò chuyện */}
        {loading && conversations.length === 0 ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="small" color="#0084ff" />
            <Text className="mt-3 text-[13px] text-slate-400">
              Đang tải danh sách đoạn chat...
            </Text>
          </View>
        ) : filteredConversations.length === 0 ? (
          <View className="items-center justify-center px-6 py-14">
            <Text className="text-[15px] font-semibold text-slate-700">
              Chưa có cuộc trò chuyện nào
            </Text>
            <Text className="mt-1 text-center text-[13px] text-slate-400">
              Nhấn vào nút soạn tin nhắn bên dưới để bắt đầu kết nối cùng bạn
              bè!
            </Text>
          </View>
        ) : (
          <View className="mt-1 flex-col">
            {filteredConversations.map((item) => (
              <ConversationListItem
                key={item.id}
                item={item}
                onPress={handleOpenChat}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* 4. Nút Tạo cuộc trò chuyện mới nổi (Floating Action Button) */}
      <NewChatFab onPress={handleNewChat} />
    </SafeAreaView>
  );
}
