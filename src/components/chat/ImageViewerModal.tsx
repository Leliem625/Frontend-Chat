import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Icon, Spinner } from "@/components/common";
import type { Attachment } from "@/types/api";
import { saveImageToGallery } from "@/utils/file";

export interface ImageViewerModalProps {
  image: Attachment | null; // null -> đóng
  onClose: () => void;
}

// Xem ảnh toàn màn hình ngay trong app (giống Messenger), muốn lưu về máy thì bấm nút tải
export function ImageViewerModal({ image, onClose }: ImageViewerModalProps) {
  const [saving, setSaving] = useState(false);

  // Bấm Esc để đóng
  useEffect(() => {
    if (!image) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [image, onClose]);

  const handleSave = async () => {
    if (!image || saving) return;
    setSaving(true);
    try {
      await saveImageToGallery(image);
      toast.success("Đã tải ảnh về máy");
    } catch (error: any) {
      toast.error("Không lưu được ảnh", { description: error?.message });
    } finally {
      setSaving(false);
    }
  };

  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col bg-black"
      onClick={onClose}
    >
      {/* Thanh trên: nút đóng & nút tải về */}
      <div
        className="flex flex-row items-center justify-between px-4 py-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25"
        >
          <Icon name="close" size={24} color="#ffffff" />
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          aria-label="Tải ảnh về máy"
          className="flex flex-row items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-white hover:bg-white/25"
        >
          {saving ? <Spinner size={18} /> : <Icon name="file-download" size={20} />}
          <span className="text-[14px] font-semibold">Tải về</span>
        </button>
      </div>

      {/* Ảnh hiển thị vừa màn hình (bấm ra ngoài ảnh để đóng) */}
      <div className="flex min-h-0 flex-1 items-center justify-center p-2">
        <img
          src={image.url}
          alt={image.fileName ?? ""}
          className="max-h-full max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
