import { Module } from '@nestjs/common';
import { VocabulariesRepository } from './vocabularies.repository.js';
import { VocabulariesService } from './vocabularies.service.js';
import { VocabulariesController } from './vocabularies.controller.js';
import { DecksModule } from '../decks/decks.module.js';
import { GeminiModule } from '../../providers/gemini/index.js';

@Module({
  imports: [DecksModule, GeminiModule],
  controllers: [VocabulariesController],
  providers: [VocabulariesRepository, VocabulariesService],
  exports: [VocabulariesService, VocabulariesRepository],
})
export class VocabulariesModule {}
