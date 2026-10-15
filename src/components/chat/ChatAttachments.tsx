import { useState } from "react";
import { toast } from "sonner";

import { Icon, Spinner } from "@/components/common";
import type { Attachment } from "@/types/api";
import { fileExtension, fileIconName, formatFileSize, openAttachmentFile } from "@/utils/file";
import type { MessageDeliveryStatus } from "./types";

export interface ChatAttachmentsProps {
  attachments: Attachment[];
  isMe: boolean;
  status?: MessageDeliveryStatus;
  errorMessage?: string;
  onRetry?: () => void;
  onImagePress?: (image: Attachment, images: Attachment[]) => void;
}

export function ChatAttachments({
  attachments,
  isMe,
  status,
  errorMessage,
  onRetry,
  onImagePress,
}: ChatAttachmentsProps) {
  const images = attachments.filter((a) => a.resourceType === "image");
  const files = attachments.filter((a) => a.resourceType !== "image");

  return (
    <div className={`flex flex-col gap-1.5 ${isMe ? "items-end" : "items-start"}`}>
      {images.length > 0 && (
        <ImageGrid
          images={images}
          isMe={isMe}
          status={status}
          errorMessage={errorMessage}
          onRetry={onRetry}
          onImagePress={onImagePress}
        />
      )}
      {files.map((file) => (
        <FileBubble
          key={file.id}
          file={file}
          isMe={isMe}
          status={status}
          onRetry={onRetry}
        />
      ))}
    </div>
  );
}

function ImageGrid({
  images,
  isMe,
  status,
  errorMessage,
  onRetry,
  onImagePress,
}: {
  images: Attachment[];
  isMe: boolean;
  status?: MessageDeliveryStatus;
  errorMessage?: string;
  onRetry?: () => void;
  onImagePress?: (image: Attachment, images: Attachment[]) => void;
}) {
  const single = images.length === 1;

  if (single) {
    const img = images[0];
    return (
      <div
        className={`relative p-1 rounded-2xl overflow-hidden max-w-sm shadow-xs ${
          isMe
            ? "rounded-br-sm bg-primary-container"
            : "rounded-bl-sm bg-surface-container"
        }`}
      >
        <div className="relative overflow-hidden rounded-xl">
          <button
            type="button"
            onClick={() => {
              if (status !== "sending" && status !== "failed") {
                onImagePress?.(img, images);
              }
            }}
            className="block w-full overflow-hidden transition-opacity hover:opacity-95"
          >
            <img
              src={img.url}
              alt={img.fileName ?? ""}
              loading="lazy"
              className={`w-full h-52 object-cover transition-all ${
                status === "sending"
                  ? "brightness-75"
                  : status === "failed"
                  ? "brightness-50"
                  : ""
              }`}
            />
          </button>

          {/* Sending overlay */}
          {status === "sending" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1.5px] text-white pointer-events-none">
              <div className="flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-1.5 shadow-md backdrop-blur-md">
                <Spinner size={16} className="border-white border-t-transparent" />
                <span className="font-label-sm text-xs font-medium">Đang gửi...</span>
              </div>
            </div>
          )}

          {/* Failed overlay */}
          {status === "failed" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 p-3 text-center backdrop-blur-[2px]">
              <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-error/20 text-rose-300">
                <Icon name="error_outline" size={22} className="text-rose-400" />
              </div>
              <span className="font-label-sm text-xs font-semibold text-rose-200">
                {errorMessage || "Gửi lỗi"}
              </span>
              {onRetry && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRetry();
                  }}
                  className="mt-2.5 flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-white/40 active:scale-95 transition-all"
                >
                  <Icon name="refresh" size={14} />
                  <span>Thử lại</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative p-1 rounded-2xl overflow-hidden max-w-sm shadow-xs ${
        isMe
          ? "rounded-br-sm bg-primary-container"
          : "rounded-bl-sm bg-surface-container"
      }`}
    >
      <div className="relative rounded-xl overflow-hidden">
        <div className="grid grid-cols-2 gap-1 overflow-hidden">
          {images.map((img) => (
            <button
              type="button"
              key={img.id}
              onClick={() => {
                if (status !== "sending" && status !== "failed") {
                  onImagePress?.(img, images);
                }
              }}
              className="relative aspect-square overflow-hidden bg-surface-container transition-opacity hover:opacity-95"
            >
              <img
                src={img.url}
                alt={img.fileName ?? ""}
                loading="lazy"
                className={`h-full w-full object-cover transition-all ${
                  status === "sending"
                    ? "brightness-75"
                    : status === "failed"
                    ? "brightness-50"
                    : ""
                }`}
              />
            </button>
          ))}
        </div>

        {/* Sending overlay */}
        {status === "sending" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1.5px] text-white pointer-events-none">
            <div className="flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-1.5 shadow-md backdrop-blur-md">
              <Spinner size={16} className="border-white border-t-transparent" />
              <span className="font-label-sm text-xs font-medium">
                Đang gửi {images.length} ảnh...
              </span>
            </div>
          </div>
        )}

        {/* Failed overlay */}
        {status === "failed" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 p-3 text-center backdrop-blur-[2px]">
            <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-error/20 text-rose-300">
              <Icon name="error_outline" size={22} className="text-rose-400" />
            </div>
            <span className="font-label-sm text-xs font-semibold text-rose-200">
              {errorMessage || "Gửi lỗi"}
            </span>
            {onRetry && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRetry();
                }}
                className="mt-2.5 flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-white/40 active:scale-95 transition-all"
              >
                <Icon name="refresh" size={14} />
                <span>Thử lại</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FileBubble({
  file,
  isMe,
  status,
  onRetry,
}: {
  file: Attachment;
  isMe: boolean;
  status?: MessageDeliveryStatus;
  onRetry?: () => void;
}) {
  const [downloading, setDownloading] = useState(false);

  const isSending = status === "sending";
  const isFailed = status === "failed";

  const handlePress = async () => {
    if (isFailed) {
      onRetry?.();
      return;
    }
    if (isSending) {
      toast.info("Tệp đang được tải lên...");
      return;
    }
    if (downloading) return;
    setDownloading(true);
    try {
      await openAttachmentFile(file);
    } catch (error: any) {
      toast.error("Không mở được file", { description: error?.message });
    } finally {
      setDownloading(false);
    }
  };

  const meta = [formatFileSize(file.size), fileExtension(file.fileName)]
    .filter(Boolean)
    .join(" • ");

  return (
    <button
      type="button"
      onClick={handlePress}
      className={`group flex max-w-xs items-center gap-space-sm rounded-2xl p-space-sm text-left transition-all ${
        isFailed
          ? "border border-error/50 bg-error/10 text-on-surface rounded-br-sm shadow-sm hover:bg-error/15"
          : isMe
          ? "rounded-br-sm bg-primary-container text-on-primary-container shadow-sm"
          : "rounded-bl-sm bg-surface-container text-on-surface shadow-xs hover:bg-surface-container-high"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
          isFailed
            ? "bg-error/20 text-error"
            : isSending || downloading
            ? isMe ? "bg-white/20 text-white" : "bg-primary-container/15 text-primary"
            : isMe
            ? "bg-white/20 text-white"
            : "bg-primary-container/15 text-primary"
        }`}
      >
        {isSending || downloading ? (
          <Spinner
            size={18}
            className={isMe && !isFailed ? "border-white border-t-transparent" : undefined}
          />
        ) : isFailed ? (
          <Icon name="error_outline" size={20} className="text-error" />
        ) : (
          <Icon name={fileIconName(file.fileName)} size={20} />
        )}
      </span>

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-body-sm text-body-sm font-semibold">
          {file.fileName || "Tệp đính kèm"}
        </span>
        <span
          className={`font-label-sm text-[11px] flex items-center gap-1 ${
            isFailed
              ? "text-error font-medium"
              : isSending
              ? isMe ? "text-white/80" : "text-primary"
              : isMe
              ? "text-white/80"
              : "text-outline"
          }`}
        >
          {isSending ? (
            <>
              <span>Đang tải lên...</span>
              {meta ? <span>• {meta}</span> : null}
            </>
          ) : isFailed ? (
            <>
              <span>Gửi lỗi</span>
              <span>• Nhấn để thử lại</span>
            </>
          ) : (
            meta || "Nhấn để tải"
          )}
        </span>
      </span>

      {isFailed && (
        <span className="shrink-0 p-1 text-error group-hover:scale-110 transition-transform">
          <Icon name="refresh" size={16} />
        </span>
      )}
    </button>
  );
}
