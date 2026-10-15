import { cn } from "@/utils/cn";

export interface StatusChatProps {
  status: "online" | "offline";
  size?: number;
  bottom?: number;
  right?: number;
  className?: string;
}

// Chấm trạng thái ở góc avatar (cha phải có position: relative)
export const StatusChat = ({
  status,
  size = 14,
  bottom = -2,
  right = -2,
  className,
}: StatusChatProps) => {
  const isOnline = status === "online";

  return (
    <span
      className={cn("absolute z-20 rounded-full border-2 border-white shadow-sm", className)}
      style={{
        bottom,
        right,
        width: size,
        height: size,
        backgroundColor: isOnline ? "#10b981" : "#94a3b8",
      }}
    />
  );
};

export default StatusChat;
