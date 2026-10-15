import { useState } from "react";
import { Avatar, Icon } from "@/components/common";
import type { PostResultData } from "./types";

export interface PostResultCardProps {
  post: PostResultData;
  onLike?: (post: PostResultData) => void;
  onComment?: (post: PostResultData) => void;
  onShare?: (post: PostResultData) => void;
}

export function PostResultCard({
  post,
  onLike,
  onComment,
  onShare,
}: PostResultCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount ?? 48);

  const handleToggleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      setLikesCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
    onLike?.(post);
  };

  return (
    <article className="w-full rounded-2xl bg-surface-container-lowest border border-slate-200/80 p-5 text-on-surface shadow-[0_1px_6px_rgba(0,0,0,0.03)] transition-all duration-200">
      {/* 1. Author Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <Avatar
              uri={post.authorAvatar}
              size={40}
              isOnline={post.isAuthorOnline}
              name={post.authorName}
              className="ring-1 ring-slate-100"
            />
          </div>

          <div className="flex flex-col">
            <a
              href="#author-profile"
              className="font-semibold text-sm text-on-surface hover:underline hover:text-primary transition-colors"
            >
              {post.authorName}
            </a>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <span>{post.timeText}</span>
              <span>·</span>
              <Icon name="public" size={14} className="text-outline" />
            </div>
          </div>
        </div>

        <button
          type="button"
          title="Tùy chọn bài viết"
          className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
        >
          <Icon name="more_horiz" size={20} />
        </button>
      </div>

      {/* 2. Text Content */}
      <div className="mt-3.5 text-sm text-on-surface leading-relaxed whitespace-pre-line font-normal">
        <p>{post.content}</p>
        {post.hashtags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {post.hashtags.map((tag) => (
              <span
                key={tag}
                className="text-primary hover:underline cursor-pointer font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. Image Media */}
      {post.imageUrl && (
        <div className="mt-3.5 -mx-5 overflow-hidden bg-slate-900/5 flex justify-center max-h-[560px] border-y border-slate-100">
          <img
            src={post.imageUrl}
            alt="Hình ảnh bài viết"
            className="w-full h-auto max-h-[560px] object-cover"
          />
        </div>
      )}

      {/* 4. Stats Row */}
      <div className="mt-3 flex items-center justify-between py-2 text-xs text-on-surface-variant border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-container text-white text-[10px] shadow-xs">
            👍
          </span>
          <span className="font-medium text-on-surface">{likesCount}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{post.commentsCount ?? 12} bình luận</span>
          <span>{post.sharesCount ?? 3} lượt chia sẻ</span>
        </div>
      </div>

      {/* 5. Interaction Buttons (Like, Comment, Share) */}
      <div className="mt-1 flex items-center justify-between pt-1 gap-1">
        <button
          type="button"
          onClick={handleToggleLike}
          className={`flex flex-1 items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
            liked
              ? "text-primary-container bg-primary-container/10 font-semibold"
              : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          }`}
        >
          <Icon
            name="thumb_up"
            size={18}
            filled={liked}
            className={liked ? "text-primary-container" : undefined}
          />
          <span>Thích</span>
        </button>

        <button
          type="button"
          onClick={() => onComment?.(post)}
          className="flex flex-1 items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
        >
          <Icon name="chat_bubble_outline" size={18} />
          <span>Bình luận</span>
        </button>

        <button
          type="button"
          onClick={() => onShare?.(post)}
          className="flex flex-1 items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
        >
          <Icon name="share" size={18} />
          <span>Chia sẻ</span>
        </button>
      </div>
    </article>
  );
}
