import { cn } from "@/utils/cn";

// Thay cho ActivityIndicator
export function Spinner({
  size = 20,
  color,
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <span
      role="status"
      aria-label="Đang tải"
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        className
      )}
      style={{ width: size, height: size, color }}
    />
  );
}
