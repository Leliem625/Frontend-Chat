import { useState } from "react";

import { getUnreadConversationCount } from "@/api/conversation";
import { useConversationRead, useNewMessage, useSocketConnect } from "@/socket";

// Số cuộc trò chuyện còn tin chưa đọc (badge trên tab "Đoạn chat", kiểu Messenger).
// Lấy từ backend khi kết nối / kết nối lại, có tin mới hoặc vừa đọc 1 cuộc trò chuyện thì lấy lại
// (API chỉ là 1 câu COUNT nên gọi lại cho chắc đúng, khỏi tự cộng trừ dễ lệch)
export function useUnreadConversationCount() {
  const [count, setCount] = useState(0);

  const refresh = () => {
    getUnreadConversationCount()
      .then((r) => setCount(r.count))
      .catch(() => {});
  };

  useSocketConnect(refresh);
  useNewMessage(refresh);
  useConversationRead(refresh);

  return count;
}
