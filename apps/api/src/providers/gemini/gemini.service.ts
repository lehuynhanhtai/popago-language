import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, SchemaType, type ResponseSchema } from '@google/generative-ai';
import { randomUUID } from 'node:crypto';
import type {
  JournalAiAnalysis,
  CefrLevel,
  FeedbackType,
  AiAutofillWordResult,
  PartOfSpeech,
} from '@repo/shared';

const VOCABULARY_AUTOFILL_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    word: {
      type: SchemaType.STRING,
      description: 'The standard English word or phrase in lowercase or standard casing',
    },
    phonetic: {
      type: SchemaType.STRING,
      description: 'International Phonetic Alphabet (IPA) pronunciation (e.g. /rɪˈzɪl.i.ənt/)',
    },
    partOfSpeech: {
      type: SchemaType.STRING,
      format: 'enum',
      enum: [
        'noun',
        'verb',
        'adjective',
        'adverb',
        'preposition',
        'conjunction',
        'phrase',
        'idiom',
        'other',
      ],
      description: 'Part of speech classification',
    },
    meaningVi: {
      type: SchemaType.STRING,
      description: 'Accurate, concise, and natural Vietnamese definition of the word',
    },
    definitionEn: {
      type: SchemaType.STRING,
      description: 'Clear, simple English definition/explanation',
    },
    examples: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          sentence: {
            type: SchemaType.STRING,
            description: 'A realistic, contextual English example sentence demonstrating the word',
          },
          translationVi: {
            type: SchemaType.STRING,
            description: 'Vietnamese translation of the example sentence',
          },
        },
        required: ['sentence', 'translationVi'],
      },
      description: '1 to 2 realistic example sentences with Vietnamese translations',
    },
  },
  required: [
    'word',
    'phonetic',
    'partOfSpeech',
    'meaningVi',
    'definitionEn',
    'examples',
  ],
};

const JOURNAL_ANALYSIS_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    overallScore: {
      type: SchemaType.INTEGER,
      description: 'Overall score from 0 to 100 based on grammatical accuracy, vocabulary variety, and coherence',
    },
    cefrEstimate: {
      type: SchemaType.STRING,
      format: 'enum',
      enum: ['A1', 'A2', 'B1', 'B2', 'C1'],
      description: 'Estimated CEFR level of the writing',
    },
    encouragement: {
      type: SchemaType.STRING,
      description: 'Encouraging pedagogical remark in Vietnamese to motivate the learner to keep writing',
    },
    strengths: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: '1 to 3 specific strengths observed in the writing, written in Vietnamese',
    },
    feedbackList: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          originalText: {
            type: SchemaType.STRING,
            description: 'The exact problematic or awkward phrase from the student text',
          },
          suggestedText: {
            type: SchemaType.STRING,
            description: 'The corrected or more natural alternative',
          },
          explanation: {
            type: SchemaType.STRING,
            description: 'Clear, helpful explanation in Vietnamese explaining why this change was suggested',
          },
          type: {
            type: SchemaType.STRING,
            format: 'enum',
            enum: ['grammar', 'vocabulary', 'natural_expression'],
            description: 'Classification of the feedback',
          },
        },
        required: ['originalText', 'suggestedText', 'explanation', 'type'],
      },
      description: 'List of specific sentence/word corrections and suggestions',
    },
  },
  required: ['overallScore', 'cefrEstimate', 'encouragement', 'strengths', 'feedbackList'],
};

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly client: GoogleGenerativeAI | null = null;
  private readonly modelName: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey =
      this.configService.get<string>('GEMINI_API_KEY') ||
      process.env.GEMINI_API_KEY ||
      this.configService.get<string>('FIREBASE_API_KEY') ||
      process.env.FIREBASE_API_KEY ||
      '';

    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    if (apiKey) {
      this.client = new GoogleGenerativeAI(apiKey);
      this.logger.log(`GeminiService initialized with model ${this.modelName}`);
    } else {
      this.logger.warn(
        'GEMINI_API_KEY is not defined. AI analysis will fallback to algorithmic mock analysis.',
      );
    }
  }

  /**
   * Phân tích bài viết nhật ký tiếng Anh của học viên qua Gemini API
   */
  async analyzeJournal(
    content: string,
    wordCount: number,
  ): Promise<JournalAiAnalysis> {
    if (!this.client) {
      this.logger.warn('Gemini client unavailable, using fallback analysis');
      return this.buildFallbackAnalysis(content, wordCount);
    }

    try {
      const model = this.client.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: JOURNAL_ANALYSIS_SCHEMA,
          temperature: 0.3,
        },
        systemInstruction: `You are an expert English language tutor evaluating an English learner's journal entry.
Analyze the student's text for:
1. Grammar errors, spelling, punctuation.
2. Vocabulary usage, collocations, and richness.
3. Natural expressions vs unnatural literal translations.
4. Estimated CEFR level (A1, A2, B1, B2, C1).
5. Overall score (0-100).

Guidelines:
- All explanations, strengths, and encouragement MUST be in Vietnamese (Tiếng Việt) so the learner easily understands.
- Be pedagogical, constructive, and motivating.
- If the text has no obvious errors, praise the student and suggest even more idiomatic or advanced expressions.
- Keep feedbackList focused on the most valuable corrections (maximum 5-7 key items).`,
      });

      const prompt = `Please analyze the following English journal entry (${wordCount} words):\n\n"""\n${content}\n"""`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      if (!responseText) {
        throw new Error('Empty response from Gemini API');
      }

      const parsed = JSON.parse(responseText) as {
        overallScore: number;
        cefrEstimate: CefrLevel;
        encouragement: string;
        strengths: string[];
        feedbackList: Array<{
          id?: string;
          originalText: string;
          suggestedText: string;
          explanation: string;
          type: FeedbackType;
        }>;
      };

      return {
        overallScore: Math.min(100, Math.max(0, Math.round(parsed.overallScore))),
        cefrEstimate: parsed.cefrEstimate || 'A1',
        encouragement: parsed.encouragement || 'Tiếp tục duy trì thói quen viết tiếng Anh mỗi ngày nhé!',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Thói quen luyện viết tiếng Anh đáng khen ngợi!'],
        feedbackList: (parsed.feedbackList || []).map((item) => ({
          id: item.id || randomUUID(),
          originalText: item.originalText,
          suggestedText: item.suggestedText,
          explanation: item.explanation,
          type: item.type,
        })),
        analyzedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to analyze journal with Gemini API: ${(error as Error).message}`,
        (error as Error).stack,
      );
      return this.buildFallbackAnalysis(content, wordCount);
    }
  }

  /**
   * Thuật toán phân tích dự phòng khi mất kết nối mạng hoặc lỗi quota
   */
  buildFallbackAnalysis(content: string, wordCount: number): JournalAiAnalysis {
    const score = Math.min(100, 60 + Math.min(30, wordCount));
    const cefrMap: Array<[number, CefrLevel]> = [
      [85, 'C1'],
      [75, 'B2'],
      [60, 'B1'],
      [40, 'A2'],
      [0, 'A1'],
    ];
    const cefrEstimate =
      cefrMap.find(([threshold]) => score >= threshold)?.[1] ?? 'A1';

    return {
      overallScore: score,
      cefrEstimate,
      encouragement:
        wordCount >= 30
          ? 'Tuyệt vời! Bạn đã hoàn thành bài viết hôm nay. Tiếp tục phát huy thói quen viết tiếng Anh!'
          : `Bạn đã viết ${wordCount} từ. Hãy viết thêm một vài câu nữa để rèn luyện tư duy phản xạ tiếng Anh sâu hơn nhé!`,
      strengths: ['Nỗ lực viết bằng tiếng Anh mỗi ngày là thói quen tuyệt vời!'],
      feedbackList: [],
      analyzedAt: new Date(),
    };
  }

  /**
   * Tự động tra cứu và sinh thông tin từ vựng tiếng Anh (IPA, Nghĩa tiếng Việt, ví dụ ngữ cảnh)
   */
  async autofillWord(word: string): Promise<AiAutofillWordResult> {
    const cleanWord = word.trim();
    if (!this.client) {
      this.logger.warn('Gemini client unavailable, using fallback autofill');
      return this.buildFallbackAutofill(cleanWord);
    }

    try {
      const model = this.client.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: VOCABULARY_AUTOFILL_SCHEMA,
          temperature: 0.2,
        },
        systemInstruction: `You are an expert bilingual English-Vietnamese lexicographer and teacher.
Given an English word or phrase:
1. Provide its standard International Phonetic Alphabet (IPA).
2. Determine its most common part of speech ('noun', 'verb', 'adjective', 'adverb', 'phrase', etc.).
3. Provide an accurate, natural, concise Vietnamese meaning (nghĩa tiếng Việt).
4. Provide a clear, simple English definition.
5. Provide 1 to 2 realistic, natural example sentences with accurate Vietnamese translations.`,
      });

      const prompt = `Lookup and generate vocabulary details for the English word: "${cleanWord}"`;
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      if (!responseText) {
        throw new Error('Empty response from Gemini API for vocabulary autofill');
      }

      const parsed = JSON.parse(responseText) as AiAutofillWordResult;

      return {
        word: parsed.word || cleanWord,
        phonetic: parsed.phonetic || '',
        partOfSpeech: parsed.partOfSpeech || 'other',
        meaningVi: parsed.meaningVi || '',
        definitionEn: parsed.definitionEn || '',
        examples: Array.isArray(parsed.examples)
          ? parsed.examples.map((ex) => ({
              sentence: ex.sentence,
              translationVi: ex.translationVi,
            }))
          : [],
      };
    } catch (error) {
      this.logger.error(
        `Failed to autofill word "${cleanWord}" with Gemini API: ${(error as Error).message}`,
        (error as Error).stack,
      );
      return this.buildFallbackAutofill(cleanWord);
    }
  }

  /**
   * Dữ liệu dự phòng khi không gọi được AI
   */
  buildFallbackAutofill(word: string): AiAutofillWordResult {
    return {
      word,
      phonetic: '',
      partOfSpeech: 'other',
      meaningVi: `(Chưa có bản dịch AI cho ${word})`,
      definitionEn: '',
      examples: [
        {
          sentence: `This is an example sentence using the word "${word}".`,
          translationVi: `Đây là một câu ví dụ sử dụng từ "${word}".`,
        },
      ],
    };
  }
}
