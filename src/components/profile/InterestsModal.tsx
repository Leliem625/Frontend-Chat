import { useState } from "react";
import { toast } from "sonner";

import { updateInterests } from "@/api/profile";
import { Icon } from "@/components/common";

import { INTEREST_SUGGESTIONS, inputClass } from "./constants";
import { ProfileModal } from "./ProfileModal";

const MAX_INTERESTS = 20;

export interface InterestsModalProps {
  initial: string[];
  onClose: () => void;
  onSaved: (interests: string[]) => void;
}

// Sửa sở thích: gõ + Enter để thêm, bấm gợi ý để thêm nhanh, bấm X để bỏ
export function InterestsModal({ initial, onClose, onSaved }: InterestsModalProps) {
  const [interests, setInterests] = useState<string[]>(initial);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  const add = (raw: string) => {
    const name = raw.trim().replace(/\s+/g, " ");
    if (!name) return;
    if (interests.some((i) => i.toLowerCase() === name.toLowerCase())) return;
    if (interests.length >= MAX_INTERESTS) {
      toast.error(`Tối đa ${MAX_INTERESTS} sở thích`);
      return;
    }
    setInterests([...interests, name]);
    setText("");
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      onSaved(await updateInterests(interests));
      toast.success("Đã cập nhật sở thích");
    } catch (error: any) {
      toast.error("Không lưu được", { description: error?.message });
    } finally {
      setSaving(false);
    }
  };

  const suggestions = INTEREST_SUGGESTIONS.filter(
    (s) => !interests.some((i) => i.toLowerCase() === s.toLowerCase())
  );

  return (
    <ProfileModal title="Sở thích" onClose={onClose} onSubmit={handleSubmit} submitting={saving}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          // Enter trong ô này = thêm sở thích, không gửi form
          if (e.key === "Enter") {
            e.preventDefault();
            add(text);
          }
        }}
        maxLength={50}
        placeholder="Gõ sở thích rồi nhấn Enter, vd: Bóng đá"
        className={inputClass}
      />

      {interests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {interests.map((name) => (
            <span
              key={name}
              className="flex items-center gap-1 rounded-full bg-primary-container/10 py-1 pl-3 pr-1.5 text-sm font-medium text-primary"
            >
              {name}
              <button
                type="button"
                onClick={() => setInterests(interests.filter((i) => i !== name))}
                aria-label={`Bỏ ${name}`}
                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full hover:bg-primary-container/20"
              >
                <Icon name="close" size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-semibold text-on-surface-variant">Gợi ý</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs text-on-surface hover:bg-surface-container-low"
              >
                <Icon name="add" size={13} />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </ProfileModal>
  );
}
