import { useState } from "react";
import { Avatar, Icon } from "@/components/common";
import type { PersonItemData } from "./types";

export interface PersonCardProps {
  person: PersonItemData;
  onMessage?: (person: PersonItemData) => void;
  onAddFriend?: (person: PersonItemData) => void;
  onAcceptRequest?: (person: PersonItemData) => void;
  onRejectRequest?: (person: PersonItemData) => void;
  onCancelRequest?: (person: PersonItemData) => void;
  onFollow?: (person: PersonItemData) => void;
  onHideSuggestion?: (person: PersonItemData) => void;
  onManageFriendship?: (person: PersonItemData) => void;
}

export function PersonCard({
  person,
  onMessage,
  onAddFriend,
  onAcceptRequest,
  onRejectRequest,
  onCancelRequest,
  onFollow,
  onHideSuggestion,
  onManageFriendship,
}: PersonCardProps) {
  const [showFriendMenu, setShowFriendMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isRequestReceived = person.relationship === "request_received";

  return (
    <article
      className={`bg-surface-container-lowest rounded-lg p-space-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
        isRequestReceived ? "border-l-4 border-primary" : ""
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
        {/* Left: Avatar & Info */}
        <div className="flex items-start gap-space-md">
          {/* Avatar with Online/Offline indicator */}
          <div className="relative shrink-0">
            <Avatar
              uri={person.avatar}
              size={80}
              isOnline={person.isOnline}
              name={person.name}
              className="shadow-sm"
            />
          </div>

          {/* Details Column */}
          <div className="flex flex-col min-w-0">
            {/* Name + Badges */}
            <div className="flex items-center gap-space-xs flex-wrap">
              <a
                href={`#profile-${person.id}`}
                className="font-headline-sm text-headline-sm text-on-surface hover:underline font-semibold"
              >
                {person.name}
              </a>

              {/* Verified Badge */}
              {person.isVerified && (
                <span
                  className="inline-flex items-center text-primary"
                  title="Tài khoản đã xác minh"
                >
                  <Icon name="verified" size={18} filled className="text-primary" />
                </span>
              )}

              {/* Relationship Badge */}
              {person.badgeText && (
                <span
                  className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full ${
                    person.relationship === "request_received"
                      ? "text-primary bg-primary-fixed font-semibold"
                      : person.relationship === "friend"
                        ? "text-on-surface-variant bg-secondary-container"
                        : "text-on-surface-variant bg-surface-container"
                  }`}
                >
                  {person.badgeText}
                </span>
              )}
            </div>

            {/* Handle & Headline */}
            <p className="font-body-sm text-body-sm text-outline mt-0.5">
              {person.handle} • {person.headline}
            </p>

            {/* Detail Rows */}
            <div className="mt-space-sm flex flex-col gap-1 text-on-surface-variant font-body-sm text-body-sm">
              {/* Work */}
              {person.work && (
                <div className="flex items-center gap-space-xs truncate">
                  <Icon name="work" size={18} className="text-outline shrink-0" />
                  <span>
                    Làm việc tại{" "}
                    <strong className="text-on-surface font-medium">
                      {person.work}
                    </strong>
                  </span>
                </div>
              )}

              {/* Senior Role */}
              {person.seniorRole && (
                <div className="flex items-center gap-space-xs truncate">
                  <Icon name="badge" size={18} className="text-outline shrink-0" />
                  <span>
                    Senior Backend Lead tại{" "}
                    <strong className="text-on-surface font-medium">
                      {person.seniorRole}
                    </strong>
                  </span>
                </div>
              )}

              {/* Domain / Company */}
              {person.domainRole && (
                <div className="flex items-center gap-space-xs truncate">
                  <Icon name="domain" size={18} className="text-outline shrink-0" />
                  <span>
                    Chủ tịch &amp; Nhà sáng lập tại{" "}
                    <strong className="text-on-surface font-medium">
                      {person.domainRole}
                    </strong>
                  </span>
                </div>
              )}

              {/* Education */}
              {person.education && (
                <div className="flex items-center gap-space-xs truncate">
                  <Icon name="school" size={18} className="text-outline shrink-0" />
                  <span>
                    {person.relationship === "request_received"
                      ? "Cựu sinh viên "
                      : "Sinh viên tại "}
                    <strong className="text-on-surface font-medium">
                      {person.education}
                    </strong>
                  </span>
                </div>
              )}

              {/* Camera / Content Creator */}
              {person.cameraRole && (
                <div className="flex items-center gap-space-xs truncate">
                  <Icon
                    name="camera_alt"
                    size={18}
                    className="text-outline shrink-0"
                  />
                  <span>{person.cameraRole}</span>
                </div>
              )}

              {/* Location */}
              {person.location && (
                <div className="flex items-center gap-space-xs truncate">
                  <Icon
                    name={
                      person.relationship === "not_friend"
                        ? "location_city"
                        : person.relationship === "suggestion"
                          ? "location_on"
                          : "home_pin"
                    }
                    size={18}
                    className="text-outline shrink-0"
                  />
                  <span>
                    {person.relationship === "not_friend"
                      ? "Đến từ "
                      : "Sống tại "}
                    <strong className="text-on-surface font-medium">
                      {person.location}
                    </strong>
                  </span>
                </div>
              )}

              {/* Interests */}
              {person.interests && (
                <div className="flex items-center gap-space-xs mt-0.5">
                  <Icon
                    name="interests"
                    size={18}
                    className="text-outline shrink-0"
                  />
                  <span className="text-outline">
                    Có cùng sở thích về{" "}
                    <span className="text-on-surface font-medium">
                      {person.interests}
                    </span>
                  </span>
                </div>
              )}

              {/* Followers & Stats */}
              {person.followers && (
                <div className="flex items-center gap-space-xs truncate">
                  <Icon
                    name="podcasts"
                    size={18}
                    className="text-outline shrink-0"
                  />
                  <span>{person.followers}</span>
                </div>
              )}

              {/* Mutual Friends with Avatars */}
              {person.mutualFriends?.avatars && (
                <div className="flex items-center gap-space-xs mt-0.5">
                  <div className="flex -space-x-2 overflow-hidden shrink-0">
                    {person.mutualFriends.avatars.map((av, idx) => (
                      <Avatar
                        key={idx}
                        uri={av}
                        size={20}
                        className="inline-block ring-2 ring-white"
                      />
                    ))}
                  </div>
                  <span className="text-outline text-body-sm pl-1">
                    {person.mutualFriends.count} bạn chung gồm{" "}
                    <span className="text-on-surface font-medium">
                      {person.mutualFriends.names}
                    </span>
                  </span>
                </div>
              )}

              {/* Mutual Friends without Avatars (not_friend / suggestion / request) */}
              {!person.mutualFriends?.avatars && person.mutualFriends?.count && (
                <div className="flex items-center gap-space-xs mt-0.5">
                  {person.mutualGroupsCount ? (
                    <>
                      <Icon
                        name="diversity_3"
                        size={18}
                        className="text-primary shrink-0"
                      />
                      <span className="text-primary font-medium">
                        {person.mutualFriends.count} bạn chung
                      </span>
                      <span className="text-outline">
                        • {person.mutualGroupsCount} nhóm chung
                      </span>
                    </>
                  ) : (
                    <>
                      <Icon
                        name="group"
                        size={18}
                        className="text-outline shrink-0"
                      />
                      <span className="text-outline">
                        {person.mutualFriends.count} bạn chung
                        {person.mutualFriends.names && (
                          <>
                            {" "}
                            bao gồm{" "}
                            <strong className="text-on-surface font-medium">
                              {person.mutualFriends.names}
                            </strong>
                          </>
                        )}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-space-sm self-end lg:self-center shrink-0">
          {/* Case 1: Friend */}
          {person.relationship === "friend" && (
            <>
              <button
                type="button"
                onClick={() => onMessage?.(person)}
                className="flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg hover:bg-primary transition-colors shadow-sm cursor-pointer"
              >
                <Icon name="chat" size={18} className="text-white" />
                <span>Nhắn tin</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFriendMenu((prev) => !prev)}
                  className="flex items-center gap-space-xs px-space-md py-space-sm rounded-full bg-secondary-container text-on-secondary-fixed font-label-lg text-label-lg hover:bg-surface-variant transition-colors cursor-pointer"
                >
                  <Icon
                    name="how_to_reg"
                    size={18}
                    filled
                    className="text-tertiary"
                  />
                  <span>Bạn bè ✓</span>
                  <Icon name="arrow_drop_down" size={16} />
                </button>

                {showFriendMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowFriendMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 z-40 w-48 rounded-xl bg-surface-container-lowest p-1.5 shadow-lg border border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setShowFriendMenu(false);
                          onManageFriendship?.(person);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-error hover:bg-error-container/30 transition-colors"
                      >
                        Hủy kết bạn
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Case 2: Not Friend */}
          {person.relationship === "not_friend" && (
            <>
              <button
                type="button"
                onClick={() => onAddFriend?.(person)}
                className="flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg hover:bg-primary transition-colors shadow-sm cursor-pointer"
              >
                <Icon name="person_add" size={18} className="text-white" />
                <span>Thêm bạn bè</span>
              </button>

              <button
                type="button"
                onClick={() => onMessage?.(person)}
                className="flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-full bg-secondary-container text-on-secondary-fixed font-label-lg text-label-lg hover:bg-surface-variant transition-colors cursor-pointer"
              >
                <Icon name="chat" size={18} />
                <span className="hidden sm:inline">Nhắn tin</span>
              </button>
            </>
          )}

          {/* Case 3: Request Sent */}
          {person.relationship === "request_sent" && (
            <>
              <button
                type="button"
                onClick={() => onCancelRequest?.(person)}
                className="flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-full bg-secondary-container text-on-secondary-container font-label-lg text-label-lg hover:bg-surface-variant transition-colors cursor-pointer"
              >
                <Icon name="outgoing_mail" size={18} />
                <span>Đã gửi lời mời</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMoreMenu((prev) => !prev)}
                  title="Thêm tùy chọn"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
                >
                  <Icon name="more_horiz" size={20} />
                </button>

                {showMoreMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowMoreMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 z-40 w-44 rounded-xl bg-surface-container-lowest p-1.5 shadow-lg border border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setShowMoreMenu(false);
                          onCancelRequest?.(person);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-error hover:bg-error-container/30 transition-colors"
                      >
                        Hủy lời mời
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Case 4: Request Received */}
          {person.relationship === "request_received" && (
            <>
              <button
                type="button"
                onClick={() => onAcceptRequest?.(person)}
                className="flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg hover:bg-primary transition-colors shadow-sm cursor-pointer"
              >
                <Icon name="check" size={18} className="text-white" />
                <span>Xác nhận</span>
              </button>

              <button
                type="button"
                onClick={() => onRejectRequest?.(person)}
                className="flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-full bg-secondary-container text-on-secondary-fixed font-label-lg text-label-lg hover:bg-surface-variant transition-colors cursor-pointer"
              >
                <span>Xóa lời mời</span>
              </button>
            </>
          )}

          {/* Case 5: Suggestion */}
          {person.relationship === "suggestion" && (
            <>
              <button
                type="button"
                onClick={() => onAddFriend?.(person)}
                className="flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg hover:bg-primary transition-colors shadow-sm cursor-pointer"
              >
                <Icon name="person_add" size={18} className="text-white" />
                <span>Thêm bạn bè</span>
              </button>

              <button
                type="button"
                onClick={() => onHideSuggestion?.(person)}
                title="Ẩn gợi ý"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
              >
                <Icon name="close" size={20} />
              </button>
            </>
          )}

          {/* Case 6: Public Figure / Following */}
          {person.relationship === "public_figure" && (
            <>
              <button
                type="button"
                onClick={() => onFollow?.(person)}
                className="flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg hover:bg-primary transition-colors shadow-sm cursor-pointer"
              >
                <Icon name="add" size={18} className="text-white" />
                <span>Theo dõi</span>
              </button>

              <button
                type="button"
                onClick={() => onMessage?.(person)}
                className="flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-full bg-secondary-container text-on-secondary-fixed font-label-lg text-label-lg hover:bg-surface-variant transition-colors cursor-pointer"
              >
                <Icon name="chat" size={18} />
                <span>Nhắn tin</span>
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
