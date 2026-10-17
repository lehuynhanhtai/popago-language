import { httpClient } from "@/lib/http-client";
import type {
  ApiResponse,
  UserProfileDto,
  UpdateProfileInput,
  UpdatePreferencesInput,
} from "@repo/shared";
import { useAuthStore, type UserProfile } from "@/stores";

export function mapUserDtoToStore(dto: UserProfileDto): UserProfile {
  return {
    id: dto.id,
    email: dto.email,
    fullName: dto.displayName,
    avatarUrl: dto.avatarUrl || undefined,
    role: dto.role as "student" | "admin",
    targetLevel: dto.preferences?.targetLevel,
    streakDays: dto.stats?.streakDays,
    totalXp: dto.stats?.totalXp,
    wordsLearned: dto.stats?.wordsLearnedCount,
  };
}

export const profileService = {
  /**
   * Lấy thông tin hồ sơ của người dùng hiện tại
   */
  async getProfile(): Promise<ApiResponse<UserProfileDto>> {
    return httpClient
      .get("users/profile")
      .json<ApiResponse<UserProfileDto>>();
  },

  /**
   * Cập nhật thông tin cá nhân (Tên hiển thị, avatar)
   */
  async updateProfile(
    payload: UpdateProfileInput
  ): Promise<ApiResponse<UserProfileDto>> {
    const res = await httpClient
      .patch("users/profile", {
        json: payload,
      })
      .json<ApiResponse<UserProfileDto>>();

    if (res.data) {
      useAuthStore.getState().setUser(mapUserDtoToStore(res.data));
    }

    return res;
  },

  /**
   * Cập nhật cài đặt học tập (Level mục tiêu, mục tiêu phút/ngày, nhắc nhở)
   */
  async updatePreferences(
    payload: UpdatePreferencesInput
  ): Promise<ApiResponse<UserProfileDto>> {
    const res = await httpClient
      .patch("users/preferences", {
        json: payload,
      })
      .json<ApiResponse<UserProfileDto>>();

    if (res.data) {
      useAuthStore.getState().setUser(mapUserDtoToStore(res.data));
    }

    return res;
  },
};
