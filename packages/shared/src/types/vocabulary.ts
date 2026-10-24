export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'phrase'
  | 'idiom'
  | 'other';

export interface DeckDto {
  id: string;
  userId: string;
  name: string;
  description?: string;
  themeColor: string;
  icon: string;
  tags: string[];
  totalWords: number;
  learnedWords: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateDeckInput {
  name: string;
  description?: string;
  themeColor?: string;
  icon?: string;
  tags?: string[];
}

export interface UpdateDeckInput {
  name?: string;
  description?: string;
  themeColor?: string;
  icon?: string;
  tags?: string[];
}

export interface QueryDeckInput {
  search?: string;
  limit?: number;
  startAfterId?: string;
}

export interface VocabularyExample {
  sentence: string;
  translationVi: string;
}

export interface VocabularyDto {
  id: string;
  deckId: string;
  userId: string;
  word: string;
  phonetic?: string;
  partOfSpeech: PartOfSpeech;
  meaningVi: string;
  definitionEn?: string;
  examples: VocabularyExample[];
  isLearned: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateVocabularyInput {
  word: string;
  phonetic?: string;
  partOfSpeech?: PartOfSpeech;
  meaningVi: string;
  definitionEn?: string;
  examples?: VocabularyExample[];
  isLearned?: boolean;
}

export interface UpdateVocabularyInput {
  word?: string;
  phonetic?: string;
  partOfSpeech?: PartOfSpeech;
  meaningVi?: string;
  definitionEn?: string;
  examples?: VocabularyExample[];
  isLearned?: boolean;
  deckId?: string; // Di chuyển từ sang bộ từ khác
}

export interface QueryVocabularyInput {
  search?: string;
  isLearned?: boolean;
  limit?: number;
  startAfterId?: string;
}

export interface AiAutofillWordInput {
  word: string;
}

export interface AiAutofillWordResult {
  word: string;
  phonetic: string;
  partOfSpeech: PartOfSpeech;
  meaningVi: string;
  definitionEn: string;
  examples: VocabularyExample[];
}
