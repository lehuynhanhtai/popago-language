import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { Auth, UserRecord } from 'firebase-admin/auth';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';
import type { UserEntity } from '../users/entities/user.entity.js';

describe('AuthService', () => {
  let authService: AuthService;
  let firebaseAuthMock: {
    createUser: ReturnType<typeof vi.fn>;
    deleteUser: ReturnType<typeof vi.fn>;
    createCustomToken: ReturnType<typeof vi.fn>;
    getUserByEmail: ReturnType<typeof vi.fn>;
    generatePasswordResetLink: ReturnType<typeof vi.fn>;
    revokeRefreshTokens: ReturnType<typeof vi.fn>;
  };
  let usersServiceMock: {
    existsByEmail: ReturnType<typeof vi.fn>;
    createUser: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    syncUserProfile: ReturnType<typeof vi.fn>;
    updateLoginStreak: ReturnType<typeof vi.fn>;
    toProfileDto: ReturnType<typeof vi.fn>;
  };
  let configServiceMock: {
    get: ReturnType<typeof vi.fn>;
  };

  const registerInput = {
    email: 'newuser@example.com',
    password: 'Password123@',
    displayName: 'New Student',
    targetLevel: 'beginner' as const,
    dailyGoalMinutes: 15,
  };

  beforeEach(() => {
    firebaseAuthMock = {
      createUser: vi.fn(),
      deleteUser: vi.fn(),
      createCustomToken: vi.fn(),
      getUserByEmail: vi.fn(),
      generatePasswordResetLink: vi.fn(),
      revokeRefreshTokens: vi.fn(),
    };

    usersServiceMock = {
      existsByEmail: vi.fn(),
      createUser: vi.fn(),
      findById: vi.fn(),
      syncUserProfile: vi.fn(),
      updateLoginStreak: vi.fn(),
      toProfileDto: vi.fn(),
    };

    configServiceMock = {
      get: vi.fn(),
    };

    authService = new AuthService(
      firebaseAuthMock as unknown as Auth,
      usersServiceMock as unknown as UsersService,
      configServiceMock as unknown as ConfigService,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('register', () => {
    it('đăng ký thành công và trả về user profile cùng customToken', async () => {
      usersServiceMock.existsByEmail.mockResolvedValue(false);
      firebaseAuthMock.createUser.mockResolvedValue({ uid: 'uid-test-123' } as UserRecord);

      const mockEntity: UserEntity = {
        id: 'uid-test-123',
        email: 'newuser@example.com',
        displayName: 'New Student',
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
      };

      usersServiceMock.createUser.mockResolvedValue(mockEntity);
      usersServiceMock.toProfileDto.mockReturnValue({
        id: 'uid-test-123',
        email: 'newuser@example.com',
        displayName: 'New Student',
        avatarUrl: null,
        role: 'student',
        status: 'active',
        preferences: mockEntity.preferences,
        stats: mockEntity.stats,
      });

      firebaseAuthMock.createCustomToken.mockResolvedValue('mock-custom-token');

      const result = await authService.register(registerInput);

      expect(usersServiceMock.existsByEmail).toHaveBeenCalledWith('newuser@example.com');
      expect(firebaseAuthMock.createUser).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'Password123@',
        displayName: 'New Student',
      });
      expect(usersServiceMock.createUser).toHaveBeenCalledWith('uid-test-123', expect.any(Object));
      expect(result.customToken).toBe('mock-custom-token');
      expect(result.user.email).toBe('newuser@example.com');
    });

    it('ném ConflictException nếu email đã tồn tại trong Firestore', async () => {
      usersServiceMock.existsByEmail.mockResolvedValue(true);

      await expect(authService.register(registerInput)).rejects.toThrow(ConflictException);
      expect(firebaseAuthMock.createUser).not.toHaveBeenCalled();
    });

    it('ném ConflictException nếu Firebase Auth báo email-already-exists', async () => {
      usersServiceMock.existsByEmail.mockResolvedValue(false);
      firebaseAuthMock.createUser.mockRejectedValue({
        code: 'auth/email-already-exists',
        message: 'The email address is already in use',
      });

      await expect(authService.register(registerInput)).rejects.toThrow(ConflictException);
      expect(usersServiceMock.createUser).not.toHaveBeenCalled();
    });

    it('rollback xóa Firebase Auth user nếu lưu Firestore thất bại', async () => {
      usersServiceMock.existsByEmail.mockResolvedValue(false);
      firebaseAuthMock.createUser.mockResolvedValue({ uid: 'uid-rollback' } as UserRecord);
      usersServiceMock.createUser.mockRejectedValue(new Error('Firestore write error'));
      firebaseAuthMock.deleteUser.mockResolvedValue(undefined);

      await expect(authService.register(registerInput)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(firebaseAuthMock.deleteUser).toHaveBeenCalledWith('uid-rollback');
    });
  });

  describe('login', () => {
    it('đăng nhập thành công với Google Identity Toolkit REST API', async () => {
      configServiceMock.get.mockReturnValue({ apiKey: 'mock-web-api-key' });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            idToken: 'mock-id-token',
            refreshToken: 'mock-refresh-token',
            expiresIn: '3600',
            localId: 'uid-login-1',
            displayName: 'Logged In User',
          }),
      });

      const userEntity: UserEntity = {
        id: 'uid-login-1',
        email: 'user@example.com',
        displayName: 'Logged In User',
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
          totalXp: 10,
          wordsLearnedCount: 5,
          lessonsCompletedCount: 1,
        },
      };

      usersServiceMock.syncUserProfile.mockResolvedValue(userEntity);
      usersServiceMock.updateLoginStreak.mockResolvedValue(userEntity);
      usersServiceMock.toProfileDto.mockReturnValue({
        id: 'uid-login-1',
        email: 'user@example.com',
        displayName: 'Logged In User',
        avatarUrl: null,
        role: 'student',
        status: 'active',
        preferences: userEntity.preferences,
        stats: userEntity.stats,
      });

      const result = await authService.login({
        email: 'user@example.com',
        password: 'Password123@',
      });

      expect(result.idToken).toBe('mock-id-token');
      expect(result.user.id).toBe('uid-login-1');
      expect(usersServiceMock.updateLoginStreak).toHaveBeenCalledWith('uid-login-1');
    });

    it('ném UnauthorizedException nếu sai mật khẩu', async () => {
      configServiceMock.get.mockReturnValue({ apiKey: 'mock-web-api-key' });

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () =>
          Promise.resolve({
            error: { message: 'INVALID_PASSWORD' },
          }),
      });

      await expect(
        authService.login({
          email: 'user@example.com',
          password: 'WrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getMe', () => {
    it('trả về profile khi tìm thấy uid', async () => {
      const user: UserEntity = {
        id: 'uid-me',
        email: 'me@example.com',
        displayName: 'Me',
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
      };

      usersServiceMock.findById.mockResolvedValue(user);
      usersServiceMock.toProfileDto.mockReturnValue({
        id: 'uid-me',
        email: 'me@example.com',
        displayName: 'Me',
        avatarUrl: null,
        role: 'student',
        status: 'active',
        preferences: user.preferences,
        stats: user.stats,
      });

      const profile = await authService.getMe('uid-me');
      expect(profile.id).toBe('uid-me');
      expect(profile.email).toBe('me@example.com');
    });

    it('ném NotFoundException nếu không tìm thấy user', async () => {
      usersServiceMock.findById.mockResolvedValue(null);

      await expect(authService.getMe('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('forgotPassword', () => {
    it('tạo reset link và gửi email khi email tồn tại', async () => {
      firebaseAuthMock.getUserByEmail.mockResolvedValue({ uid: 'uid-forgot' } as UserRecord);
      configServiceMock.get.mockReturnValue({ apiKey: 'test-api-key', projectId: 'papago-eng' });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ oobCode: 'valid-oob-code' }),
      });

      const result = await authService.forgotPassword({ email: 'forgot@example.com' });

      expect(result.email).toBe('forgot@example.com');
      expect(result.resetLink).toContain('oobCode=valid-oob-code');
    });

    it('trả về email bình thường khi không tìm thấy user (anti-enumeration)', async () => {
      firebaseAuthMock.getUserByEmail.mockRejectedValue(new Error('User not found'));

      const result = await authService.forgotPassword({ email: 'notfound@example.com' });

      expect(result.email).toBe('notfound@example.com');
      expect(firebaseAuthMock.generatePasswordResetLink).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('gọi Identity Toolkit cập nhật mật khẩu thành công', async () => {
      configServiceMock.get.mockReturnValue({ apiKey: 'test-api-key' });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ email: 'test@example.com' }),
      });

      await expect(
        authService.resetPassword({
          oobCode: 'valid-oob-code',
          newPassword: 'NewPassword123@',
        }),
      ).resolves.toBeUndefined();
    });

    it('ném BadRequestException khi oobCode hết hạn', async () => {
      configServiceMock.get.mockReturnValue({ apiKey: 'test-api-key' });
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: { message: 'EXPIRED_OOB_CODE' } }),
      });

      await expect(
        authService.resetPassword({
          oobCode: 'expired-code',
          newPassword: 'NewPassword123@',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('logout', () => {
    it('thu hồi refresh token của người dùng thành công', async () => {
      firebaseAuthMock.revokeRefreshTokens.mockResolvedValue(undefined);

      await expect(authService.logout('uid-123')).resolves.toBeUndefined();
      expect(firebaseAuthMock.revokeRefreshTokens).toHaveBeenCalledWith('uid-123');
    });

    it('ném InternalServerErrorException khi thu hồi token thất bại', async () => {
      firebaseAuthMock.revokeRefreshTokens.mockRejectedValue(new Error('Firebase error'));

      await expect(authService.logout('uid-123')).rejects.toThrow(InternalServerErrorException);
    });
  });
});

