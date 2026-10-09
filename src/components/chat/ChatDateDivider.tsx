import React from "react";
import { Text, View } from "react-native";

export interface ChatDateDividerProps {
  label: string;
}

export function ChatDateDivider({ label }: ChatDateDividerProps) {
  return (
    <View className="my-2.5 items-center justify-center">
      <View className="rounded-full bg-slate-100 px-3 py-1">
        <Text className="text-[11px] font-medium tracking-wide text-slate-500">
          {label}
        </Text>
      </View>
    </View>
  );
}
