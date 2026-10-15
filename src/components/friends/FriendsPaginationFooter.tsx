import { Icon } from "@/components/common";

export interface FriendsPaginationFooterProps {
  query?: string;
  displayedCount?: number;
  totalCount?: number;
  loading?: boolean;
  onLoadMore?: () => void;
  className?: string;
}

export function FriendsPaginationFooter({
  query = "Minh",
  displayedCount = 6,
  totalCount = 148,
  loading = false,
  onLoadMore,
  className = "",
}: FriendsPaginationFooterProps) {
  return (
    <div
      className={`mt-space-md mb-space-xl flex flex-col items-center justify-center p-space-lg bg-surface-container-lowest rounded-lg shadow-sm gap-space-sm ${className}`}
    >
      <button
        type="button"
        onClick={onLoadMore}
        disabled={loading}
        className="flex items-center justify-center gap-space-sm px-space-xl py-space-sm rounded-full bg-surface-container-low hover:bg-surface-container text-primary font-label-lg text-label-lg transition-colors cursor-pointer disabled:opacity-60"
      >
        <Icon
          name="progress_activity"
          size={18}
          className={loading ? "animate-spin text-primary" : "text-primary"}
        />
        <span>Xem thêm kết quả tìm kiếm cho “{query}”</span>
      </button>

      <p className="font-body-sm text-body-sm text-outline text-center">
        Đang hiển thị {displayedCount} trên tổng số {totalCount} người dùng khớp tiêu chí
      </p>
    </div>
  );
}
