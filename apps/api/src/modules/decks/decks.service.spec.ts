import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DecksService } from './decks.service.js';
import { DecksRepository } from './decks.repository.js';
import type { DeckEntity } from './entities/deck.entity.js';

const makeDeck = (overrides: Partial<DeckEntity> = {}): DeckEntity => ({
  id: 'deck-1',
  userId: 'uid-abc',
  name: 'IELTS Vocabulary',
  description: 'Common words for IELTS',
  themeColor: '#10b981',
  icon: '📚',
  tags: ['ielts'],
  totalWords: 5,
  learnedWords: 2,
  ...overrides,
});

describe('DecksService', () => {
  let service: DecksService;
  let repoMock: Partial<Record<keyof DecksRepository, any>>;

  beforeEach(() => {
    repoMock = {
      create: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findByUserId: vi.fn(),
      searchByUserId: vi.fn(),
      findByName: vi.fn(),
      updateWordCounts: vi.fn(),
    };

    service = new DecksService(repoMock as unknown as DecksRepository);
  });

  describe('create', () => {
    it('tạo bộ từ vựng mới thành công', async () => {
      repoMock.findByName.mockResolvedValue(null);
      const created = makeDeck();
      repoMock.create.mockResolvedValue(created);

      const result = await service.create('uid-abc', {
        name: 'IELTS Vocabulary',
        description: 'Common words for IELTS',
        themeColor: '#10b981',
        icon: '📚',
        tags: ['ielts'],
      });

      expect(repoMock.findByName).toHaveBeenCalledWith('uid-abc', 'IELTS Vocabulary');
      expect(repoMock.create).toHaveBeenCalled();
      expect(result.id).toBe('deck-1');
      expect(result.name).toBe('IELTS Vocabulary');
    });

    it('ném BadRequestException nếu tên bộ từ đã tồn tại', async () => {
      repoMock.findByName.mockResolvedValue(makeDeck());

      await expect(
        service.create('uid-abc', { name: 'IELTS Vocabulary' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('trả về DeckDto nếu tìm thấy và đúng chủ sở hữu', async () => {
      repoMock.findById.mockResolvedValue(makeDeck());

      const result = await service.findOne('uid-abc', 'deck-1');
      expect(result.id).toBe('deck-1');
      expect(result.totalWords).toBe(5);
    });

    it('ném NotFoundException nếu không tìm thấy bộ từ', async () => {
      repoMock.findById.mockResolvedValue(null);

      await expect(service.findOne('uid-abc', 'not-exist')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('ném ForbiddenException nếu không phải chủ sở hữu', async () => {
      repoMock.findById.mockResolvedValue(makeDeck({ userId: 'uid-other' }));

      await expect(service.findOne('uid-abc', 'deck-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('cập nhật thông tin bộ từ thành công', async () => {
      const deck = makeDeck();
      repoMock.findById
        .mockResolvedValueOnce(deck)
        .mockResolvedValueOnce({ ...deck, name: 'New Name', themeColor: '#3b82f6' });
      repoMock.findByName.mockResolvedValue(null);
      repoMock.update.mockResolvedValue(undefined);

      const result = await service.update('uid-abc', 'deck-1', {
        name: 'New Name',
        themeColor: '#3b82f6',
      });

      expect(repoMock.update).toHaveBeenCalledWith(
        'deck-1',
        expect.objectContaining({ name: 'New Name', themeColor: '#3b82f6' }),
      );
      expect(result.themeColor).toBe('#3b82f6');
    });
  });

  describe('remove', () => {
    it('xóa bộ từ thành công nếu đúng chủ sở hữu', async () => {
      repoMock.findById.mockResolvedValue(makeDeck());
      repoMock.delete.mockResolvedValue(undefined);

      await expect(service.remove('uid-abc', 'deck-1')).resolves.toBeUndefined();
      expect(repoMock.delete).toHaveBeenCalledWith('deck-1');
    });
  });
});
