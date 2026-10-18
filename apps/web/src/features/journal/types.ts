export type JournalMood =
  | 'happy'
  | 'peaceful'
  | 'grateful'
  | 'thoughtful'
  | 'energetic'
  | 'tired'
  | 'sad';

export type JournalWeather =
  | 'sunny'
  | 'cloudy'
  | 'rainy'
  | 'windy'
  | 'snowy';

export interface AiFeedbackItem {
  id: string;
  originalText: string;
  suggestedText: string;
  explanation: string;
  type: 'grammar' | 'vocabulary' | 'natural_expression';
}

export interface JournalAiAnalysis {
  overallScore: number; // 0 - 100
  cefrEstimate: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  feedbackList: AiFeedbackItem[];
  encouragement: string;
  strengths: string[];
}

export interface MockJournalEntry {
  id: string;
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
