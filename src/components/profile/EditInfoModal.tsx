import { useState } from "react";
import { toast } from "sonner";

import { updateProfile } from "@/api/profile";
import type { Gender, UserProfile } from "@/types/api";

import { CITY_SUGGESTIONS, GENDER_LABEL, inputClass, labelClass } from "./constants";
import { ProfileModal } from "./ProfileModal";

export interface EditInfoModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSaved: (profile: UserProfile) => void;
}

// Sửa thông tin cơ bản: tên, giới thiệu, giới tính, ngày sinh, quê quán, nơi sống
export function EditInfoModal({ profile, onClose, onSaved }: EditInfoModalProps) {
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [gender, setGender] = useState<Gender | "">(profile.gender ?? "");
  const [birthday, setBirthday] = useState(profile.birthday ?? "");
  const [hometown, setHometown] = useState(profile.hometown ?? "");
  const [currentCity, setCurrentCity] = useState(profile.currentCity ?? "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim()) {
      toast.error("Tên không được để trống");
      return;
    }
    setSaving(true);
    try {
      const saved = await updateProfile({
        username: username.trim(),
        bio: bio.trim() || null,
        gender: gender || null,
        birthday: birthday || null,
        hometown: hometown.trim() || null,
        currentCity: currentCity.trim() || null,
      });
      onSaved(saved);
      toast.success("Đã cập nhật hồ sơ");
    } catch (error: any) {
      toast.error("Không lưu được", { description: error?.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileModal title="Chỉnh sửa thông tin" onClose={onClose} onSubmit={handleSubmit} submitting={saving}>
      <div>
        <label className={labelClass}>Tên hiển thị *</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} maxLength={50} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Giới thiệu</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Vài dòng về bạn..."
          className={`${inputClass} resize-none`}
        />
        <p className="mt-0.5 text-right text-[11px] text-outline">{bio.length}/500</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Giới tính</label>
          <select value={gender} onChange={(e) => setGender(e.target.value as Gender | "")} className={inputClass}>
            <option value="">Không chọn</option>
            {(Object.keys(GENDER_LABEL) as Gender[]).map((g) => (
              <option key={g} value={g}>
                {GENDER_LABEL[g]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Ngày sinh</label>
          <input
            type="date"
            value={birthday}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setBirthday(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Quê quán</label>
        <input
          list="profile-city-suggestions"
          value={hometown}
          onChange={(e) => setHometown(e.target.value)}
          maxLength={100}
          placeholder="vd: Nghệ An"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Nơi sống hiện tại</label>
        <input
          list="profile-city-suggestions"
          value={currentCity}
          onChange={(e) => setCurrentCity(e.target.value)}
          maxLength={100}
          placeholder="vd: Hà Nội"
          className={inputClass}
        />
      </div>

      <datalist id="profile-city-suggestions">
        {CITY_SUGGESTIONS.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </ProfileModal>
  );
}
