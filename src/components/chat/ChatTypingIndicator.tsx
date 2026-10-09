import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";

import { DefaultAvatar } from "@/components/common";

export interface ChatTypingIndicatorProps {
  avatar?: string | null;
  name?: string;
  visible?: boolean;
}

export function ChatTypingIndicator({
  avatar,
  name = "Bạn bè",
  visible = true,
}: ChatTypingIndicatorProps) {
  const [dot1] = useState(() => new Animated.Value(0));
  const [dot2] = useState(() => new Animated.Value(0));
  const [dot3] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!visible) return;

    const createAnimation = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: -5,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = createAnimation(dot1, 0);
    const anim2 = createAnimation(dot2, 150);
    const anim3 = createAnimation(dot3, 300);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, [visible, dot1, dot2, dot3]);

  if (!visible) return null;

  return (
    <View className="mb-3 flex-row items-end gap-2 pt-1">
      {/* Avatar người đang soạn */}
      <View className="mb-0.5 h-7 w-7 shrink-0 overflow-hidden rounded-full">
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={{ width: 28, height: 28, borderRadius: 14 }}
            contentFit="cover"
          />
        ) : (
          <DefaultAvatar size={28} />
        )}
      </View>

      {/* Bong bóng 3 chấm nhấp nháy */}
      <View className="h-9 w-16 flex-row items-center justify-center gap-1.5 rounded-[18px] rounded-bl-xs bg-slate-100 px-3 shadow-xs">
        <Animated.View
          style={{ transform: [{ translateY: dot1 }] }}
          className="h-2 w-2 rounded-full bg-slate-500"
        />
        <Animated.View
          style={{ transform: [{ translateY: dot2 }] }}
          className="h-2 w-2 rounded-full bg-slate-500"
        />
        <Animated.View
          style={{ transform: [{ translateY: dot3 }] }}
          className="h-2 w-2 rounded-full bg-slate-500"
        />
      </View>

      <Text className="self-center text-[12px] italic text-slate-500">
        {name} đang soạn tin...
      </Text>
    </View>
  );
}
