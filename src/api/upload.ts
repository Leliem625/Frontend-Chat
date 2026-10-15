import { api } from "@/api/client";
import type { UploadResult } from "@/types/api";

// File đã chọn từ máy (ảnh hoặc tài liệu), chưa tải lên
export type LocalFile = {
  uri: string; // object URL để xem trước (URL.createObjectURL)
  name: string;
  mimeType: string;
  size?: number;
  file: File;
};

// Tải 1 file lên backend (Cloudinary), nhận lại url để gửi kèm tin nhắn
export function uploadFile(local: LocalFile) {
  const form = new FormData();
  form.append("file", local.file, local.name);
  return api<UploadResult>("/api/upload", { method: "POST", body: form });
}
