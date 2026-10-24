import { Module } from '@nestjs/common';
import { DecksRepository } from './decks.repository.js';
import { DecksService } from './decks.service.js';
import { DecksController } from './decks.controller.js';

@Module({
  controllers: [DecksController],
  providers: [DecksRepository, DecksService],
  exports: [DecksService, DecksRepository],
})
export class DecksModule {}
