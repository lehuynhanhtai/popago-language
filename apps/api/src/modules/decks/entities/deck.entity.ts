import type { BaseEntity } from '../../../common/repositories/base.repository.js';

export interface DeckEntity extends BaseEntity {
  userId: string;
  name: string;
  description?: string;
  themeColor: string;
  icon: string;
  tags: string[];
  totalWords: number;
  learnedWords: number;
}
