import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Tên hiển thị phải có ít nhất 2 ký tự')
    .max(50, 'Tên hiển thị không được vượt quá 50 ký tự')
    .optional(),
  avatarUrl: z
    .union([
      z.string().url('Đường dẫn ảnh đại diện không hợp lệ'),
      z.literal(''),
      z.null(),
    ])
    .optional(),
});

export type UpdateProfileInput = z.input<typeof updateProfileSchema>;
export type UpdateProfileOutput = z.output<typeof updateProfileSchema>;

export const updatePreferencesSchema = z.object({
  targetLevel: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .optional(),
  dailyGoalMinutes: z
    .number()
    .int()
    .min(5, 'Mục tiêu học tối thiểu là 5 phút')
    .max(180, 'Mục tiêu học tối đa là 180 phút')
    .optional(),
  reminderEnabled: z.boolean().optional(),
  reminderTime: z.string().optional(),
});

export type UpdatePreferencesInput = z.input<typeof updatePreferencesSchema>;
export type UpdatePreferencesOutput = z.output<typeof updatePreferencesSchema>;
