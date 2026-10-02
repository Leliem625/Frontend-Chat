import { useLocalSearchParams } from "expo-router";

import { Placeholder } from "@/components/placeholder";

// TODO: lấy lịch sử tin nhắn của cuộc trò chuyện, ô nhập và gửi tin, gửi ảnh / file
export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Placeholder title={`Cuộc trò chuyện #${id}`} />;
}
