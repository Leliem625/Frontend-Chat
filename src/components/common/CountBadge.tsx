import { cn } from "@/utils/cn";

// Chấm đỏ có số (badge) đặt ở góc trên phải của icon. count <= 0 thì không hiện
export function CountBadge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        "absolute -right-1.5 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold leading-none text-white ring-2 ring-surface-container-lowest",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
