import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthController } from './auth.controller.js';
import { AuthService, type RegisterResult } from './auth.service.js';
import type { RegisterDto } from './dto/register.dto.js';
import type { LoginDto } from './dto/login.dto.js';
import type { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import type { ResetPasswordDto } from './dto/reset-password.dto.js';
import type {
  AuthLoginResult,
  ForgotPasswordResult,
  UserProfileDto,
} from '@repo/shared';

describe('AuthController', () => {
  let controller: AuthController;
  let authServiceMock: {
    register: ReturnType<typeof vi.fn>;
    login: ReturnType<typeof vi.fn>;
    getMe: ReturnType<typeof vi.fn>;
    forgotPassword: ReturnType<typeof vi.fn>;
    resetPassword: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    authServiceMock = {
      register: vi.fn(),
      login: vi.fn(),
      getMe: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      logout: vi.fn(),
    };
    controller = new AuthController(authServiceMock as unknown as AuthService);
  });

  describe('register', () => {
    it('gọi authService.register và bọc kết quả trong ApiResponse', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'Password123@',
        displayName: 'Test User',
        targetLevel: 'beginner',
        dailyGoalMinutes: 15,
      };

      const mockResult: RegisterResult = {
        user: {
          id: 'uid-1',
          email: 'test@example.com',
          displayName: 'Test User',
          avatarUrl: null,
          role: 'student',
          status: 'active',
          preferences: {
            targetLevel: 'beginner',
            dailyGoalMinutes: 15,
            reminderEnabled: false,
          },
          stats: {
            streakDays: 0,
            lastActiveDate: null,
            totalXp: 0,
            wordsLearnedCount: 0,
            lessonsCompletedCount: 0,
          },
        },
        customToken: 'mock-custom-token',
      };

      authServiceMock.register.mockResolvedValue(mockResult);

      const response = await controller.register(dto);

      expect(authServiceMock.register).toHaveBeenCalledWith(dto);
      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockResult);
      expect(response.message).toBe('Đăng ký tài khoản thành công');
    });
  });

  describe('login', () => {
    it('gọi authService.login và bọc kết quả trong ApiResponse', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123@',
      };

      const mockResult: AuthLoginResult = {
        user: {
          id: 'uid-1',
          email: 'test@example.com',
          displayName: 'Test User',
          avatarUrl: null,
          role: 'student',
          status: 'active',
          preferences: {
            targetLevel: 'beginner',
            dailyGoalMinutes: 15,
            reminderEnabled: false,
          },
          stats: {
            streakDays: 1,
            lastActiveDate: '2026-10-14',
            totalXp: 0,
            wordsLearnedCount: 0,
            lessonsCompletedCount: 0,
          },
        },
        idToken: 'mock-id-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: '3600',
      };

      authServiceMock.login.mockResolvedValue(mockResult);

      const response = await controller.login(dto);

      expect(authServiceMock.login).toHaveBeenCalledWith(dto);
      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockResult);
      expect(response.message).toBe('Đăng nhập thành công');
    });
  });

  describe('forgotPassword', () => {
    it('gọi authService.forgotPassword và bọc trong ApiResponse', async () => {
      const dto: ForgotPasswordDto = { email: 'forgot@example.com' };
      const mockResult: ForgotPasswordResult = { email: 'forgot@example.com' };

      authServiceMock.forgotPassword.mockResolvedValue(mockResult);

      const response = await controller.forgotPassword(dto);

      expect(authServiceMock.forgotPassword).toHaveBeenCalledWith(dto);
      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockResult);
    });
  });

  describe('resetPassword', () => {
    it('gọi authService.resetPassword và trả về thông báo thành công', async () => {
      const dto: ResetPasswordDto = {
        oobCode: 'valid-oob-code',
        newPassword: 'NewPassword123@',
      };

      authServiceMock.resetPassword.mockResolvedValue(undefined);

      const response = await controller.resetPassword(dto);

      expect(authServiceMock.resetPassword).toHaveBeenCalledWith(dto);
      expect(response.success).toBe(true);
      expect(response.message).toContain('Đặt lại mật khẩu thành công');
    });
  });

  describe('getMe', () => {
    it('lấy profile người dùng hiện tại và bọc trong ApiResponse', async () => {
      const mockUser: UserProfileDto = {
        id: 'uid-current',
        email: 'current@example.com',
        displayName: 'Current User',
        avatarUrl: null,
        role: 'student',
        status: 'active',
        preferences: {
          targetLevel: 'beginner',
          dailyGoalMinutes: 15,
          reminderEnabled: false,
        },
        stats: {
          streakDays: 2,
          lastActiveDate: '2026-10-14',
          totalXp: 100,
          wordsLearnedCount: 30,
          lessonsCompletedCount: 3,
        },
      };

      authServiceMock.getMe.mockResolvedValue(mockUser);

      const response = await controller.getMe('uid-current');

      expect(authServiceMock.getMe).toHaveBeenCalledWith('uid-current');
      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockUser);
    });
  });

  describe('logout', () => {
    it('gọi authService.logout với uid và trả về ApiResponse thành công', async () => {
      authServiceMock.logout.mockResolvedValue(undefined);

      const response = await controller.logout('uid-current');

      expect(authServiceMock.logout).toHaveBeenCalledWith('uid-current');
      expect(response.success).toBe(true);
      expect(response.data).toBeNull();
      expect(response.message).toBe('Đăng xuất thành công');
    });
  });
});

