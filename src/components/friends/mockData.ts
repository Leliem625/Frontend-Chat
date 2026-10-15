import type { FilterCategoryItem, PersonItemData } from "./types";

export const FILTER_CATEGORIES: FilterCategoryItem[] = [
  { id: "people", label: "Mọi người", icon: "person", badge: "6+" },
  { id: "posts", label: "Bài viết", icon: "article" },
  { id: "groups", label: "Nhóm", icon: "groups" },
  { id: "pages", label: "Trang", icon: "flag" },
  { id: "photos", label: "Ảnh", icon: "image" },
  { id: "videos", label: "Video", icon: "smart_display" },
];

export const MOCK_PEOPLE: PersonItemData[] = [
  // 1. BẠN BÈ HIỆN TẠI (Trần Minh Khang)
  {
    id: "p1",
    name: "Trần Minh Khang",
    handle: "@minhkhang.tran",
    headline: "Kỹ sư giải pháp đám mây",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBv6hk_2rqqIoYCygBuCPU66O2qVM79HH_61U525_A6IYOK3BHP8oouuZqCSKfrwW5pA7je5qH-M6wl88aipx7fy4mNVZw9l__ZPxQGNUR2-PZBnuyoVvZ0xU1NaeKNaiwR_WoUeasM2xbMb9IZt5_VVy4LpKSLUlMz4tFy98S_Iz-1syuI0n8I9m5B7Zs7fhxw-P7FinWFB1OahxkFB30QaKHVgtNxellnzjdsWig",
    isOnline: true,
    relationship: "friend",
    badgeText: "Bạn bè",
    work: "TechCorp Vietnam",
    location: "TP. Hồ Chí Minh",
    mutualFriends: {
      count: 28,
      avatars: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDogbazw8G50x7MP6voJQoXDOkYmrBFUwBMm0LzPtkCgHPH_N0SPMuwH8btlp-0Wr5ZnO4gXb8LCXDCKqfotbP8xy-Tex0BWM9XIhIbpaQmKwMq4nA79oJkprpxJxnNIL--rM96K8AJiGetHROuQbDQ6_5Ok3hvKu-7LCkjz6drvtAW8Spe7Jln0IHQX_kEEZ997q08unvLmPWiNfuW4dZk5vy7uD1k2dnMaaAzAB4",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAzAzxlh0i-_GNLr866O-PXNoWRKNoCoUTb_11H_pS5ozPOyR__Kxf_a3BDa-kyTDP03Tz9lbnLd8qXPV_Ro9ggkf2JYClTY8cAaJGeeKKQVf-rorOuxfbyulVWxiSsTNM_icVVZORNRZl8bfRRCWvg6AIePbQxmJQlhQLC5hv6vh07KdQ3YWWHES1YXi2HeMRJqLj5ByySy4uuctw4h2q6LyGt-qQQDD1Ef0Xffr4",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDTTAx_9ejFXrxrxKMBz9uVGGH_zpkqf6MFioX18yYVSx2wbiPJo0sbcb7eBPmM4ozAfNW2LWJuZ1S1ma0J1VhLnKRifSqPeo7ZnKcGT5lfB7VBm24oCAYHfJceRcIjQ_Hr8WhYZnoPFyeo_XYexHQlDygR3rD5pNjpehatpQ9LSbxPCJTVPX-T663LlNBLq94rUp8-cgM4PyAimbS8akhPKN0alWhQfO7zl3tW5KY",
      ],
      names: "Nam, Huy, My",
    },
  },

  // 2. CHƯA KẾT BẠN - CÓ NHIỀU BẠN CHUNG (Lê Minh Tuấn)
  {
    id: "p2",
    name: "Lê Minh Tuấn",
    handle: "@tuan.leminh",
    headline: "Khoa Khoa học Máy tính",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBOIvG4e8oIqJrGzEe_MpKg1M7NINlKoYrb3JM9diDWZW2fJ_OfKpAYNYiFbN7B59R7LjRa-FWdfASs_8Kn7r3n2LFHLYRK0_-rkLcxLFdBRMxg6rmBhfBt7SuDFhA0XYj6CiYid2Jt-2AQuLCRzgQc9t51eeqt27yaQiuKVHP5L7_2IZkN_fU7Xlj7JYVABNZz1FKXNtckqO8_xRlGa6FC1n35yLj3o8d3FvT2coI",
    relationship: "not_friend",
    education: "Đại học Bách Khoa TP.HCM",
    location: "Đà Nẵng",
    mutualFriends: {
      count: 42,
    },
    mutualGroupsCount: 8,
  },

  // 3. ĐÃ GỬI LỜI MỜI KẾT BẠN (Minh Phương - Phương Xù)
  {
    id: "p3",
    name: "Minh Phương (Phương Xù)",
    handle: "@phuongxu.content",
    headline: "Sáng tạo nội dung",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDA2Hmd_iNNN5WQnVtT4f4NTQVW6aNtgZP6e5PkFqHwUUCER_OGl38GNZhIn0ttaMY-elqHvkhP9AL1MXqa26r3IIoetF08T1kU0He8YnUK-6hzRyGrZ3TdHGj38rASkciomYAcjGETRCoepsS6D99lO6FE7o1t4OhwG4yGHQGyBPqonEQS4AMgOkpXTjHRF9I_HgNK0Ph35cf3szk0jkQJl6HzZJ3ngMhVeZiNDW8",
    relationship: "request_sent",
    cameraRole: "Content Creator • Lifestyle, Tech & Design",
    location: "Hà Nội",
    mutualFriends: {
      count: 12,
    },
  },

  // 4. CÓ LỜI MỜI KẾT BẠN ĐANG CHỜ PHẢN HỒI (Đỗ Quang Minh)
  {
    id: "p4",
    name: "Đỗ Quang Minh",
    handle: "@minh.doquang",
    headline: "Senior Developer",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNcKCd_TtrVkZOnMI7u4OMGD3bBFRBhPSVTLu50fjgRDwvfWZ5hR5pClBPCI6BBS4H2Q0g43Vmyfiv3vuNpehJKlQzA17kaHVCvhH7B2cw6nS4A6y5u44zS-1PMG5S89_AgGlECbRQttg7cRuPHNQRwWoG_dV0p8ejealfWjybHEFnu0JoF9PmrUw4b5bRLzMxIgeSVguI5V9moG70uIaYZcxVIL42KsVPHL3HSXU",
    isOnline: true,
    relationship: "request_received",
    badgeText: "Đã gửi cho bạn lời mời kết bạn",
    seniorRole: "Fintech Corp",
    education: "ĐH Bách Khoa",
    mutualFriends: {
      count: 5,
      names: "Văn Cường và Linh Đan",
    },
  },

  // 5. NGƯỜI CÓ THỂ QUEN BIẾT THEO CÔNG TY / VỊ TRÍ (Hoàng Thảo Minh)
  {
    id: "p5",
    name: "Hoàng Thảo Minh",
    handle: "@thaominh.design",
    headline: "Graphic & Product Designer",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDDbOhwu0XIqo_ISnMpmQXOtzhh_HJBobtVF6rWZn9WjFVEwIja83eNc8l70Epghtv0FIqdSoenPc0bMj_QmfYKM3Nq9NL5rDu6_A7r2DyufjiuIrMzSaCgHGorCWpssCN0AiVaOv023aBjBVR3ItpVxZpWKmoXkiUrhupSnYW23aYLTD91NUx6PHRk6reSwg6c1ARO4LFdYcOKaeX0cYHaeXWB1gd1J2wPv8axoXQ",
    relationship: "suggestion",
    work: "Shopee Vietnam",
    location: "TP. Hồ Chí Minh",
    interests: "Design Systems, Typography",
  },

  // 6. NGƯỜI THEO DÕI / TRANG CÁ NHÂN CÔNG KHAI (Minh Beta)
  {
    id: "p6",
    name: "Minh Beta",
    handle: "@minhbeta.official",
    headline: "Doanh nhân • Diễn giả",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAhug7g7iLo9I-uJ00d8X9yNiKCZQ2FmAK61Dm2qXBQ4S154doosdzvgGIiIFgKecHApdasWtMW75nuxZHkupSTO8F7npV0YyKrvVsT1P9FRbXudPJzMTr90bUCBeKtxfB_HhstIZRNmpx3AayFZOw3HcL658tgzk8IzMujIE6ZyKfUnTL2I4zLVsBqlEGT0nBDPFH2mFJcRb1pweue8J7kZSOlKlsEa2d-zWM2sfE",
    isVerified: true,
    relationship: "public_figure",
    badgeText: "Người của công chúng",
    domainRole: "Beta Group",
    followers: "120.500 người theo dõi • 45 bài viết công khai gần đây",
  },
];
