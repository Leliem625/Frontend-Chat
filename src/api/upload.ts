import { api } from "@/api/client";
import type { UploadResult } from "@/types/api";

// File đã chọn từ máy (ảnh hoặc tài liệu), chưa tải lên
export type LocalFile = {
  uri: string;
  name: string;
  mimeType: string;
  size?: number;
  file?: File; // Chỉ có trên web
};

// Tải 1 file lên backend (Cloudinary), nhận lại url để gửi kèm tin nhắn
export function uploadFile(local: LocalFile) {
  const form = new FormData();
  if (local.file) {
    // Web: trình duyệt cần đúng đối tượng File
    form.append("file", local.file, local.name);
  } else {
    // iOS / Android: React Native đọc file từ uri
    form.append("file", {
      uri: local.uri,
      name: local.name,
      type: local.mimeType,
    } as unknown as Blob);
  }
  return api<UploadResult>("/api/upload", { method: "POST", body: form });
}
