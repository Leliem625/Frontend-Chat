import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { blockUser } from "@/api/block";
import { createDirectConversation } from "@/api/conversation";
import { acceptFriendRequest, cancelFriendRequest, sendFriendRequest, unfriend } from "@/api/friend";
import { deleteEducation, deleteWork, getMyProfile, getUserProfile } from "@/api/profile";
import { Avatar, Icon, Spinner } from "@/components/common";
import {
  BlockedUsersModal,
  EditInfoModal,
  ExperienceModal,
  formatBirthday,
  formatYears,
  GENDER_LABEL,
  InterestsModal,
} from "@/components/profile";
import { useAuth } from "@/context/auth";
import type { Education, UserProfile, Work } from "@/types/api";

// /profile -> hồ sơ của mình, /user/:id -> hồ sơ người khác.
// key theo id: đổi người xem thì tạo lại trang từ đầu (state sạch, tải lại dữ liệu)
export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  return <ProfileView key={id ?? "me"} userId={id} />;
}

type ModalState =
  | { type: "info" }
  | { type: "interests" }
  | { type: "education"; item?: Education }
  | { type: "work"; item?: Work }
  | null;

function ProfileView({ userId }: { userId?: string }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [acting, setActing] = useState(false);
  const [showFriendMenu, setShowFriendMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {
    let active = true;
    (userId ? getUserProfile(userId) : getMyProfile())
      .then((p) => {
        if (active) setProfile(p);
      })
      .catch((e) => {
        if (active) setError(e?.message ?? "Không tải được hồ sơ");
      });
    return () => {
      active = false;
    };
  }, [userId]);

  if (error) {
    return (
      <CenteredMessage>
        <Icon name="person_off" size={48} className="text-outline" />
        <p className="font-bold text-on-surface">{error}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-2 cursor-pointer rounded-xl bg-surface-container px-4 py-2 text-sm font-semibold hover:bg-surface-container-high"
        >
          Quay lại
        </button>
      </CenteredMessage>
    );
  }
  if (!profile) {
    return (
      <CenteredMessage>
        <Spinner size={28} className="text-primary" />
      </CenteredMessage>
    );
  }

  const isMe = profile.me;

  // ----- Hành động với người khác -----
  const handleAddFriend = async () => {
    setActing(true);
    try {
      await sendFriendRequest(profile.id);
      setProfile({ ...profile, relation: "REQUEST_SENT" });
      toast.success(`Đã gửi lời mời kết bạn đến ${profile.username}`);
    } catch (e: any) {
      toast.error("Không gửi được lời mời", { description: e?.message });
    } finally {
      setActing(false);
    }
  };

  const handleAccept = async () => {
    if (!profile.requestId) return;
    setActing(true);
    try {
      await acceptFriendRequest(profile.requestId);
      setProfile({
        ...profile,
        relation: "FRIEND",
        requestId: undefined,
        friendCount: profile.friendCount + 1,
      });
      toast.success(`Bạn và ${profile.username} đã là bạn bè`);
    } catch (e: any) {
      toast.error("Không chấp nhận được", { description: e?.message });
    } finally {
      setActing(false);
    }
  };

  // Chặn xong thì hồ sơ không xem được nữa (backend coi như không tồn tại) -> quay về trang chủ
  const handleBlock = async () => {
    setShowMoreMenu(false);
    if (
      !window.confirm(
        `Chặn ${profile.username}? Hai bạn sẽ không nhắn tin, tìm thấy hay thấy trạng thái online của nhau, và sẽ tự huỷ kết bạn.`
      )
    )
      return;
    setActing(true);
    try {
      await blockUser(profile.id);
      toast.success(`Đã chặn ${profile.username}`);
      navigate("/", { replace: true });
    } catch (e: any) {
      toast.error("Không chặn được", { description: e?.message });
      setActing(false);
    }
  };

  const handleCancelRequest = async () => {
    setActing(true);
    try {
      await cancelFriendRequest(profile.id);
      setProfile({ ...profile, relation: "NONE" });
      toast.info(`Đã huỷ lời mời kết bạn đến ${profile.username}`);
    } catch (e: any) {
      toast.error("Không huỷ được lời mời", { description: e?.message });
    } finally {
      setActing(false);
    }
  };

  const handleUnfriend = async () => {
    setShowFriendMenu(false);
    if (!window.confirm(`Hủy kết bạn với ${profile.username}?`)) return;
    setActing(true);
    try {
      await unfriend(profile.id);
      setProfile({
        ...profile,
        relation: "NONE",
        friendCount: Math.max(0, profile.friendCount - 1),
      });
      toast.info(`Đã hủy kết bạn với ${profile.username}`);
    } catch (e: any) {
      toast.error("Không hủy kết bạn được", { description: e?.message });
    } finally {
      setActing(false);
    }
  };

  const handleMessage = async () => {
    setActing(true);
    try {
      const conversation = await createDirectConversation(profile.id);
      navigate(`/chat/${conversation.id}`);
    } catch (e: any) {
      toast.error("Không mở được cuộc trò chuyện", { description: e?.message });
      setActing(false);
    }
  };

  // ----- Sửa hồ sơ của mình -----
  const handleDeleteEducation = async (item: Education) => {
    if (!window.confirm(`Xoá "${item.school.name}" khỏi học vấn?`)) return;
    try {
      await deleteEducation(item.id);
      setProfile({ ...profile, educations: profile.educations.filter((e) => e.id !== item.id) });
    } catch (e: any) {
      toast.error("Không xoá được", { description: e?.message });
    }
  };

  const handleDeleteWork = async (item: Work) => {
    if (!window.confirm(`Xoá "${item.company.name}" khỏi công việc?`)) return;
    try {
      await deleteWork(item.id);
      setProfile({ ...profile, works: profile.works.filter((w) => w.id !== item.id) });
    } catch (e: any) {
      toast.error("Không xoá được", { description: e?.message });
    }
  };

  // Thêm mới -> chèn đầu danh sách; sửa -> thay đúng dòng đó
  const upsert = <T extends { id: number }>(list: T[], item: T) =>
    list.some((x) => x.id === item.id)
      ? list.map((x) => (x.id === item.id ? item : x))
      : [item, ...list];

  const subtitle = [
    `${profile.friendCount} bạn bè`,
    !isMe && profile.mutualFriendCount > 0 ? `${profile.mutualFriendCount} bạn chung` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const hasIntro =
    profile.works.length > 0 ||
    profile.educations.length > 0 ||
    profile.currentCity ||
    profile.hometown ||
    profile.gender ||
    profile.birthday;

  return (
    <div className="h-full w-full overflow-y-auto bg-surface px-4 py-6 font-sans antialiased md:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 pb-24">
        {/* 1. Ảnh bìa + avatar + tên + nút hành động */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-surface-container-lowest shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
          <div className="relative h-32 w-full bg-gradient-to-r from-primary to-primary-container md:h-44">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/20" />
          </div>

          <div className="relative px-6 pb-6 pt-0">
            <div className="-mt-16 mb-4 flex flex-col justify-between gap-4 sm:-mt-20 sm:flex-row sm:items-end">
              <div className="h-28 w-28 overflow-hidden rounded-full bg-surface shadow-md ring-4 ring-surface-container-lowest sm:h-32 sm:w-32">
                <Avatar uri={profile.avatarUrl} size={128} name={profile.username} />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {isMe ? (
                  <>
                    <ActionButton icon="edit" onClick={() => setModal({ type: "info" })}>
                      Chỉnh sửa hồ sơ
                    </ActionButton>
                    <ActionButton icon="logout" variant="danger" onClick={() => logout()}>
                      Đăng xuất
                    </ActionButton>
                  </>
                ) : (
                  <>
                    {profile.relation === "FRIEND" && (
                      // Nút "Bạn bè" -> menu "Hủy kết bạn" (giống Facebook)
                      <div className="relative">
                        <ActionButton
                          icon="how_to_reg"
                          disabled={acting}
                          onClick={() => setShowFriendMenu((prev) => !prev)}
                        >
                          Bạn bè
                        </ActionButton>
                        {showFriendMenu && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowFriendMenu(false)} />
                            <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-slate-200/80 bg-surface-container-lowest p-1 shadow-xl">
                              <button
                                type="button"
                                onClick={handleUnfriend}
                                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-error hover:bg-error-container/20"
                              >
                                <Icon name="person_remove" size={18} />
                                Hủy kết bạn
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    {profile.relation === "REQUEST_SENT" && (
                      <ActionButton icon="person_cancel" disabled={acting} onClick={handleCancelRequest}>
                        Huỷ lời mời
                      </ActionButton>
                    )}
                    {profile.relation === "REQUEST_RECEIVED" && (
                      <ActionButton icon="person_check" variant="primary" disabled={acting} onClick={handleAccept}>
                        Chấp nhận lời mời
                      </ActionButton>
                    )}
                    {profile.relation === "NONE" && (
                      <ActionButton icon="person_add" variant="primary" disabled={acting} onClick={handleAddFriend}>
                        Thêm bạn bè
                      </ActionButton>
                    )}
                    <ActionButton icon="chat" disabled={acting} onClick={handleMessage}>
                      Nhắn tin
                    </ActionButton>
                    {/* Menu "⋯": Chặn */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowMoreMenu((prev) => !prev)}
                        title="Xem thêm"
                        className="flex h-8 w-9 cursor-pointer items-center justify-center rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high"
                      >
                        <Icon name="more_horiz" size={18} />
                      </button>
                      {showMoreMenu && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowMoreMenu(false)} />
                          <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-slate-200/80 bg-surface-container-lowest p-1 shadow-xl">
                            <button
                              type="button"
                              onClick={handleBlock}
                              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-error hover:bg-error-container/20"
                            >
                              <Icon name="block" size={18} />
                              Chặn
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <h1 className="text-xl font-bold text-on-surface sm:text-2xl">{profile.username}</h1>
            <p className="mt-0.5 text-sm font-medium text-on-surface-variant">{subtitle}</p>
            {isMe && profile.email && <p className="mt-0.5 text-xs text-outline">{profile.email}</p>}
            {profile.bio && <p className="mt-3 whitespace-pre-wrap text-sm text-on-surface">{profile.bio}</p>}
          </div>
        </section>

        {/* 2. Giới thiệu: công việc, học vấn, nơi sống, quê quán, giới tính, ngày sinh */}
        <Card title="Giới thiệu">
          <div className="flex flex-col gap-3">
            {profile.works.map((w) => (
              <InfoRow
                key={`w-${w.id}`}
                icon="work"
                onEdit={isMe ? () => setModal({ type: "work", item: w }) : undefined}
                onDelete={isMe ? () => handleDeleteWork(w) : undefined}
              >
                {w.toYear ? "Từng làm " : "Làm "}
                {w.position && <b>{w.position} </b>}
                tại <b>{w.company.name}</b>
                <Meta>{[w.company.city, formatYears(w.fromYear, w.toYear)].filter(Boolean).join(" · ")}</Meta>
              </InfoRow>
            ))}
            {isMe && <AddRow onClick={() => setModal({ type: "work" })}>Thêm nơi làm việc</AddRow>}

            {profile.educations.map((e) => (
              <InfoRow
                key={`e-${e.id}`}
                icon="school"
                onEdit={isMe ? () => setModal({ type: "education", item: e }) : undefined}
                onDelete={isMe ? () => handleDeleteEducation(e) : undefined}
              >
                {e.toYear ? "Từng học " : "Học "}
                {e.major && <b>{e.major} </b>}
                tại <b>{e.school.name}</b>
                <Meta>{[e.school.city, formatYears(e.fromYear, e.toYear)].filter(Boolean).join(" · ")}</Meta>
              </InfoRow>
            ))}
            {isMe && <AddRow onClick={() => setModal({ type: "education" })}>Thêm trường học</AddRow>}

            {profile.currentCity && (
              <InfoRow icon="home">
                Sống tại <b>{profile.currentCity}</b>
              </InfoRow>
            )}
            {profile.hometown && (
              <InfoRow icon="location_on">
                Đến từ <b>{profile.hometown}</b>
              </InfoRow>
            )}
            {profile.gender && <InfoRow icon="person">{GENDER_LABEL[profile.gender]}</InfoRow>}
            {profile.birthday && (
              <InfoRow icon="cake">
                Sinh ngày <b>{formatBirthday(profile.birthday)}</b>
              </InfoRow>
            )}

            {!isMe && !hasIntro && (
              <p className="text-sm text-on-surface-variant">Chưa có thông tin giới thiệu.</p>
            )}
          </div>
        </Card>

        {/* 3. Sở thích */}
        <Card
          title="Sở thích"
          action={isMe ? { label: "Chỉnh sửa", onClick: () => setModal({ type: "interests" }) } : undefined}
        >
          {profile.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((name) => (
                <span
                  key={name}
                  className="rounded-full bg-primary-container/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">
              {isMe ? "Thêm sở thích để bạn bè hiểu bạn hơn." : "Chưa có sở thích nào."}
            </p>
          )}
        </Card>

        {/* 4. Cài đặt (chỉ hồ sơ của mình) */}
        {isMe && <SettingsSection />}
      </div>

      {/* Các form sửa hồ sơ */}
      {modal?.type === "info" && (
        <EditInfoModal
          profile={profile}
          onClose={() => setModal(null)}
          onSaved={(saved) => {
            setProfile(saved);
            setModal(null);
          }}
        />
      )}
      {modal?.type === "interests" && (
        <InterestsModal
          initial={profile.interests}
          onClose={() => setModal(null)}
          onSaved={(interests) => {
            setProfile({ ...profile, interests });
            setModal(null);
          }}
        />
      )}
      {modal?.type === "education" && (
        <ExperienceModal
          kind="education"
          initial={modal.item}
          onClose={() => setModal(null)}
          onSaved={(item) => {
            setProfile({ ...profile, educations: upsert(profile.educations, item) });
            setModal(null);
          }}
        />
      )}
      {modal?.type === "work" && (
        <ExperienceModal
          kind="work"
          initial={modal.item}
          onClose={() => setModal(null)}
          onSaved={(item) => {
            setProfile({ ...profile, works: upsert(profile.works, item) });
            setModal(null);
          }}
        />
      )}
    </div>
  );
}

// ================= Cài đặt (giữ nguyên giao diện cũ) =================

function SettingsSection() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showBlocked, setShowBlocked] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="px-1 text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
        Cài đặt & Tùy chọn
      </h2>

      <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-surface-container-lowest shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
        <SettingToggle
          icon="notifications"
          title="Thông báo ứng dụng"
          description="Nhận thông báo khi có tin nhắn hoặc lời mời kết bạn mới"
          enabled={notificationsEnabled}
          onToggle={() => setNotificationsEnabled((prev) => !prev)}
        />
        <SettingToggle
          icon="volume_up"
          title="Âm thanh thông báo"
          description="Phát chuông thông báo khi có tin nhắn mới gửi đến"
          enabled={soundEnabled}
          onToggle={() => setSoundEnabled((prev) => !prev)}
        />
        <button
          type="button"
          onClick={() => setShowBlocked(true)}
          className="flex w-full cursor-pointer items-center justify-between p-4 text-left transition-colors hover:bg-surface-container-low"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container text-error">
              <Icon name="block" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">Người đã chặn</p>
              <p className="text-xs text-on-surface-variant">Xem và bỏ chặn những người bạn đã chặn</p>
            </div>
          </div>
          <Icon name="chevron_right" size={20} className="text-outline" />
        </button>
        <button
          type="button"
          onClick={() => toast.info("Cài đặt bảo mật")}
          className="flex w-full cursor-pointer items-center justify-between p-4 text-left transition-colors hover:bg-surface-container-low"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container text-primary">
              <Icon name="security" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">Quyền riêng tư & Bảo mật</p>
              <p className="text-xs text-on-surface-variant">Quản lý mật khẩu, phiên đăng nhập và quyền truy cập</p>
            </div>
          </div>
          <Icon name="chevron_right" size={20} className="text-outline" />
        </button>
      </div>

      {showBlocked && <BlockedUsersModal onClose={() => setShowBlocked(false)} />}
    </div>
  );
}

function SettingToggle({
  icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: string;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container text-primary">
          <Icon name={icon} size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-on-surface">{title}</p>
          <p className="text-xs text-on-surface-variant">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
          enabled ? "bg-primary-container" : "bg-slate-300"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

// ================= Các khối giao diện nhỏ =================

function CenteredMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface p-6 text-center">
      {children}
    </div>
  );
}

function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; onClick: () => void };
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-surface-container-lowest p-5 shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-on-surface">{title}</h2>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="cursor-pointer rounded-lg px-2 py-1 text-sm font-semibold text-primary hover:bg-surface-container-low"
          >
            {action.label}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function InfoRow({
  icon,
  children,
  onEdit,
  onDelete,
}: {
  icon: string;
  children: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon name={icon} size={22} className="mt-0.5 text-outline" />
      <div className="min-w-0 flex-1 text-sm text-on-surface [&_b]:font-semibold">{children}</div>
      {(onEdit || onDelete) && (
        <div className="flex shrink-0 gap-1">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              aria-label="Sửa"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container"
            >
              <Icon name="edit" size={17} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              aria-label="Xoá"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-on-surface-variant hover:bg-error-container/30 hover:text-error"
            >
              <Icon name="delete" size={17} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Meta({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <span className="block text-xs text-on-surface-variant">{children}</span>;
}

function AddRow({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-3 rounded-xl py-1 text-left text-sm font-semibold text-primary hover:underline"
    >
      <Icon name="add_circle" size={22} />
      {children}
    </button>
  );
}

function ActionButton({
  icon,
  variant = "default",
  disabled,
  onClick,
  children,
}: {
  icon: string;
  variant?: "default" | "primary" | "danger";
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  const style = {
    default: "bg-surface-container text-on-surface hover:bg-surface-container-high",
    primary: "bg-primary-container text-white hover:bg-primary",
    danger: "bg-error-container/40 text-error hover:bg-error-container/60",
  }[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${style} ${
        onClick && !disabled ? "cursor-pointer" : "cursor-default"
      } disabled:opacity-80`}
    >
      <Icon name={icon} size={16} />
      <span>{children}</span>
    </button>
  );
}
