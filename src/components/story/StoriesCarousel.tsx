import { Avatar, Icon } from "@/components/common";
import type { StoryItem } from "./types";

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
    <div className="py-2">
      <div className="flex flex-row gap-[14px] overflow-x-auto px-4 [scrollbar-width:none]">
        {/* Mục Tin của bạn */}
        <button
          type="button"
          onClick={onAddStory}
          className="flex w-[66px] shrink-0 flex-col items-center gap-1.5 transition active:opacity-80 cursor-pointer"
        >
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 p-[2px]">
            <Avatar uri={userStoryAvatar} size={52} />
            <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-surface bg-primary shadow-sm">
              <Icon name="add" size={14} color="#ffffff" />
            </div>
          </div>
          <span className="w-full truncate text-center text-[12px] font-medium text-slate-800">
            Tin của bạn
          </span>
        </button>

        {/* Các Story / Danh bạ hoạt động */}
        {stories.map((story) => (
          <button
            type="button"
            key={story.id}
            onClick={() => onStoryPress?.(story)}
            className="flex w-[66px] shrink-0 flex-col items-center gap-1.5 transition active:opacity-80 cursor-pointer"
          >
            <div
              className={`relative flex h-14 w-14 items-center justify-center rounded-full p-[2px] ${
                story.hasStory
                  ? "border-2 border-primary bg-primary/10"
                  : "bg-transparent"
              }`}
            >
              <Avatar uri={story.avatar} size={52} isOnline={story.isOnline} name={story.name} />
            </div>
            <span className="w-full truncate text-center text-[12px] font-medium text-slate-800">
              {story.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
