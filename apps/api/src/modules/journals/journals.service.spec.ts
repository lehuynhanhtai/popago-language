import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { JournalsService } from './journals.service.js';
import { JournalsRepository } from './journals.repository.js';
import { UsersService } from '../users/users.service.js';
import type { JournalEntity } from './entities/journal.entity.js';

const makeEntry = (overrides: Partial<JournalEntity> = {}): JournalEntity => ({
  id: 'entry-1',
  userId: 'uid-abc',
  title: 'My day',
  content: 'Today was a great day and I learned many new English words.',
  wordCount: 11,
  mood: 'happy',
  weather: 'sunny',
  writtenDate: '2026-10-18',
  isFavorite: false,
  tags: ['daily'],
  ...overrides,
});

describe('JournalsService', () => {
  let service: JournalsService;
  let repoMock: Partial<Record<keyof JournalsRepository, any>>;
  let usersMock: Partial<Record<keyof UsersService, any>>;

  beforeEach(() => {
    repoMock = {
      create: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findByUserId: vi.fn(),
      findByUserIdAndDate: vi.fn(),
      searchByUserId: vi.fn(),
    };

    usersMock = {
      findById: vi.fn(),
      updateLoginStreak: vi.fn(),
      updateProfile: vi.fn(),
      updatePreferences: vi.fn(),
    };

    service = new JournalsService(
      repoMock as unknown as JournalsRepository,
      usersMock as unknown as UsersService,
    );
  });

  // ---------------------------------------------------
  // findOne
  // ---------------------------------------------------
  describe('findOne', () => {
    it('trả về JournalDto nếu tìm thấy và đúng owner', async () => {
      const entry = makeEntry();
      repoMock.findById.mockResolvedValue(entry);

      const result = await service.findOne('uid-abc', 'entry-1');

      expect(result.id).toBe('entry-1');
      expect(result.title).toBe('My day');
    });

    it('ném NotFoundException nếu không tìm thấy', async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.findOne('uid-abc', 'not-exist')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('ném ForbiddenException nếu không phải owner', async () => {
      const entry = makeEntry({ userId: 'uid-other' });
      repoMock.findById.mockResolvedValue(entry);

      await expect(service.findOne('uid-abc', 'entry-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  // ---------------------------------------------------
  // create
  // ---------------------------------------------------
  describe('create', () => {
    it('tạo bài nhật ký với wordCount tính tự động', async () => {
      const content = 'Today I visited the park and enjoyed the beautiful weather.';
      const entry = makeEntry({
        content,
        wordCount: content.trim().split(/\s+/).filter(Boolean).length,
      });
      repoMock.create.mockResolvedValue(entry);
      repoMock.update.mockResolvedValue(undefined);
      repoMock.findByUserIdAndDate.mockResolvedValue([entry]);
      usersMock.findById.mockResolvedValue(null);

      const result = await service.create('uid-abc', {
        content,
        mood: 'happy',
        weather: 'sunny',
        analyzeImmediately: false,
      });

      expect(repoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ wordCount: expect.any(Number) }),
      );
      expect(result.wordCount).toBeGreaterThan(0);
    });

    it('dùng writtenDate hôm nay nếu không truyền writtenDate', async () => {
      const today = new Date().toISOString().slice(0, 10);
      const entry = makeEntry({ writtenDate: today });
      repoMock.create.mockResolvedValue(entry);
      repoMock.findByUserIdAndDate.mockResolvedValue([]);
      usersMock.findById.mockResolvedValue(null);

      await service.create('uid-abc', {
        content: 'Hello world today is a good day.',
        mood: 'peaceful',
        weather: 'cloudy',
        analyzeImmediately: false,
      });

      expect(repoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ writtenDate: today }),
      );
    });

    it('gọi update để gán aiAnalysis khi analyzeImmediately = true', async () => {
      const content = 'I went to the gym this morning and felt amazing.';
      const entry = makeEntry({ content });
      repoMock.create.mockResolvedValue(entry);
      repoMock.update.mockResolvedValue(undefined);
      repoMock.findByUserIdAndDate.mockResolvedValue([]);
      usersMock.findById.mockResolvedValue(null);

      const result = await service.create('uid-abc', {
        content,
        mood: 'energetic',
        weather: 'sunny',
        analyzeImmediately: true,
      });

      expect(repoMock.update).toHaveBeenCalledWith(
        entry.id,
        expect.objectContaining({ aiAnalysis: expect.any(Object) }),
      );
      expect(result.aiAnalysis).toBeDefined();
    });
  });

  // ---------------------------------------------------
  // update
  // ---------------------------------------------------
  describe('update', () => {
    it('cập nhật title và mood thành công', async () => {
      const entry = makeEntry();
      repoMock.findById.mockResolvedValue(entry);
      repoMock.update.mockResolvedValue(undefined);

      const result = await service.update('uid-abc', 'entry-1', {
        title: 'Updated Title',
        mood: 'grateful',
      });

      expect(repoMock.update).toHaveBeenCalledWith(
        'entry-1',
        expect.objectContaining({ title: 'Updated Title', mood: 'grateful' }),
      );
      expect(result.title).toBe('Updated Title');
    });

    it('tính lại wordCount khi cập nhật content', async () => {
      const entry = makeEntry();
      repoMock.findById.mockResolvedValue(entry);
      repoMock.update.mockResolvedValue(undefined);

      const newContent = 'Short text.';
      const result = await service.update('uid-abc', 'entry-1', {
        content: newContent,
      });

      expect(result.wordCount).toBe(2);
    });
  });

  // ---------------------------------------------------
  // toggleFavorite
  // ---------------------------------------------------
  describe('toggleFavorite', () => {
    it('chuyển isFavorite từ false sang true', async () => {
      const entry = makeEntry({ isFavorite: false });
      repoMock.findById.mockResolvedValue(entry);
      repoMock.update.mockResolvedValue(undefined);

      const result = await service.toggleFavorite('uid-abc', 'entry-1');

      expect(result.isFavorite).toBe(true);
      expect(repoMock.update).toHaveBeenCalledWith('entry-1', { isFavorite: true });
    });

    it('chuyển isFavorite từ true sang false', async () => {
      const entry = makeEntry({ isFavorite: true });
      repoMock.findById.mockResolvedValue(entry);
      repoMock.update.mockResolvedValue(undefined);

      const result = await service.toggleFavorite('uid-abc', 'entry-1');

      expect(result.isFavorite).toBe(false);
    });
  });

  // ---------------------------------------------------
  // remove
  // ---------------------------------------------------
  describe('remove', () => {
    it('xóa bài viết thành công nếu đúng owner', async () => {
      const entry = makeEntry();
      repoMock.findById.mockResolvedValue(entry);
      repoMock.delete.mockResolvedValue(undefined);

      await expect(service.remove('uid-abc', 'entry-1')).resolves.toBeUndefined();
      expect(repoMock.delete).toHaveBeenCalledWith('entry-1');
    });

    it('ném ForbiddenException nếu không phải owner', async () => {
      const entry = makeEntry({ userId: 'uid-other' });
      repoMock.findById.mockResolvedValue(entry);

      await expect(service.remove('uid-abc', 'entry-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  // ---------------------------------------------------
  // analyze
  // ---------------------------------------------------
  describe('analyze', () => {
    it('tạo aiAnalysis mới cho bài viết', async () => {
      const entry = makeEntry();
      repoMock.findById.mockResolvedValue(entry);
      repoMock.update.mockResolvedValue(undefined);

      const result = await service.analyze('uid-abc', 'entry-1');

      expect(result.aiAnalysis).toBeDefined();
      expect(result.aiAnalysis?.overallScore).toBeTypeOf('number');
      expect(result.aiAnalysis?.cefrEstimate).toMatch(/^(A1|A2|B1|B2|C1)$/);
    });
  });
});
