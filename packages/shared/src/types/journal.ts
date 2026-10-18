export type JournalMood =
  | 'happy'
  | 'peaceful'
  | 'grateful'
  | 'thoughtful'
  | 'energetic'
  | 'tired'
  | 'sad';

export type JournalWeather = 'sunny' | 'cloudy' | 'rainy' | 'windy' | 'snowy';

export type FeedbackType = 'grammar' | 'vocabulary' | 'natural_expression';

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface AiFeedbackItem {
  id: string;
  originalText: string;
  suggestedText: string;
  explanation: string;
  type: FeedbackType;
}

export interface JournalAiAnalysis {
  overallScore: number; // 0 - 100
  cefrEstimate: CefrLevel;
  encouragement: string;
  strengths: string[];
  feedbackList: AiFeedbackItem[];
  analyzedAt?: string | Date;
}

export interface JournalDto {
  id: string;
  userId: string;
  title: string;
  content: string;
  wordCount: number;
  mood: JournalMood;
  weather: JournalWeather;
  writtenDate: string; // YYYY-MM-DD
  isFavorite: boolean;
  tags: string[];
  aiAnalysis?: JournalAiAnalysis;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateJournalInput {
  title?: string;
  content: string;
  mood: JournalMood;
  weather: JournalWeather;
  writtenDate?: string;
  tags?: string[];
  isFavorite?: boolean;
  analyzeImmediately?: boolean;
}

export interface UpdateJournalInput {
  title?: string;
  content?: string;
  mood?: JournalMood;
  weather?: JournalWeather;
  tags?: string[];
  isFavorite?: boolean;
}

export interface QueryJournalInput {
  limit?: number;
  startAfterId?: string;
  search?: string;
  mood?: JournalMood;
  isFavorite?: boolean;
  fromDate?: string;
  toDate?: string;
}
