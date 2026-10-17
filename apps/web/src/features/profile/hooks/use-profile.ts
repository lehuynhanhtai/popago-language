import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profile-service";
import type {
  UpdateProfileInput,
  UpdatePreferencesInput,
  UserProfileDto,
} from "@repo/shared";

export const profileKeys = {
  all: ["profile"] as const,
};

/**
 * Hook truy vấn thông tin Profile của người dùng với cơ chế caching React Query
 */
export function useProfile() {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: async () => {
      const res = await profileService.getProfile();
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 phút xem dữ liệu là fresh
    gcTime: 1000 * 60 * 30, // Giữ trong cache 30 phút
  });
}

/**
 * Hook cập nhật thông tin cá nhân (Tên hiển thị, avatar)
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileInput) =>
      profileService.updateProfile(payload),
    onSuccess: (res) => {
      if (res.data) {
        queryClient.setQueryData<UserProfileDto | null>(
          profileKeys.all,
          res.data
        );
      }
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

/**
 * Hook cập nhật tùy chọn học tập (Target level, daily goal, reminder)
 */
export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePreferencesInput) =>
      profileService.updatePreferences(payload),
    onSuccess: (res) => {
      if (res.data) {
        queryClient.setQueryData<UserProfileDto | null>(
          profileKeys.all,
          res.data
        );
      }
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}
