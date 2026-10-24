import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CreateVocabularyInput, PartOfSpeech, VocabularyExample } from '@repo/shared';

export class VocabularyExampleDto implements VocabularyExample {
  @ApiProperty({
    example: 'He possesses profound knowledge of history.',
    description: 'Câu ví dụ tiếng Anh',
  })
  sentence!: string;

  @ApiProperty({
    example: 'Anh ấy có hiểu biết sâu sắc về lịch sử.',
    description: 'Bản dịch tiếng Việt của ví dụ',
  })
  translationVi!: string;
}

export class CreateVocabularyDto implements CreateVocabularyInput {
  @ApiProperty({
    example: 'profound',
    description: 'Từ vựng tiếng Anh',
  })
  word!: string;

  @ApiPropertyOptional({
    example: '/prəˈfaʊnd/',
    description: 'Phiên âm IPA',
  })
  phonetic?: string;

  @ApiPropertyOptional({
    example: 'adjective',
    description: 'Loại từ (noun, verb, adjective, adverb, ...)',
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
    default: 'other',
  })
  partOfSpeech?: PartOfSpeech;

  @ApiProperty({
    example: 'sâu sắc, uyên thâm',
    description: 'Nghĩa tiếng Việt',
  })
  meaningVi!: string;

  @ApiPropertyOptional({
    example: 'Very great or intense; having or showing great knowledge.',
    description: 'Định nghĩa bằng tiếng Anh',
  })
  definitionEn?: string;

  @ApiPropertyOptional({
    type: [VocabularyExampleDto],
    description: 'Danh sách câu ví dụ',
    default: [],
  })
  examples?: VocabularyExampleDto[];

  @ApiPropertyOptional({
    example: false,
    description: 'Đã thuộc từ này hay chưa',
    default: false,
  })
  isLearned?: boolean;
}
