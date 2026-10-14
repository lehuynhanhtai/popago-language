import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import type { UserEntity } from './entities/user.entity.js';
import type { RegisterInput, UserProfileDto } from '@repo/shared';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(uid: string, input: RegisterInput): Promise<UserEntity> {
    const newUser: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'> = {
      email: input.email.toLowerCase().trim(),
      displayName: input.displayName.trim(),
      avatarUrl: null,
      role: 'student',
      status: 'active',
      preferences: {
        targetLevel: input.targetLevel ?? 'beginner',
        dailyGoalMinutes: input.dailyGoalMinutes ?? 15,
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

    return this.usersRepository.create(newUser, uid);
  }

  async findById(uid: string): Promise<UserEntity | null> {
    return this.usersRepository.findById(uid);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findByEmail(email);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.usersRepository.existsByEmail(email);
  }

  async deleteUser(uid: string): Promise<void> {
    return this.usersRepository.delete(uid);
  }

  async syncUserProfile(
    uid: string,
    email: string,
    displayName?: string,
  ): Promise<UserEntity> {
    const existing = await this.findById(uid);
    if (existing) {
      return existing;
    }

    const newUser: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'> = {
      email: email.toLowerCase().trim(),
      displayName: displayName?.trim() || email.split('@')[0] || 'Student',
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

    return this.usersRepository.create(newUser, uid);
  }

  async updateLoginStreak(uid: string): Promise<UserEntity> {
    const user = await this.findById(uid);
    if (!user) {
      throw new Error(`User with uid ${uid} not found`);
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const lastActive = user.stats?.lastActiveDate;

    let newStreak = user.stats?.streakDays ?? 0;

    if (!lastActive) {
      newStreak = 1;
    } else if (lastActive === todayStr) {
      newStreak = newStreak === 0 ? 1 : newStreak;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      if (lastActive === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    const updatedStats = {
      ...user.stats,
      streakDays: newStreak,
      lastActiveDate: todayStr,
    };

    await this.usersRepository.update(uid, {
      stats: updatedStats,
    });

    return {
      ...user,
      stats: updatedStats,
    };
  }

  toProfileDto(user: UserEntity): UserProfileDto {
    return {
      id: user.id ?? '',
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      status: user.status,
      preferences: user.preferences,
      stats: user.stats,
      createdAt: user.createdAt instanceof Date ? user.createdAt : undefined,
      updatedAt: user.updatedAt instanceof Date ? user.updatedAt : undefined,
    };
  }
}
