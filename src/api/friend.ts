import { get } from "@/api/client";
import type { Conversation } from "@/types/api";

export async function getConversations() {
  return get<Conversation[]>("/api/conversation/list");
}
