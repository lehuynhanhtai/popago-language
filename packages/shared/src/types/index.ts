export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  targetLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export * from './user.js';
