/**
 * Định dạng thời gian tin nhắn cho danh sách đoạn chat:
 * - Hôm nay: "10:42"
 * - Hôm qua: "Hôm qua"
 * - Cùng năm: "12 thg 5"
 * - Khác năm: "12/05/2025"
 */
export function formatConversationTime(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";

    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return "Hôm qua";
    }

    if (date.getFullYear() === now.getFullYear()) {
      return `${date.getDate()} thg ${date.getMonth() + 1}`;
    }

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  } catch {
    return "";
  }
}

/**
 * Thời gian tương đối cho thông báo: "Vừa xong", "5 phút", "3 giờ", "2 ngày", quá 1 tuần thì hiện ngày.
 */
export function formatRelativeTime(dateStr?: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const seconds = Math.max(0, (Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Vừa xong";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} phút`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ`;
  if (seconds < 7 * 86400) return `${Math.floor(seconds / 86400)} ngày`;
  return date.toLocaleDateString("vi-VN");
}
