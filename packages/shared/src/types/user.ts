export type UserRole = 'student' | 'teacher' | 'admin';

export type EnglishLevel = 'beginner' | 'intermediate' | 'advanced';

export type AccountStatus = 'active' | 'suspended' | 'deleted';

export interface LearningPreferences {
  targetLevel: EnglishLevel;
  dailyGoalMinutes: number;
  reminderEnabled: boolean;
  reminderTime?: string;
}

export interface UserStats {
  streakDays: number;
  lastActiveDate: string | null;
  totalXp: number;
  wordsLearnedCount: number;
  lessonsCompletedCount: number;
}

export interface UserProfileDto {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  status: AccountStatus;
  preferences: LearningPreferences;
  stats: UserStats;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface AuthLoginResult {
  user: UserProfileDto;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface ForgotPasswordResult {
  email: string;
  resetLink?: string;
}
