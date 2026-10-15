import { useState } from "react";
import { toast } from "sonner";

import { addEducation, addWork, updateEducation, updateWork } from "@/api/profile";
import type { Education, ExperienceInput, Work } from "@/types/api";

import { CITY_SUGGESTIONS, inputClass, labelClass } from "./constants";
import { OrganizationPicker, type OrganizationValue } from "./OrganizationPicker";
import { ProfileModal } from "./ProfileModal";

type Props =
  | { kind: "education"; initial?: Education; onClose: () => void; onSaved: (item: Education) => void }
  | { kind: "work"; initial?: Work; onClose: () => void; onSaved: (item: Work) => void };

const CURRENT_YEAR = new Date().getFullYear();

// Form thêm / sửa 1 dòng học vấn hoặc công việc
export function ExperienceModal(props: Props) {
  const isEducation = props.kind === "education";
  const initialOrg = props.kind === "education" ? props.initial?.school : props.initial?.company;

  const [org, setOrg] = useState<OrganizationValue>({
    organizationId: initialOrg?.id,
    name: initialOrg?.name ?? "",
    city: initialOrg?.city ?? "",
  });
  const [detail, setDetail] = useState(
    (props.kind === "education" ? props.initial?.major : props.initial?.position) ?? ""
  );
  const [fromYear, setFromYear] = useState(props.initial?.fromYear?.toString() ?? "");
  const [toYear, setToYear] = useState(props.initial?.toYear?.toString() ?? "");
  // Sửa dòng cũ chưa có năm kết thúc -> coi như đang học / làm
  const [isCurrent, setIsCurrent] = useState(Boolean(props.initial && !props.initial.toYear));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!org.name.trim()) {
      toast.error(isEducation ? "Vui lòng nhập tên trường" : "Vui lòng nhập tên công ty");
      return;
    }
    const input: ExperienceInput = {
      // Đã chọn từ gợi ý -> gửi id; gõ tên mới -> gửi tên + thành phố để backend tạo mới
      ...(org.organizationId
        ? { organizationId: org.organizationId }
        : { organizationName: org.name.trim(), city: org.city?.trim() || undefined }),
      ...(isEducation ? { major: detail.trim() || undefined } : { position: detail.trim() || undefined }),
      fromYear: fromYear ? Number(fromYear) : null,
      toYear: !isCurrent && toYear ? Number(toYear) : null,
    };

    setSaving(true);
    try {
      if (props.kind === "education") {
        const saved = props.initial
          ? await updateEducation(props.initial.id, input)
          : await addEducation(input);
        props.onSaved(saved);
      } else {
        const saved = props.initial ? await updateWork(props.initial.id, input) : await addWork(input);
        props.onSaved(saved);
      }
      toast.success("Đã lưu");
    } catch (error: any) {
      toast.error("Không lưu được", { description: error?.message });
    } finally {
      setSaving(false);
    }
  };

  const title = `${props.initial ? "Sửa" : "Thêm"} ${isEducation ? "học vấn" : "nơi làm việc"}`;

  return (
    <ProfileModal title={title} onClose={props.onClose} onSubmit={handleSubmit} submitting={saving}>
      <div>
        <label className={labelClass}>{isEducation ? "Trường học" : "Công ty"} *</label>
        <OrganizationPicker
          type={isEducation ? "SCHOOL" : "COMPANY"}
          value={org}
          onChange={setOrg}
          placeholder={isEducation ? "Gõ để tìm trường, vd: bach khoa" : "Gõ để tìm công ty, vd: fpt"}
        />
      </div>

      {/* Chỉ hỏi thành phố khi tạo mới (chọn từ gợi ý thì đã có thành phố) */}
      {!org.organizationId && org.name.trim() && (
        <div>
          <label className={labelClass}>Thành phố của {isEducation ? "trường" : "công ty"}</label>
          <input
            list="experience-city-suggestions"
            value={org.city ?? ""}
            onChange={(e) => setOrg({ ...org, city: e.target.value })}
            placeholder="vd: Hà Nội"
            className={inputClass}
          />
          <datalist id="experience-city-suggestions">
            {CITY_SUGGESTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      )}

      <div>
        <label className={labelClass}>{isEducation ? "Chuyên ngành" : "Chức vụ"}</label>
        <input
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder={isEducation ? "vd: Công nghệ thông tin" : "vd: Lập trình viên"}
          maxLength={100}
          className={inputClass}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface">
        <input
          type="checkbox"
          checked={isCurrent}
          onChange={(e) => setIsCurrent(e.target.checked)}
          className="h-4 w-4 accent-primary-container"
        />
        {isEducation ? "Tôi đang học ở đây" : "Tôi đang làm việc ở đây"}
      </label>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Từ năm</label>
          <input
            type="number"
            min={1950}
            max={CURRENT_YEAR + 10}
            value={fromYear}
            onChange={(e) => setFromYear(e.target.value)}
            placeholder="vd: 2019"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Đến năm</label>
          <input
            type="number"
            min={1950}
            max={CURRENT_YEAR + 10}
            value={isCurrent ? "" : toYear}
            disabled={isCurrent}
            onChange={(e) => setToYear(e.target.value)}
            placeholder={isCurrent ? "Hiện tại" : "vd: 2023"}
            className={`${inputClass} disabled:opacity-60`}
          />
        </div>
      </div>
    </ProfileModal>
  );
}
