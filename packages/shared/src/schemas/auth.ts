import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email không được để trống')
    .email('Định dạng email không hợp lệ'),
  password: z
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(100, 'Mật khẩu không được vượt quá 100 ký tự'),
  displayName: z
    .string()
    .trim()
    .min(2, 'Tên hiển thị phải có ít nhất 2 ký tự')
    .max(50, 'Tên hiển thị không được vượt quá 50 ký tự'),
  targetLevel: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .optional()
    .default('beginner'),
  dailyGoalMinutes: z
    .number()
    .int()
    .min(5, 'Mục tiêu học tối thiểu là 5 phút')
    .max(120, 'Mục tiêu học tối đa là 120 phút')
    .optional()
    .default(15),
});

export type RegisterInput = z.input<typeof registerSchema>;
export type RegisterOutput = z.output<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email không được để trống')
    .email('Định dạng email không hợp lệ'),
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống')
    .max(100, 'Mật khẩu không được vượt quá 100 ký tự'),
});

export type LoginInput = z.input<typeof loginSchema>;
export type LoginOutput = z.output<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email không được để trống')
    .email('Định dạng email không hợp lệ'),
});

export type ForgotPasswordInput = z.input<typeof forgotPasswordSchema>;
export type ForgotPasswordOutput = z.output<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  oobCode: z
    .string()
    .trim()
    .min(1, 'Mã xác thực không được để trống'),
  newPassword: z
    .string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .max(100, 'Mật khẩu mới không được vượt quá 100 ký tự'),
});

export type ResetPasswordInput = z.input<typeof resetPasswordSchema>;
export type ResetPasswordOutput = z.output<typeof resetPasswordSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().trim().min(1, 'Refresh token không được để trống'),
});

export type RefreshTokenInput = z.input<typeof refreshTokenSchema>;
export type RefreshTokenOutput = z.output<typeof refreshTokenSchema>;

