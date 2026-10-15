import { del, get, post, put } from "@/api/client";
import type {
  Education,
  ExperienceInput,
  Organization,
  OrganizationType,
  UpdateProfileInput,
  UserProfile,
  Work,
} from "@/types/api";

// Hồ sơ của mình (đầy đủ, có email)
export function getMyProfile() {
  return get<UserProfile>("/api/user/me/profile");
}

// Hồ sơ người khác (kèm số bạn chung + quan hệ với mình)
export function getUserProfile(userId: number | string) {
  return get<UserProfile>(`/api/user/${userId}/profile`);
}

export function updateProfile(input: UpdateProfileInput) {
  return put<UserProfile>("/api/user/me/profile", input);
}

// ----- Học vấn -----
export function addEducation(input: ExperienceInput) {
  return post<Education>("/api/user/me/educations", input);
}

export function updateEducation(id: number, input: ExperienceInput) {
  return put<Education>(`/api/user/me/educations/${id}`, input);
}

export function deleteEducation(id: number) {
  return del<null>(`/api/user/me/educations/${id}`);
}

// ----- Công việc -----
export function addWork(input: ExperienceInput) {
  return post<Work>("/api/user/me/works", input);
}

export function updateWork(id: number, input: ExperienceInput) {
  return put<Work>(`/api/user/me/works/${id}`, input);
}

export function deleteWork(id: number) {
  return del<null>(`/api/user/me/works/${id}`);
}

// ----- Sở thích (ghi đè toàn bộ) -----
export function updateInterests(interests: string[]) {
  return put<string[]>("/api/user/me/interests", { interests });
}

// Gợi ý trường / công ty khi gõ
export function searchOrganizations(type: OrganizationType, q: string, limit = 8) {
  return get<Organization[]>(
    `/api/organization/search?type=${type}&q=${encodeURIComponent(q)}&limit=${limit}`
  );
}
