import { z } from 'zod';

const PART_OF_SPEECH_VALUES = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'preposition',
  'conjunction',
  'phrase',
  'idiom',
  'other',
] as const;

// -------------------------------------------------------------------
// 1. Deck Schemas
// -------------------------------------------------------------------

export const createDeckSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tên bộ từ không được để trống')
    .max(100, 'Tên bộ từ không được vượt quá 100 ký tự'),
  description: z
    .string()
    .trim()
    .max(300, 'Mô tả không được vượt quá 300 ký tự')
    .optional(),
  themeColor: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$|^[a-z]+(-[a-z0-9]+)*$/, 'Mã màu không hợp lệ')
    .default('#10b981'),
  icon: z
    .string()
    .trim()
    .max(30, 'Icon không được vượt quá 30 ký tự')
    .default('📚'),
  tags: z
    .array(z.string().trim().max(30, 'Mỗi tag không được vượt quá 30 ký tự'))
    .max(10, 'Tối đa 10 tags')
    .default([]),
});

export type CreateDeckDto = z.input<typeof createDeckSchema>;

export const updateDeckSchema = createDeckSchema.partial();
export type UpdateDeckDto = z.infer<typeof updateDeckSchema>;

export const queryDeckSchema = z.object({
  search: z.string().trim().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50).optional(),
  startAfterId: z.string().trim().optional(),
});

export type QueryDeckDto = z.infer<typeof queryDeckSchema>;

// -------------------------------------------------------------------
// 2. Vocabulary Schemas
// -------------------------------------------------------------------

const vocabularyExampleSchema = z.object({
  sentence: z
    .string()
    .trim()
    .min(1, 'Câu ví dụ không được để trống')
    .max(500, 'Câu ví dụ không được quá 500 ký tự'),
  translationVi: z
    .string()
    .trim()
    .min(1, 'Bản dịch ví dụ không được để trống')
    .max(500, 'Bản dịch ví dụ không được quá 500 ký tự'),
});

export const createVocabularySchema = z.object({
  word: z
    .string()
    .trim()
    .min(1, 'Từ vựng không được để trống')
    .max(100, 'Từ vựng không được vượt quá 100 ký tự'),
  phonetic: z
    .string()
    .trim()
    .max(100, 'Phiên âm không được vượt quá 100 ký tự')
    .optional(),
  partOfSpeech: z.enum(PART_OF_SPEECH_VALUES).default('noun'),
  meaningVi: z
    .string()
    .trim()
    .min(1, 'Nghĩa tiếng Việt không được để trống')
    .max(500, 'Nghĩa tiếng Việt không được vượt quá 500 ký tự'),
  definitionEn: z
    .string()
    .trim()
    .max(500, 'Định nghĩa tiếng Anh không được vượt quá 500 ký tự')
    .optional(),
  examples: z
    .array(vocabularyExampleSchema)
    .max(5, 'Tối đa 5 câu ví dụ')
    .default([]),
  isLearned: z.boolean().default(false),
});

export type CreateVocabularyDto = z.input<typeof createVocabularySchema>;

export const updateVocabularySchema = createVocabularySchema.partial().extend({
  deckId: z.string().trim().optional(),
});

export type UpdateVocabularyDto = z.infer<typeof updateVocabularySchema>;

export const queryVocabularySchema = z.object({
  search: z.string().trim().max(100).optional(),
  isLearned: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50).optional(),
  startAfterId: z.string().trim().optional(),
});

export type QueryVocabularyDto = z.infer<typeof queryVocabularySchema>;

// -------------------------------------------------------------------
// 3. AI Autofill Schema
// -------------------------------------------------------------------

export const aiAutofillWordSchema = z.object({
  word: z
    .string()
    .trim()
    .min(1, 'Từ tiếng Anh cần tra cứu không được để trống')
    .max(80, 'Từ tiếng Anh không được vượt quá 80 ký tự'),
});

export type AiAutofillWordDto = z.infer<typeof aiAutofillWordSchema>;
