import type { Gender } from "@/types/api";

export const GENDER_LABEL: Record<Gender, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};

// Gợi ý khi nhập quê quán / nơi sống (vẫn gõ tự do được)
export const CITY_SUGGESTIONS = [
  "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Huế", "Nghệ An", "Thanh Hóa",
  "Nam Định", "Thái Bình", "Quảng Ninh", "Bắc Ninh", "Hải Dương", "Đồng Nai", "Bình Dương",
  "Khánh Hòa", "Lâm Đồng", "Quảng Nam", "Bình Định", "Gia Lai", "Đắk Lắk", "Thái Nguyên",
];

export const INTEREST_SUGGESTIONS = [
  "Bóng đá", "Cầu lông", "Bơi lội", "Chạy bộ", "Gym", "Yoga", "Đọc sách", "Du lịch", "Nhiếp ảnh",
  "Nấu ăn", "Âm nhạc", "Guitar", "Xem phim", "Anime", "Chơi game", "Lập trình", "Cà phê", "Vẽ",
  "Leo núi", "Thú cưng", "Đạp xe", "Tiếng Anh",
];

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-surface-container-low px-3 py-2 text-sm text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/20";

export const labelClass = "mb-1 block text-xs font-semibold text-on-surface-variant";

// "2003-05-20" -> "20 tháng 5, 2003"
export function formatBirthday(value?: string | null) {
  if (!value) return "";
  const [y, m, d] = value.split("-").map(Number);
  return `${d} tháng ${m}, ${y}`;
}

// 2019 - 2023 / 2019 - nay / Từ 2019
export function formatYears(fromYear?: number | null, toYear?: number | null, current = "nay") {
  if (fromYear && toYear) return `${fromYear} - ${toYear}`;
  if (fromYear) return `${fromYear} - ${current}`;
  if (toYear) return `Đến ${toYear}`;
  return "";
}
