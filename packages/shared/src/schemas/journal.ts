import { z } from 'zod';

const JOURNAL_MOOD_VALUES = [
  'happy',
  'peaceful',
  'grateful',
  'thoughtful',
  'energetic',
  'tired',
  'sad',
] as const;

const JOURNAL_WEATHER_VALUES = [
  'sunny',
  'cloudy',
  'rainy',
  'windy',
  'snowy',
] as const;

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const createJournalSchema = z.object({
  title: z
    .string()
    .trim()
    .max(120, 'Tiêu đề không được vượt quá 120 ký tự')
    .optional(),
  content: z
    .string()
    .min(5, 'Nội dung phải có ít nhất 5 ký tự')
    .max(5000, 'Nội dung không được vượt quá 5000 ký tự'),
  mood: z.enum(JOURNAL_MOOD_VALUES),
  weather: z.enum(JOURNAL_WEATHER_VALUES),
  writtenDate: z
    .string()
    .regex(DATE_REGEX, 'Định dạng ngày không hợp lệ, cần theo dạng YYYY-MM-DD')
    .optional(),
  tags: z
    .array(
      z
        .string()
        .trim()
        .max(20, 'Mỗi tag không được vượt quá 20 ký tự'),
    )
    .max(5, 'Tối đa 5 tags')
    .optional(),
  isFavorite: z.boolean().optional(),
  analyzeImmediately: z.boolean().optional(),
});

export type CreateJournalDto = z.infer<typeof createJournalSchema>;

export const updateJournalSchema = z.object({
  title: z
    .string()
    .trim()
    .max(120, 'Tiêu đề không được vượt quá 120 ký tự')
    .optional(),
  content: z
    .string()
    .min(5, 'Nội dung phải có ít nhất 5 ký tự')
    .max(5000, 'Nội dung không được vượt quá 5000 ký tự')
    .optional(),
  mood: z.enum(JOURNAL_MOOD_VALUES).optional(),
  weather: z.enum(JOURNAL_WEATHER_VALUES).optional(),
  tags: z
    .array(
      z
        .string()
        .trim()
        .max(20, 'Mỗi tag không được vượt quá 20 ký tự'),
    )
    .max(5, 'Tối đa 5 tags')
    .optional(),
  isFavorite: z.boolean().optional(),
});

export type UpdateJournalDto = z.infer<typeof updateJournalSchema>;

export const queryJournalSchema = z.object({
  limit: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .pipe(z.number().int().min(1).max(50))
    .optional(),
  startAfterId: z.string().optional(),
  search: z.string().trim().max(100).optional(),
  mood: z.enum(JOURNAL_MOOD_VALUES).optional(),
  isFavorite: z
    .union([z.string(), z.boolean()])
    .transform((v) => v === true || v === 'true')
    .optional(),
  fromDate: z
    .string()
    .regex(DATE_REGEX, 'fromDate cần theo dạng YYYY-MM-DD')
    .optional(),
  toDate: z
    .string()
    .regex(DATE_REGEX, 'toDate cần theo dạng YYYY-MM-DD')
    .optional(),
});

export type QueryJournalDto = z.infer<typeof queryJournalSchema>;
