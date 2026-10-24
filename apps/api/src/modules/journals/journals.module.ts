import { Module } from '@nestjs/common';
import { JournalsRepository } from './journals.repository.js';
import { JournalsService } from './journals.service.js';
import { JournalsController } from './journals.controller.js';
import { UsersModule } from '../users/users.module.js';
import { GeminiModule } from '../../providers/gemini/index.js';

@Module({
  imports: [UsersModule, GeminiModule],
  controllers: [JournalsController],
  providers: [JournalsRepository, JournalsService],
  exports: [JournalsService],
})
export class JournalsModule {}
