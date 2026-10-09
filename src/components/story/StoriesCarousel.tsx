import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { DefaultAvatar } from "@/components/common";
import { StoryItem } from "./types";

export interface StoriesCarouselProps {
  stories: StoryItem[];
  userStoryAvatar?: string;
  onAddStory?: () => void;
  onStoryPress?: (story: StoryItem) => void;
}

export function StoriesCarousel({
  stories,
  userStoryAvatar,
  onAddStory,
  onStoryPress,
}: StoriesCarouselProps) {
  return (
    <View className="py-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
      >
        {/* Mục Tin của bạn */}
        <TouchableOpacity
          onPress={onAddStory}
          activeOpacity={0.8}
          className="w-[66px] items-center gap-1.5"
        >
          <View className="relative h-14 w-14 items-center justify-center rounded-full bg-slate-200 p-[2px]">
            {userStoryAvatar ? (
              <Image
                source={{ uri: userStoryAvatar }}
                style={{ width: "100%", height: "100%", borderRadius: 28 }}
                contentFit="cover"
              />
            ) : (
              <DefaultAvatar size={52} />
            )}
            <View className="absolute bottom-0 right-0 h-5 w-5 items-center justify-center rounded-full border-2 border-surface bg-primary shadow-sm">
              <MaterialIcons name="add" size={14} color="#ffffff" />
            </View>
          </View>
          <Text
            numberOfLines={1}
            className="w-full text-center text-[12px] font-medium text-slate-800"
          >
            Tin của bạn
          </Text>
        </TouchableOpacity>

        {/* Các Story / Danh bạ hoạt động */}
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            onPress={() => onStoryPress?.(story)}
            activeOpacity={0.8}
            className="w-[66px] items-center gap-1.5"
          >
            <View
              className={`relative h-14 w-14 items-center justify-center rounded-full p-[2px] ${
                story.hasStory
                  ? "border-2 border-primary bg-primary/10"
                  : "bg-transparent"
              }`}
            >
              {story.avatar ? (
                <Image
                  source={{ uri: story.avatar }}
                  style={{ width: "100%", height: "100%", borderRadius: 28 }}
                  contentFit="cover"
                />
              ) : (
                <DefaultAvatar size={52} />
              )}
              {story.isOnline && (
                <View className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface bg-emerald-500" />
              )}
            </View>
            <Text
              numberOfLines={1}
              className="w-full text-center text-[12px] font-medium text-slate-800"
            >
              {story.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
