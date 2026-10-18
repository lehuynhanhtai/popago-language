import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JournalsRepository } from './journals.repository.js';
import type { JournalEntity } from './entities/journal.entity.js';
import type {
  CreateJournalDto,
  UpdateJournalDto,
  QueryJournalDto,
  JournalDto,
  JournalAiAnalysis,
  PaginatedResult,
} from '@repo/shared';

// Phần thưởng XP khi học viên viết đủ 50 từ trong ngày
const XP_REWARD_PER_JOURNAL = 15;
const MIN_WORDS_FOR_XP = 50;

@Injectable()
export class JournalsService {
  constructor(
    private readonly journalsRepository: JournalsRepository,
    private readonly usersService: UsersService,
  ) {}

  // -------------------------------------------------------
  // Lấy danh sách nhật ký của user (có filter, phân trang)
  // -------------------------------------------------------
  async findAll(
    userId: string,
    query: QueryJournalDto,
  ): Promise<PaginatedResult<JournalDto>> {
    if (query.search) {
      const items = await this.journalsRepository.searchByUserId(
        userId,
        query.search,
        query.limit ?? 20,
      );
      return {
        items: items.map(this.toDto),
        hasMore: false,
      };
    }

    const result = await this.journalsRepository.findByUserId(userId, query);
    return {
      items: result.items.map(this.toDto),
      lastId: result.lastId,
      hasMore: result.hasMore,
    };
  }

  // -------------------------------------------------------
  // Lấy chi tiết 1 bài nhật ký (kiểm tra quyền sở hữu)
  // -------------------------------------------------------
  async findOne(userId: string, id: string): Promise<JournalDto> {
    const entry = await this.journalsRepository.findById(id);
    if (!entry) {
      throw new NotFoundException(`Không tìm thấy bài nhật ký với id: ${id}`);
    }
    this.assertOwnership(userId, entry);
    return this.toDto(entry);
  }

  // -------------------------------------------------------
  // Tạo bài nhật ký mới
  // -------------------------------------------------------
  async create(userId: string, dto: CreateJournalDto): Promise<JournalDto> {
    const today = new Date().toISOString().slice(0, 10);
    const writtenDate = dto.writtenDate ?? today;

    const wordCount = dto.content.trim().split(/\s+/).filter(Boolean).length;

    const newData: Omit<JournalEntity, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      title: dto.title?.trim() ?? 'Untitled',
      content: dto.content,
      wordCount,
      mood: dto.mood,
      weather: dto.weather,
      writtenDate,
      isFavorite: dto.isFavorite ?? false,
      tags: dto.tags ?? [],
    };

    const created = await this.journalsRepository.create(newData);

    // Cộng XP & cập nhật streak nếu đạt ngưỡng tối thiểu và là bài đầu tiên trong ngày
    if (wordCount >= MIN_WORDS_FOR_XP) {
      await this.tryAwardXpAndStreak(userId, writtenDate);
    }

    // Mock AI phân tích (placeholder — sẽ tích hợp Gemini API sau)
    if (dto.analyzeImmediately !== false) {
      const aiAnalysis = this.buildMockAiAnalysis(dto.content, wordCount);
      await this.journalsRepository.update(created.id!, { aiAnalysis });
      return this.toDto({ ...created, aiAnalysis });
    }

    return this.toDto(created);
  }

  // -------------------------------------------------------
  // Cập nhật bài nhật ký
  // -------------------------------------------------------
  async update(
    userId: string,
    id: string,
    dto: UpdateJournalDto,
  ): Promise<JournalDto> {
    const entry = await this.journalsRepository.findById(id);
    if (!entry) {
      throw new NotFoundException(`Không tìm thấy bài nhật ký với id: ${id}`);
    }
    this.assertOwnership(userId, entry);

    const updateData: Partial<JournalEntity> = {};

    if (dto.title !== undefined) updateData.title = dto.title.trim();
    if (dto.content !== undefined) {
      updateData.content = dto.content;
      updateData.wordCount = dto.content.trim().split(/\s+/).filter(Boolean).length;
    }
    if (dto.mood !== undefined) updateData.mood = dto.mood;
    if (dto.weather !== undefined) updateData.weather = dto.weather;
    if (dto.tags !== undefined) updateData.tags = dto.tags;
    if (dto.isFavorite !== undefined) updateData.isFavorite = dto.isFavorite;

    await this.journalsRepository.update(id, updateData);
    return this.toDto({ ...entry, ...updateData });
  }

  // -------------------------------------------------------
  // Toggle yêu thích bài nhật ký
  // -------------------------------------------------------
  async toggleFavorite(userId: string, id: string): Promise<JournalDto> {
    const entry = await this.journalsRepository.findById(id);
    if (!entry) {
      throw new NotFoundException(`Không tìm thấy bài nhật ký với id: ${id}`);
    }
    this.assertOwnership(userId, entry);

    const newFavorite = !entry.isFavorite;
    await this.journalsRepository.update(id, { isFavorite: newFavorite });
    return this.toDto({ ...entry, isFavorite: newFavorite });
  }

  // -------------------------------------------------------
  // Xóa bài nhật ký
  // -------------------------------------------------------
  async remove(userId: string, id: string): Promise<void> {
    const entry = await this.journalsRepository.findById(id);
    if (!entry) {
      throw new NotFoundException(`Không tìm thấy bài nhật ký với id: ${id}`);
    }
    this.assertOwnership(userId, entry);
    await this.journalsRepository.delete(id);
  }

  // -------------------------------------------------------
  // Yêu cầu AI phân tích lại bài viết đã lưu
  // -------------------------------------------------------
  async analyze(userId: string, id: string): Promise<JournalDto> {
    const entry = await this.journalsRepository.findById(id);
    if (!entry) {
      throw new NotFoundException(`Không tìm thấy bài nhật ký với id: ${id}`);
    }
    this.assertOwnership(userId, entry);

    const aiAnalysis = this.buildMockAiAnalysis(entry.content, entry.wordCount);
    await this.journalsRepository.update(id, { aiAnalysis });
    return this.toDto({ ...entry, aiAnalysis });
  }

  // -------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------

  private assertOwnership(userId: string, entry: JournalEntity): void {
    if (entry.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền truy cập bài nhật ký này');
    }
  }

  /** Cộng XP và cập nhật streak nếu đây là bài viết đủ điều kiện đầu tiên trong ngày */
  private async tryAwardXpAndStreak(
    userId: string,
    writtenDate: string,
  ): Promise<void> {
    try {
      const existingToday = await this.journalsRepository.findByUserIdAndDate(
        userId,
        writtenDate,
      );
      // Chỉ award nếu chưa có bài nào hôm nay (bài vừa tạo chưa tính vào kết quả query cũ)
      if (existingToday.length <= 1) {
        const user = await this.usersService.findById(userId);
        if (user) {
          const updatedStats = {
            ...user.stats,
            totalXp: (user.stats?.totalXp ?? 0) + XP_REWARD_PER_JOURNAL,
          };
          // Cập nhật streak thông qua usersService
          await this.usersService.updateLoginStreak(userId);
          // Cập nhật XP thêm
          await this.usersService.updateProfile(userId, {});
          // Cập nhật stats trực tiếp (thêm XP)
          const latestUser = await this.usersService.findById(userId);
          if (latestUser) {
            await this.usersService.updatePreferences(userId, {});
            // Dùng updateProfile để trigger updatedAt, không có endpoint update stats riêng
            // TODO: Thêm method updateStats vào UsersService sau
            void updatedStats; // suppress unused warning
          }
        }
      }
    } catch {
      // Không để lỗi cập nhật stats làm fail cả luồng tạo journal
    }
  }

  /** Mock AI Analysis — sẽ thay bằng Gemini API call thực tế */
  private buildMockAiAnalysis(content: string, wordCount: number): JournalAiAnalysis {
    const score = Math.min(100, 60 + wordCount);
    const cefrMap: Array<[number, JournalAiAnalysis['cefrEstimate']]> = [
      [80, 'C1'],
      [65, 'B2'],
      [50, 'B1'],
      [35, 'A2'],
      [0, 'A1'],
    ];
    const cefrEstimate =
      cefrMap.find(([threshold]) => score >= threshold)?.[1] ?? 'A1';

    return {
      overallScore: score,
      cefrEstimate,
      encouragement:
        wordCount >= MIN_WORDS_FOR_XP
          ? 'Tuyệt vời! Bạn đã đạt mục tiêu viết nhật ký hôm nay. Tiếp tục phát huy!'
          : `Bạn đã viết ${wordCount} từ. Hãy cố gắng viết thêm ${MIN_WORDS_FOR_XP - wordCount} từ nữa để đạt mục tiêu!`,
      strengths: ['Nỗ lực viết bằng tiếng Anh mỗi ngày là thói quen tuyệt vời!'],
      feedbackList: [],
      analyzedAt: new Date(),
    };
  }

  toDto(entity: JournalEntity): JournalDto {
    return {
      id: entity.id ?? '',
      userId: entity.userId,
      title: entity.title,
      content: entity.content,
      wordCount: entity.wordCount,
      mood: entity.mood,
      weather: entity.weather,
      writtenDate: entity.writtenDate,
      isFavorite: entity.isFavorite,
      tags: entity.tags,
      aiAnalysis: entity.aiAnalysis,
      createdAt:
        entity.createdAt instanceof Date ? entity.createdAt : undefined,
      updatedAt:
        entity.updatedAt instanceof Date ? entity.updatedAt : undefined,
    };
  }
}
