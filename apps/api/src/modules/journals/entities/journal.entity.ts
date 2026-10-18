import type { BaseEntity } from '../../../common/repositories/base.repository.js';
import type {
  JournalMood,
  JournalWeather,
  JournalAiAnalysis,
} from '@repo/shared';

export interface JournalEntity extends BaseEntity {
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
}
