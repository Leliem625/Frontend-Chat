import React from "react";
import { View } from "react-native";
import { cn } from "@/utils/cn";

export interface StatusChatProps {
  status: "online" | "offline";
  size?: number;
  bottom?: number;
  right?: number;
  className?: string;
}

export const StatusChat = ({
  status,
  size = 14,
  bottom = -2,
  right = -2,
  className,
}: StatusChatProps) => {
  const isOnline = status === "online";

  return (
    <View
      className={cn(
        "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white",
        isOnline ? "bg-accent-green" : "bg-gray-400",
        className
      )}
      style={{
        position: "absolute",
        bottom,
        right,
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: "#ffffff",
        backgroundColor: isOnline ? "#10b981" : "#94a3b8",
        zIndex: 20,
        elevation: 5,
      }}
    />
  );
};

export default StatusChat;
