import type { BaseEntity } from '../../../common/repositories/base.repository.js';
import type {
  UserRole,
  AccountStatus,
  LearningPreferences,
  UserStats,
} from '@repo/shared';

export interface UserEntity extends BaseEntity {
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  status: AccountStatus;
  preferences: LearningPreferences;
  stats: UserStats;
}
