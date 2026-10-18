import type {
  JournalMood,
  JournalWeather,
  AiFeedbackItem,
  JournalAiAnalysis,
  JournalDto,
  CreateJournalInput,
  UpdateJournalInput,
  QueryJournalInput,
} from "@repo/shared";

export type {
  JournalMood,
  JournalWeather,
  AiFeedbackItem,
  JournalAiAnalysis,
  JournalDto,
  CreateJournalInput,
  UpdateJournalInput,
  QueryJournalInput,
};

/**
 * Tương thích ngược với dữ liệu mẫu tĩnh (mock-data)
 */
export type MockJournalEntry = Omit<JournalDto, "userId"> & {
  userId?: string;
};
