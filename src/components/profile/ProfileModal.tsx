import { useEffect, type ReactNode } from "react";

import { Icon, Spinner } from "@/components/common";

export interface ProfileModalProps {
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  submitLabel?: string;
  children: ReactNode;
}

// Hộp thoại dùng chung cho các form sửa hồ sơ (Esc / bấm nền tối để đóng)
export function ProfileModal({
  title,
  onClose,
  onSubmit,
  submitting = false,
  submitLabel = "Lưu",
  children,
}: ProfileModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          if (!submitting) onSubmit();
        }}
        className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <h3 className="text-base font-bold text-on-surface">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-surface-container"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-3.5 overflow-y-auto px-5 py-4">{children}</div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container"
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary-container px-4 py-2 text-sm font-semibold text-white hover:bg-primary disabled:opacity-60"
          >
            {submitting && <Spinner size={14} />}
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
