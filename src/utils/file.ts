import { File, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

import type { Attachment } from "@/types/api";

/**
 * Định dạng dung lượng file giống Messenger:
 * 512 -> "512 B", 245760 -> "240 KB", 3145728 -> "3,0 MB"
 */
export function formatFileSize(bytes?: number | null): string {
  if (bytes == null || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

// Lấy đuôi file để hiển thị: "baocao.pdf" -> "PDF"
export function fileExtension(fileName?: string | null): string {
  if (!fileName) return "";
  const dot = fileName.lastIndexOf(".");
  return dot >= 0 ? fileName.substring(dot + 1).toUpperCase() : "";
}

// Chọn icon theo loại file (tên icon của MaterialIcons)
export function fileIconName(
  fileName?: string | null
): "picture-as-pdf" | "description" | "table-chart" | "folder-zip" | "insert-drive-file" {
  const ext = fileExtension(fileName);
  if (ext === "PDF") return "picture-as-pdf";
  if (ext === "DOC" || ext === "DOCX" || ext === "TXT") return "description";
  if (ext === "XLS" || ext === "XLSX" || ext === "CSV") return "table-chart";
  if (ext === "ZIP" || ext === "RAR") return "folder-zip";
  return "insert-drive-file";
}

// Tải file về cache của app (đã tải rồi thì dùng lại, không tải lại)
async function downloadToCache(url: string, fileName: string, id: number | string) {
  // Gắn id vào trước để 2 file trùng tên không đè lên nhau, vẫn giữ đuôi file gốc
  const safeName = fileName.replace(/[\\/:*?"<>|]/g, "_");
  const target = new File(Paths.cache, `${id}_${safeName}`);
  if (target.exists) return target;
  return File.downloadFileAsync(url, target);
}

/**
 * Bấm vào tin nhắn file: tải về rồi mở bảng "Mở bằng / Lưu vào..." của hệ điều hành
 * (iOS: Lưu vào Tệp, mở bằng Word...; Android: chọn app để mở / lưu)
 */
export async function openAttachmentFile(att: Attachment) {
  const fileName = att.fileName || `file_${att.id}`;

  // Web không có hệ thống file của app -> mở link trên tab mới để trình duyệt tự tải
  if (Platform.OS === "web") {
    window.open(att.url, "_blank");
    return;
  }

  const file = await downloadToCache(att.url, fileName, att.id);
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("Thiết bị không hỗ trợ mở file");
  }
  await Sharing.shareAsync(file.uri, {
    mimeType: att.mimeType,
    dialogTitle: fileName,
  });
}

/**
 * Lưu ảnh vào thư viện ảnh của máy (nút "Tải về" khi xem ảnh)
 */
export async function saveImageToGallery(att: Attachment) {
  if (Platform.OS === "web") {
    window.open(att.url, "_blank");
    return;
  }

  // Chỉ xin quyền ghi (writeOnly) để lưu ảnh, không cần quyền đọc thư viện
  const { granted } = await MediaLibrary.requestPermissionsAsync(true);
  if (!granted) {
    throw new Error("Bạn chưa cấp quyền lưu ảnh vào thư viện");
  }

  const file = await downloadToCache(att.url, att.fileName || `image_${att.id}.jpg`, att.id);
  await MediaLibrary.saveToLibraryAsync(file.uri);
}
