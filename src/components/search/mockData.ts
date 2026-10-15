import type { ProfileResultData, PostResultData } from "./types";

export const MOCK_PROFILE_RESULTS: ProfileResultData[] = [
  {
    id: "u-phuong-linh",
    name: "Nguyễn Phương Linh",
    followers: "920 người theo dõi",
    location: "Sống tại Nam Định",
    mutualFriends: "15 bạn chung",
    handle: "@phuonglinh.nguyen",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    relationshipStatus: "not_friend",
    isOnline: true,
  },
  {
    id: "u-pham-huyen",
    name: "Phạm Huyền (Hyeon)",
    category: "Người sáng tạo nội dung",
    followers: "2,2K người theo dõi",
    location: "Sống tại Hà Nội",
    mutualFriends: "8 bạn chung",
    handle: "@Hyeon2k1chimte",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    relationshipStatus: "request_sent",
    isOnline: true,
  },
  {
    id: "u-nam-nguyen",
    name: "Nguyễn Hoàng Nam",
    category: "Lập trình viên",
    followers: "1,5K người theo dõi",
    handle: "@namnguyen.dev",
    location: "Sống tại TP. Hồ Chí Minh",
    mutualFriends: "24 bạn chung",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD652T6OBKeQqQDucopa7u1I4b0kCECGftKSOX9r3C2OZFedflOMBMSgSLmH3JBu90AEVY09hT9iUKQQw_11aK9Fgrxv-aZr4cvCfB9qhkz2OB9Y7Z_zA440wua9sBVLcOrqpjiwiT_yyO3UVs4hgfHuNgzPJK4y7rNK-F1EPCfLD2xVKmnrqJIS1fDh5Mw7lcjwey20IVEyC8a-EIuTNQQGb_d_Vcjgrompk1IUIsOs_74NQWWxMqs",
    relationshipStatus: "friend",
    isOnline: true,
  },
  {
    id: "u-mai-le",
    name: "Lê Thị Mai",
    category: "Thiết kế UI/UX",
    followers: "980 người theo dõi",
    handle: "@maile_design",
    location: "Sống tại Đà Nẵng",
    mutualFriends: "3 bạn chung",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    relationshipStatus: "not_friend",
    isOnline: false,
  },
  {
    id: "u-binh-tran",
    name: "Trần Văn Bình",
    category: "Nhiếp ảnh gia",
    followers: "3,1K người theo dõi",
    handle: "@binhtran_photo",
    location: "Sống tại Hà Nội",
    mutualFriends: "11 bạn chung",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    relationshipStatus: "not_friend",
    isOnline: true,
  },
];

export const MOCK_PROFILE_RESULT: ProfileResultData = MOCK_PROFILE_RESULTS[0];

export const MOCK_POST_RESULT: PostResultData = {
  id: "p-may-mo-mam",
  authorName: "Mẩy Mò Mẫm",
  authorAvatar:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
  isAuthorOnline: true,
  timeText: "16 tháng 9 lúc 15:06",
  content: "Quầy vải Phạm Huyền - Tầng 2 Chợ Hôm - Sđt : 096.388.9430",
  hashtags: ["#vaidep", "#maydo", "#thoitrang", "#chovai"],
  imageUrl:
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80",
  likesCount: 56,
  commentsCount: 12,
  sharesCount: 3,
};
