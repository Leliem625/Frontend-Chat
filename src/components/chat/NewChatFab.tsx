import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

interface NewChatFabProps {
  onPress?: () => void;
}

export function NewChatFab({ onPress }: NewChatFabProps) {
  return (
    <View className="absolute bottom-5 right-5 z-40">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40 active:scale-95"
      >
        <MaterialIcons name="edit" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}
