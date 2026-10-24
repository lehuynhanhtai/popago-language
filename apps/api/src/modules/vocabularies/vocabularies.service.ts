import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VocabulariesRepository } from './vocabularies.repository.js';
import { DecksService } from '../decks/decks.service.js';
import { DecksRepository } from '../decks/decks.repository.js';
import { GeminiService } from '../../providers/gemini/index.js';
import type { VocabularyEntity } from './entities/vocabulary.entity.js';
import type {
  CreateVocabularyDto,
  UpdateVocabularyDto,
  QueryVocabularyDto,
  VocabularyDto,
  AiAutofillWordDto,
  AiAutofillWordResult,
  PaginatedResult,
} from '@repo/shared';

@Injectable()
export class VocabulariesService {
  constructor(
    private readonly vocabulariesRepository: VocabulariesRepository,
    private readonly decksService: DecksService,
    private readonly decksRepository: DecksRepository,
    private readonly geminiService: GeminiService,
  ) {}

  // -------------------------------------------------------------------
  // 1. Thêm từ vựng mới vào bộ từ
  // -------------------------------------------------------------------
  async create(
    userId: string,
    deckId: string,
    dto: CreateVocabularyDto,
  ): Promise<VocabularyDto> {
    // Đảm bảo học viên sở hữu bộ từ này
    await this.decksService.findOne(userId, deckId);

    const isLearned = dto.isLearned ?? false;
    const newEntry = await this.vocabulariesRepository.create({
      deckId,
      userId,
      word: dto.word.trim(),
      phonetic: dto.phonetic?.trim(),
      partOfSpeech: dto.partOfSpeech ?? 'noun',
      meaningVi: dto.meaningVi.trim(),
      definitionEn: dto.definitionEn?.trim(),
      examples: dto.examples ?? [],
      isLearned,
    });

    // Cập nhật số lượng từ trong bộ
    await this.decksRepository.updateWordCounts(deckId, 1, isLearned ? 1 : 0);

    return this.toDto(newEntry);
  }

  // -------------------------------------------------------------------
  // 2. Lấy danh sách từ trong một bộ từ
  // -------------------------------------------------------------------
  async findAllByDeck(
    userId: string,
    deckId: string,
    query: QueryVocabularyDto,
  ): Promise<PaginatedResult<VocabularyDto>> {
    // Đảm bảo học viên sở hữu bộ từ này
    await this.decksService.findOne(userId, deckId);

    if (query.search) {
      const items = await this.vocabulariesRepository.searchInDeck(
        deckId,
        query.search,
        query.limit ?? 50,
      );
      return {
        items: items.map(this.toDto),
        hasMore: false,
      };
    }

    const result = await this.vocabulariesRepository.findByDeckId(deckId, query);
    return {
      items: result.items.map(this.toDto),
      lastId: result.lastId,
      hasMore: result.hasMore,
    };
  }

  // -------------------------------------------------------------------
  // 3. Lấy chi tiết một từ vựng
  // -------------------------------------------------------------------
  async findOne(userId: string, id: string): Promise<VocabularyDto> {
    const entry = await this.vocabulariesRepository.findById(id);
    if (!entry) {
      throw new NotFoundException('Không tìm thấy từ vựng');
    }
    this.assertOwnership(userId, entry);
    return this.toDto(entry);
  }

  // -------------------------------------------------------------------
  // 4. Cập nhật từ vựng
  // -------------------------------------------------------------------
  async update(
    userId: string,
    id: string,
    dto: UpdateVocabularyDto,
  ): Promise<VocabularyDto> {
    const entry = await this.vocabulariesRepository.findById(id);
    if (!entry) {
      throw new NotFoundException('Không tìm thấy từ vựng');
    }
    this.assertOwnership(userId, entry);

    // Di chuyển sang bộ từ khác nếu có
    if (dto.deckId && dto.deckId !== entry.deckId) {
      await this.decksService.findOne(userId, dto.deckId);

      // Trừ số lượng ở bộ cũ
      await this.decksRepository.updateWordCounts(
        entry.deckId,
        -1,
        entry.isLearned ? -1 : 0,
      );

      // Cộng số lượng ở bộ mới
      const newLearned = dto.isLearned !== undefined ? dto.isLearned : entry.isLearned;
      await this.decksRepository.updateWordCounts(
        dto.deckId,
        1,
        newLearned ? 1 : 0,
      );
    } else if (dto.isLearned !== undefined && dto.isLearned !== entry.isLearned) {
      // Cập nhật số từ đã học trong bộ hiện tại
      const learnedDelta = dto.isLearned ? 1 : -1;
      await this.decksRepository.updateWordCounts(entry.deckId, 0, learnedDelta);
    }

    const updatePayload: Partial<VocabularyEntity> = {};
    if (dto.word !== undefined) updatePayload.word = dto.word.trim();
    if (dto.phonetic !== undefined) updatePayload.phonetic = dto.phonetic.trim();
    if (dto.partOfSpeech !== undefined) updatePayload.partOfSpeech = dto.partOfSpeech;
    if (dto.meaningVi !== undefined) updatePayload.meaningVi = dto.meaningVi.trim();
    if (dto.definitionEn !== undefined) updatePayload.definitionEn = dto.definitionEn.trim();
    if (dto.examples !== undefined) updatePayload.examples = dto.examples;
    if (dto.isLearned !== undefined) updatePayload.isLearned = dto.isLearned;
    if (dto.deckId !== undefined) updatePayload.deckId = dto.deckId;

    await this.vocabulariesRepository.update(id, updatePayload);
    const updated = await this.vocabulariesRepository.findById(id);
    return this.toDto(updated ?? { ...entry, ...updatePayload });
  }

  // -------------------------------------------------------------------
  // 5. Xóa từ vựng khỏi bộ từ
  // -------------------------------------------------------------------
  async remove(userId: string, id: string): Promise<void> {
    const entry = await this.vocabulariesRepository.findById(id);
    if (!entry) {
      throw new NotFoundException('Không tìm thấy từ vựng');
    }
    this.assertOwnership(userId, entry);

    // Trừ số từ trong bộ
    await this.decksRepository.updateWordCounts(
      entry.deckId,
      -1,
      entry.isLearned ? -1 : 0,
    );

    await this.vocabulariesRepository.delete(id);
  }

  // -------------------------------------------------------------------
  // 6. Đổi trạng thái đã thuộc / chưa thuộc (Toggle Learned)
  // -------------------------------------------------------------------
  async toggleLearned(userId: string, id: string): Promise<VocabularyDto> {
    const entry = await this.vocabulariesRepository.findById(id);
    if (!entry) {
      throw new NotFoundException('Không tìm thấy từ vựng');
    }
    this.assertOwnership(userId, entry);

    const nextLearned = !entry.isLearned;
    const learnedDelta = nextLearned ? 1 : -1;

    await this.vocabulariesRepository.update(id, { isLearned: nextLearned });
    await this.decksRepository.updateWordCounts(entry.deckId, 0, learnedDelta);

    return this.toDto({ ...entry, isLearned: nextLearned });
  }

  // -------------------------------------------------------------------
  // 7. AI Autofill: Tự động điền chi tiết từ vựng
  // -------------------------------------------------------------------
  async autofill(dto: AiAutofillWordDto): Promise<AiAutofillWordResult> {
    return this.geminiService.autofillWord(dto.word);
  }

  // -------------------------------------------------------------------
  // Helper methods
  // -------------------------------------------------------------------
  assertOwnership(userId: string, entity: VocabularyEntity): void {
    if (entity.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền truy cập từ vựng này');
    }
  }

  toDto(entity: VocabularyEntity): VocabularyDto {
    const createdAt = entity.createdAt
      ? typeof (entity.createdAt as { toDate?: () => Date }).toDate === 'function'
        ? (entity.createdAt as { toDate: () => Date }).toDate().toISOString()
        : entity.createdAt instanceof Date
          ? entity.createdAt.toISOString()
          : String(entity.createdAt)
      : undefined;

    const updatedAt = entity.updatedAt
      ? typeof (entity.updatedAt as { toDate?: () => Date }).toDate === 'function'
        ? (entity.updatedAt as { toDate: () => Date }).toDate().toISOString()
        : entity.updatedAt instanceof Date
          ? entity.updatedAt.toISOString()
          : String(entity.updatedAt)
      : undefined;

    return {
      id: entity.id ?? '',
      deckId: entity.deckId,
      userId: entity.userId,
      word: entity.word,
      phonetic: entity.phonetic,
      partOfSpeech: entity.partOfSpeech,
      meaningVi: entity.meaningVi,
      definitionEn: entity.definitionEn,
      examples: entity.examples ?? [],
      isLearned: entity.isLearned ?? false,
      createdAt,
      updatedAt,
    };
  }
}
