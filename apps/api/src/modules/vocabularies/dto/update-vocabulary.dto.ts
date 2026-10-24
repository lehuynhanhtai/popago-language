import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateVocabularyDto } from './create-vocabulary.dto.js';

export class UpdateVocabularyDto extends PartialType(CreateVocabularyDto) {
  @ApiPropertyOptional({
    example: 'deck_123',
    description: 'Chuyển từ vựng sang bộ từ (deck) khác',
  })
  deckId?: string;
}
