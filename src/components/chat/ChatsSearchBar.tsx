import { MaterialIcons } from "@expo/vector-icons";
import { TextInput, TouchableOpacity, View } from "react-native";

interface ChatsSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onVoiceSearchPress?: () => void;
  placeholder?: string;
}

export function ChatsSearchBar({
  value,
  onChangeText,
  onVoiceSearchPress,
  placeholder = "Tìm kiếm trên đoạn chat hoặc tin nhắn...",
}: ChatsSearchBarProps) {
  return (
    <View className="px-4 pb-2 pt-1">
      <View className="h-11 flex-row items-center rounded-full bg-slate-100 px-3.5">
        <MaterialIcons name="search" size={20} color="#94a3b8" />
        <TextInput
          className="ml-2.5 h-full flex-1 text-[14px] text-slate-900"
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          value={value}
          onChangeText={onChangeText}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity
          onPress={onVoiceSearchPress}
          activeOpacity={0.7}
          className="p-1"
        >
          <MaterialIcons name="mic" size={19} color="#94a3b8" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
