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

// Chọn icon theo loại file (tên icon Material)
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

// Tải file về máy với đúng tên gốc. Link khác domain (Cloudinary) thì thuộc tính download
// bị trình duyệt bỏ qua, nên tải qua blob trước; lỗi CORS thì mở tab mới.
async function downloadFile(url: string, fileName: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(String(response.status));
    const blobUrl = URL.createObjectURL(await response.blob());
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch {
    window.open(url, "_blank", "noopener");
  }
}

// Bấm vào tin nhắn file: mở trên tab mới để trình duyệt tự xem / tải
export async function openAttachmentFile(att: Attachment) {
  window.open(att.url, "_blank", "noopener");
}

// Nút "Tải về" khi xem ảnh
export async function saveImageToGallery(att: Attachment) {
  await downloadFile(att.url, att.fileName || `image_${att.id}.jpg`);
}
