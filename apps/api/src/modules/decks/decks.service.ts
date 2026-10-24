import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DecksRepository } from './decks.repository.js';
import type { DeckEntity } from './entities/deck.entity.js';
import type {
  CreateDeckDto,
  UpdateDeckDto,
  QueryDeckDto,
  DeckDto,
  PaginatedResult,
} from '@repo/shared';

@Injectable()
export class DecksService {
  constructor(private readonly decksRepository: DecksRepository) {}

  // -------------------------------------------------------------------
  // 1. Tạo bộ từ vựng mới
  // -------------------------------------------------------------------
  async create(userId: string, dto: CreateDeckDto): Promise<DeckDto> {
    const existing = await this.decksRepository.findByName(userId, dto.name);
    if (existing) {
      throw new BadRequestException(`Bạn đã có bộ từ vựng với tên "${dto.name}"`);
    }

    const newDeck = await this.decksRepository.create({
      userId,
      name: dto.name.trim(),
      description: dto.description?.trim(),
      themeColor: dto.themeColor ?? '#10b981',
      icon: dto.icon ?? '📚',
      tags: dto.tags ?? [],
      totalWords: 0,
      learnedWords: 0,
    });

    return this.toDto(newDeck);
  }

  // -------------------------------------------------------------------
  // 2. Lấy danh sách bộ từ của học viên
  // -------------------------------------------------------------------
  async findAll(
    userId: string,
    query: QueryDeckDto,
  ): Promise<PaginatedResult<DeckDto>> {
    if (query.search) {
      const items = await this.decksRepository.searchByUserId(
        userId,
        query.search,
        query.limit ?? 50,
      );
      return {
        items: items.map(this.toDto),
        hasMore: false,
      };
    }

    const result = await this.decksRepository.findByUserId(userId, query);
    return {
      items: result.items.map(this.toDto),
      lastId: result.lastId,
      hasMore: result.hasMore,
    };
  }

  // -------------------------------------------------------------------
  // 3. Lấy chi tiết một bộ từ
  // -------------------------------------------------------------------
  async findOne(userId: string, id: string): Promise<DeckDto> {
    const deck = await this.decksRepository.findById(id);
    if (!deck) {
      throw new NotFoundException('Không tìm thấy bộ từ vựng');
    }
    this.assertOwnership(userId, deck);
    return this.toDto(deck);
  }

  // -------------------------------------------------------------------
  // 4. Cập nhật bộ từ
  // -------------------------------------------------------------------
  async update(
    userId: string,
    id: string,
    dto: UpdateDeckDto,
  ): Promise<DeckDto> {
    const deck = await this.decksRepository.findById(id);
    if (!deck) {
      throw new NotFoundException('Không tìm thấy bộ từ vựng');
    }
    this.assertOwnership(userId, deck);

    if (dto.name && dto.name.trim() !== deck.name) {
      const duplicate = await this.decksRepository.findByName(userId, dto.name);
      if (duplicate && duplicate.id !== id) {
        throw new BadRequestException(`Bạn đã có bộ từ vựng khác với tên "${dto.name}"`);
      }
    }

    const updatePayload: Partial<DeckEntity> = {};
    if (dto.name !== undefined) updatePayload.name = dto.name.trim();
    if (dto.description !== undefined) updatePayload.description = dto.description.trim();
    if (dto.themeColor !== undefined) updatePayload.themeColor = dto.themeColor;
    if (dto.icon !== undefined) updatePayload.icon = dto.icon;
    if (dto.tags !== undefined) updatePayload.tags = dto.tags;

    await this.decksRepository.update(id, updatePayload);
    const updated = await this.decksRepository.findById(id);
    return this.toDto(updated ?? { ...deck, ...updatePayload });
  }

  // -------------------------------------------------------------------
  // 5. Xóa bộ từ
  // -------------------------------------------------------------------
  async remove(userId: string, id: string): Promise<void> {
    const deck = await this.decksRepository.findById(id);
    if (!deck) {
      throw new NotFoundException('Không tìm thấy bộ từ vựng');
    }
    this.assertOwnership(userId, deck);

    await this.decksRepository.delete(id);
  }

  // -------------------------------------------------------------------
  // Helper methods
  // -------------------------------------------------------------------
  assertOwnership(userId: string, entity: DeckEntity): void {
    if (entity.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền truy cập bộ từ vựng này');
    }
  }

  toDto(entity: DeckEntity): DeckDto {
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
      userId: entity.userId,
      name: entity.name,
      description: entity.description,
      themeColor: entity.themeColor,
      icon: entity.icon,
      tags: entity.tags ?? [],
      totalWords: entity.totalWords ?? 0,
      learnedWords: entity.learnedWords ?? 0,
      createdAt,
      updatedAt,
    };
  }
}
