import type { BaseEntity } from '../../../common/repositories/base.repository.js';
import type { PartOfSpeech, VocabularyExample } from '@repo/shared';

export interface VocabularyEntity extends BaseEntity {
  deckId: string;
  userId: string;
  word: string;
  phonetic?: string;
  partOfSpeech: PartOfSpeech;
  meaningVi: string;
  definitionEn?: string;
  examples: VocabularyExample[];
  isLearned: boolean;
}
