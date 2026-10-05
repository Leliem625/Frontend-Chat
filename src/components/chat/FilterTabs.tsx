import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { FilterType } from "./types";

interface FilterTabsProps {
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
}

const TABS: { id: FilterType; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "unread", label: "Chưa đọc" },
  { id: "groups", label: "Nhóm" },
  { id: "channels", label: "Kênh" },
];

export function FilterTabs({ activeFilter, onSelectFilter }: FilterTabsProps) {
  return (
    <View className="px-4 py-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {TABS.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onSelectFilter(tab.id)}
              activeOpacity={0.8}
              className={`rounded-full px-4 py-1.5 ${
                isActive ? "bg-primary shadow-sm" : "bg-slate-100"
              }`}
            >
              <Text
                className={`text-[13px] font-semibold ${
                  isActive ? "text-white" : "text-slate-600"
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
