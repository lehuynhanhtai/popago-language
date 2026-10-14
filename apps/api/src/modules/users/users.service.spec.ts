import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersService } from './users.service.js';
import { UsersRepository } from './users.repository.js';
import type { UserEntity } from './entities/user.entity.js';

describe('UsersService', () => {
  let service: UsersService;
  let repoMock: Partial<Record<keyof UsersRepository, any>>;

  beforeEach(() => {
    repoMock = {
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      existsByEmail: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    service = new UsersService(repoMock as unknown as UsersRepository);
  });

  describe('createUser', () => {
    it('khởi tạo user entity với giá trị mặc định chính xác', async () => {
      const uid = 'uid-123';
      const input = {
        email: 'Test@Example.com',
        password: 'password123',
        displayName: ' Test User ',
        targetLevel: 'intermediate' as const,
        dailyGoalMinutes: 30,
      };

      const mockSavedEntity: UserEntity = {
        id: uid,
        email: 'test@example.com',
        displayName: 'Test User',
        avatarUrl: null,
        role: 'student',
        status: 'active',
        preferences: {
          targetLevel: 'intermediate',
          dailyGoalMinutes: 30,
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

      repoMock.create.mockResolvedValue(mockSavedEntity);

      const result = await service.createUser(uid, input);

      expect(repoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          displayName: 'Test User',
          role: 'student',
          status: 'active',
          preferences: {
            targetLevel: 'intermediate',
            dailyGoalMinutes: 30,
            reminderEnabled: false,
          },
        }),
        uid,
      );
      expect(result).toEqual(mockSavedEntity);
    });
  });

  describe('syncUserProfile', () => {
    it('trả về user hiện có nếu đã tồn tại trong Firestore', async () => {
      const existingUser: UserEntity = {
        id: 'uid-existing',
        email: 'existing@test.com',
        displayName: 'Existing User',
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
          lastActiveDate: '2026-10-13',
          totalXp: 10,
          wordsLearnedCount: 5,
          lessonsCompletedCount: 1,
        },
      };
      repoMock.findById.mockResolvedValue(existingUser);

      const result = await service.syncUserProfile('uid-existing', 'existing@test.com');
      expect(result).toEqual(existingUser);
      expect(repoMock.create).not.toHaveBeenCalled();
    });

    it('tạo mới user profile nếu chưa tồn tại', async () => {
      repoMock.findById.mockResolvedValue(null);
      repoMock.create.mockImplementation((data: any, uid?: string) =>
        Promise.resolve({ id: uid ?? 'uid-new', ...data }),
      );

      const result = await service.syncUserProfile('uid-new', 'new@test.com', 'New User');
      expect(repoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'new@test.com',
          displayName: 'New User',
        }),
        'uid-new',
      );
      expect(result.id).toBe('uid-new');
    });
  });

  describe('updateLoginStreak', () => {
    it('khởi tạo streak = 1 nếu người dùng chưa từng học', async () => {
      const user: UserEntity = {
        id: 'uid-1',
        email: 'user1@test.com',
        displayName: 'User 1',
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
      repoMock.findById.mockResolvedValue(user);
      repoMock.update.mockResolvedValue(undefined);

      const result = await service.updateLoginStreak('uid-1');
      expect(result.stats.streakDays).toBe(1);
      expect(repoMock.update).toHaveBeenCalled();
    });

    it('tăng streak thêm 1 nếu lần học gần nhất là ngày hôm qua', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      const user: UserEntity = {
        id: 'uid-2',
        email: 'user2@test.com',
        displayName: 'User 2',
        avatarUrl: null,
        role: 'student',
        status: 'active',
        preferences: {
          targetLevel: 'beginner',
          dailyGoalMinutes: 15,
          reminderEnabled: false,
        },
        stats: {
          streakDays: 3,
          lastActiveDate: yesterdayStr,
          totalXp: 50,
          wordsLearnedCount: 20,
          lessonsCompletedCount: 2,
        },
      };
      repoMock.findById.mockResolvedValue(user);
      repoMock.update.mockResolvedValue(undefined);

      const result = await service.updateLoginStreak('uid-2');
      expect(result.stats.streakDays).toBe(4);
    });
  });

  describe('toProfileDto', () => {
    it('chuyển đổi user entity sang UserProfileDto', () => {
      const user: UserEntity = {
        id: 'uid-456',
        email: 'user@test.com',
        displayName: 'John Doe',
        avatarUrl: null,
        role: 'student',
        status: 'active',
        preferences: {
          targetLevel: 'beginner',
          dailyGoalMinutes: 15,
          reminderEnabled: false,
        },
        stats: {
          streakDays: 5,
          lastActiveDate: '2026-10-14',
          totalXp: 120,
          wordsLearnedCount: 40,
          lessonsCompletedCount: 4,
        },
      };

      const dto = service.toProfileDto(user);
      expect(dto.id).toBe('uid-456');
      expect(dto.email).toBe('user@test.com');
      expect(dto.stats.streakDays).toBe(5);
    });
  });
});
