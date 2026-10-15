import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import { createDirectConversation } from "@/api/conversation";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  getListFriend,
  getPendingRequests,
  searchFriends,
  sendFriendRequest,
  unfriend,
} from "@/api/friend";
import { Icon, Spinner } from "@/components/common";
import {
  SearchFilterSidebar,
  ProfileResultCard,
  MOCK_PROFILE_RESULTS,
  type SearchCategoryId,
  type ProfileResultData,
} from "@/components/search";
import { useOnlineUsers } from "@/socket";
import type { FriendRelation, FriendSearchResult, User } from "@/types/api";

const RELATION_TO_STATUS: Record<FriendRelation, ProfileResultData["relationshipStatus"]> = {
  FRIEND: "friend",
  REQUEST_SENT: "request_sent",
  REQUEST_RECEIVED: "request_received",
  NONE: "not_friend",
};

// Kết quả tìm kiếm từ backend -> dữ liệu hiển thị của ProfileResultCard
function mapSearchResult(r: FriendSearchResult): ProfileResultData {
  const locationInfo = r.currentCity
    ? `Sống tại ${r.currentCity}`
    : r.hometown
    ? `Đến từ ${r.hometown}`
    : undefined;

  const followers = (r as any).followersCount
    ? `${(r as any).followersCount} người theo dõi`
    : undefined;

  const mutualFriends = (r as any).mutualFriendsCount
    ? `${(r as any).mutualFriendsCount} bạn chung`
    : (r as any).mutualFriendCount
    ? `${(r as any).mutualFriendCount} bạn chung`
    : undefined;

  return {
    id: `u-${r.id}`,
    userId: r.id,
    name: r.username,
    handle: `@${r.username.toLowerCase().replace(/\s+/g, "")}`,
    avatar: r.avatarUrl || "",
    location: locationInfo,
    followers,
    mutualFriends,
    relationshipStatus: RELATION_TO_STATUS[r.relation] || "not_friend",
    requestId: r.requestId ?? undefined,
  };
}

export default function FriendsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentQuery = searchParams.get("q") ?? "";

  const [activeCategory, setActiveCategory] = useState<SearchCategoryId>("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("all");

  const [profiles, setProfiles] = useState<ProfileResultData[]>(MOCK_PROFILE_RESULTS);
  // Kết quả tìm kiếm thật từ backend, kèm từ khoá đã dùng để tìm
  const [search, setSearch] = useState<{ query: string; results: ProfileResultData[] } | null>(
    null
  );
  const { isOnline } = useOnlineUsers();

  const trimmedQuery = currentQuery.trim();
  // Có từ khoá: hiện kết quả tìm kiếm (giữ kết quả cũ trong lúc chờ kết quả mới)
  // Không có từ khoá (null): xem danh sách bạn bè như cũ
  const searchResults = trimmedQuery ? (search?.results ?? null) : null;
  const searching = Boolean(trimmedQuery) && search?.query !== trimmedQuery;

  // ?q= trên URL chỉ đổi khi bấm Enter ở ô tìm kiếm (WebTopHeader) -> lúc đó mới gọi API
  useEffect(() => {
    if (!trimmedQuery) return;
    let active = true; // bỏ qua kết quả của từ khoá cũ về muộn
    searchFriends(trimmedQuery)
      .then((results) => {
        if (active) setSearch({ query: trimmedQuery, results: results.map(mapSearchResult) });
      })
      .catch((error) => {
        if (!active) return;
        const q = trimmedQuery.toLowerCase();
        const fallbackResults = profiles.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.handle.toLowerCase().includes(q) ||
            p.location?.toLowerCase().includes(q)
        );
        setSearch({ query: trimmedQuery, results: fallbackResults });
        if (fallbackResults.length === 0) {
          toast.error("Không tìm kiếm được", { description: error?.message });
        }
      });
    return () => {
      active = false;
    };
  }, [trimmedQuery, profiles]);

  // Tải danh sách bạn bè thật từ backend
  useEffect(() => {
    let active = true;
    getListFriend()
      .then((friendUsers: User[]) => {
        if (!active || !Array.isArray(friendUsers) || friendUsers.length === 0) return;
        const realFriends: ProfileResultData[] = friendUsers.map((u) => ({
          id: `u-${u.id}`,
          userId: u.id,
          name: u.username,
          handle: `@${u.username.toLowerCase().replace(/\s+/g, "")}`,
          avatar: u.avatarUrl || "",
          location: "Việt Nam",
          relationshipStatus: "friend",
        }));

        setProfiles((prev) => {
          const nonDupes = prev.filter(
            (p) => !realFriends.some((rf) => rf.name.toLowerCase() === p.name.toLowerCase())
          );
          return [...realFriends, ...nonDupes];
        });
      })
      .catch(() => {
        // Sử dụng dữ liệu mẫu nếu chưa kết nối
      });

    // Lời mời kết bạn mình nhận được -> hiện ở mục "Lời mời kết bạn" (có nút Chấp nhận / Xóa)
    getPendingRequests()
      .then((requests) => {
        if (!active || requests.length === 0) return;
        const received: ProfileResultData[] = requests.map((r) => ({
          id: `u-${r.fromUserId}`,
          userId: r.fromUserId,
          name: r.username ?? "Người dùng",
          handle: `@${(r.username ?? "").toLowerCase().replace(/\s+/g, "")}`,
          avatar: r.avatarUrl || "",
          location: r.currentCity ? `Sống tại ${r.currentCity}` : undefined,
          relationshipStatus: "request_received",
          requestId: r.id,
        }));
        setProfiles((prev) => [
          ...received,
          ...prev.filter((p) => !received.some((r) => r.id === p.id)),
        ]);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  // Đổi trạng thái 1 người ở cả danh sách bạn bè lẫn kết quả tìm kiếm
  const updateStatus = (
    profileId: string,
    status: ProfileResultData["relationshipStatus"]
  ) => {
    const apply = (list: ProfileResultData[]) =>
      list.map((p) => (p.id === profileId ? { ...p, relationshipStatus: status } : p));
    setProfiles(apply);
    setSearch((prev) => (prev ? { ...prev, results: apply(prev.results) } : prev));
  };

  const handleProfileAction = async (profile: ProfileResultData) => {
    if (!profile.userId) {
      if (profile.relationshipStatus === "not_friend") {
        updateStatus(profile.id, "request_sent");
        toast.success(`Đã gửi lời mời kết bạn đến ${profile.name}`);
      } else if (profile.relationshipStatus === "request_sent") {
        updateStatus(profile.id, "not_friend");
        toast.info(`Đã hủy lời mời kết bạn đến ${profile.name}`);
      } else if (profile.relationshipStatus === "request_received") {
        updateStatus(profile.id, "friend");
        toast.success(`Bạn và ${profile.name} đã là bạn bè`);
      }
      return;
    }
    try {
      if (profile.relationshipStatus === "not_friend") {
        await sendFriendRequest(profile.userId);
        updateStatus(profile.id, "request_sent");
        toast.success(`Đã gửi lời mời kết bạn đến ${profile.name}`);
      } else if (profile.relationshipStatus === "request_sent") {
        await cancelFriendRequest(profile.userId);
        updateStatus(profile.id, "not_friend");
        toast.info(`Đã hủy lời mời kết bạn đến ${profile.name}`);
      } else if (profile.relationshipStatus === "request_received" && profile.requestId) {
        await acceptFriendRequest(profile.requestId);
        updateStatus(profile.id, "friend");
        toast.success(`Bạn và ${profile.name} đã là bạn bè`);
      }
    } catch (error: any) {
      toast.error("Không thực hiện được", { description: error?.message });
    }
  };

  const handleDeclineAction = async (profile: ProfileResultData) => {
    if (!profile.userId) {
      updateStatus(profile.id, "not_friend");
      toast.info(`Đã xóa lời mời từ ${profile.name}`);
      return;
    }
    if (!profile.requestId) {
      updateStatus(profile.id, "not_friend");
      return;
    }
    try {
      await declineFriendRequest(profile.requestId);
      updateStatus(profile.id, "not_friend");
      toast.info(`Đã từ chối lời mời từ ${profile.name}`);
    } catch (error: any) {
      toast.error("Không từ chối được", { description: error?.message });
    }
  };

  // Hủy kết bạn: hỏi lại cho chắc rồi gọi API
  const handleUnfriend = async (profile: ProfileResultData) => {
    if (!window.confirm(`Hủy kết bạn với ${profile.name}?`)) return;
    if (!profile.userId) {
      updateStatus(profile.id, "not_friend");
      return;
    }
    try {
      await unfriend(profile.userId);
      updateStatus(profile.id, "not_friend");
      toast.info(`Đã hủy kết bạn với ${profile.name}`);
    } catch (error: any) {
      toast.error("Không hủy kết bạn được", { description: error?.message });
    }
  };

  // Mở (hoặc tạo) cuộc trò chuyện 1-1 rồi chuyển sang màn chat
  const handleMessageUser = async (profile: ProfileResultData) => {
    if (!profile.userId) {
      toast.info("Đây là dữ liệu mẫu");
      return;
    }
    try {
      const conversation = await createDirectConversation(profile.userId);
      navigate(`/chat/${conversation.id}`);
    } catch (error: any) {
      toast.error("Không mở được cuộc trò chuyện", { description: error?.message });
    }
  };

  // Lọc kết quả theo từ khóa, danh mục, online và vị trí
  const filteredProfiles = useMemo(() => {
    const isSearching = searchResults !== null;
    const source = searchResults ?? profiles;
    return source.filter((p) => {
      // Lọc theo từ khóa: kết quả tìm kiếm đã được backend lọc + xếp hạng, chỉ lọc dữ liệu mẫu
      if (!isSearching && currentQuery.trim()) {
        const q = currentQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchHandle = p.handle.toLowerCase().includes(q);
        const matchLocation = p.location?.toLowerCase().includes(q);
        if (!matchName && !matchHandle && !matchLocation) return false;
      }

      // Lọc theo danh mục
      if (activeCategory === "friends") {
        if (p.relationshipStatus !== "friend") return false;
      } else if (activeCategory === "received") {
        if (p.relationshipStatus !== "request_received") return false;
      } else if (activeCategory === "requests") {
        if (p.relationshipStatus !== "request_sent") return false;
      } else if (activeCategory === "suggestions") {
        if (p.relationshipStatus !== "not_friend") return false;
      }

      // Lọc người đang online
      if (onlineOnly && !(p.isOnline || isOnline(p.userId))) {
        return false;
      }

      // Lọc theo vị trí (kết quả tìm kiếm có nơi sống từ backend)
      if (selectedLocation !== "all") {
        if (selectedLocation === "hanoi" && !p.location?.includes("Hà Nội")) return false;
        if (selectedLocation === "hcm" && !p.location?.includes("Hồ Chí Minh")) return false;
        if (selectedLocation === "danang" && !p.location?.includes("Đà Nẵng")) return false;
      }

      return true;
    });
  }, [profiles, searchResults, currentQuery, activeCategory, onlineOnly, selectedLocation, isOnline]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-surface text-on-surface font-sans antialiased select-none">
      {/* Mobile Filter Toggle Banner */}
      <div className="flex md:hidden items-center justify-between border-b border-slate-200/80 bg-surface-container-lowest px-4 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <Icon name="search" size={18} className="text-primary-container" />
          <span className="text-xs font-semibold text-on-surface truncate">
            {currentQuery ? `Tìm kiếm: "${currentQuery}"` : "Tìm kiếm bạn bè"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowMobileFilters((prev) => !prev)}
          className="flex items-center gap-1.5 rounded-lg bg-surface-container-low px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-surface-container cursor-pointer"
        >
          <Icon name="tune" size={16} />
          <span>{showMobileFilters ? "Đóng bộ lọc" : "Bộ lọc"}</span>
        </button>
      </div>

      {/* Main 2-Column Body Layout */}
      <div className="relative flex flex-1 w-full overflow-hidden">
        {/* Left Sidebar (Filters) */}
        <div
          className={`h-full ${
            showMobileFilters
              ? "absolute inset-y-0 left-0 z-30 flex shadow-2xl"
              : "hidden md:flex"
          }`}
        >
          <SearchFilterSidebar
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              setShowMobileFilters(false);
            }}
            onlineOnly={onlineOnly}
            onToggleOnline={(on) => setOnlineOnly(on)}
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
          />
        </div>

        {/* Backdrop for mobile filter drawer */}
        {showMobileFilters && (
          <div
            className="fixed inset-0 z-20 bg-black/30 backdrop-blur-xs md:hidden"
            onClick={() => setShowMobileFilters(false)}
          />
        )}

        {/* Right Main Results Area */}
        <main className="flex-1 h-full overflow-y-auto bg-surface px-3 sm:px-6 md:px-8 py-5">
          <div className="max-w-[680px] w-full mx-auto flex flex-col gap-3.5 pb-20">
            {/* Header info */}
            <div className="flex items-center justify-between pb-1">
              <div>
                <h2 className="text-base font-bold text-on-surface">
                  {currentQuery
                    ? `Kết quả cho "${currentQuery}"`
                    : activeCategory === "friends"
                    ? "Bạn bè của bạn"
                    : activeCategory === "received"
                    ? "Lời mời kết bạn"
                    : activeCategory === "requests"
                    ? "Lời mời kết bạn đã gửi"
                    : activeCategory === "suggestions"
                    ? "Gợi ý kết bạn mới"
                    : "Tất cả bạn bè & Người dùng"}
                </h2>
                <p className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  {searching ? (
                    <>
                      <Spinner size={12} /> Đang tìm kiếm...
                    </>
                  ) : (
                    `Tìm thấy ${filteredProfiles.length} người dùng`
                  )}
                </p>
              </div>
            </div>

            {/* List of Profile Result Cards */}
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile) => (
                <ProfileResultCard
                  key={profile.id}
                  profile={{ ...profile, isOnline: profile.isOnline || isOnline(profile.userId) }}
                  onAction={handleProfileAction}
                  onDecline={handleDeclineAction}
                  onMessage={handleMessageUser}
                  onUnfriend={handleUnfriend}
                  onNavigateProfile={(p) =>
                    p.userId
                      ? navigate(`/user/${p.userId}`)
                      : toast.info("Đây là dữ liệu mẫu")
                  }
                />
              ))
            ) : (
              /* Empty state */
              <div className="rounded-2xl bg-surface-container-lowest p-12 text-center text-on-surface shadow-sm border border-slate-200/80">
                <Icon
                  name="person_search"
                  size={48}
                  className="mx-auto text-outline mb-3"
                />
                <p className="font-bold text-base text-on-surface">
                  Không tìm thấy người dùng phù hợp
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  Thử tìm kiếm với tên hoặc @username khác hoặc đặt lại bộ lọc.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("all");
                    setOnlineOnly(false);
                    setSelectedLocation("all");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-semibold hover:bg-primary transition-colors cursor-pointer shadow-sm"
                >
                  Xem tất cả người dùng
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
