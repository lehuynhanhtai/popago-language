import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { VocabulariesService } from './vocabularies.service.js';
import { VocabulariesRepository } from './vocabularies.repository.js';
import { DecksService } from '../decks/decks.service.js';
import { DecksRepository } from '../decks/decks.repository.js';
import type { GeminiService } from '../../providers/gemini/index.js';
import type { VocabularyEntity } from './entities/vocabulary.entity.js';

const makeVocab = (overrides: Partial<VocabularyEntity> = {}): VocabularyEntity => ({
  id: 'vocab-1',
  deckId: 'deck-1',
  userId: 'uid-abc',
  word: 'resilient',
  phonetic: '/rɪˈzɪl.i.ənt/',
  partOfSpeech: 'adjective',
  meaningVi: 'Kiên cường, có khả năng phục hồi nhanh',
  definitionEn: 'Able to recover quickly from difficult conditions',
  examples: [
    {
      sentence: 'She is a resilient woman.',
      translationVi: 'Cô ấy là một người phụ nữ kiên cường.',
    },
  ],
  isLearned: false,
  ...overrides,
});

describe('VocabulariesService', () => {
  let service: VocabulariesService;
  let vocabRepoMock: Partial<Record<keyof VocabulariesRepository, any>>;
  let decksServiceMock: Partial<Record<keyof DecksService, any>>;
  let decksRepoMock: Partial<Record<keyof DecksRepository, any>>;
  let geminiServiceMock: Partial<Record<keyof GeminiService, any>>;

  beforeEach(() => {
    vocabRepoMock = {
      create: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findByDeckId: vi.fn(),
      searchInDeck: vi.fn(),
      deleteByDeckId: vi.fn(),
    };

    decksServiceMock = {
      findOne: vi.fn().mockResolvedValue({ id: 'deck-1', userId: 'uid-abc', name: 'Deck' }),
    };

    decksRepoMock = {
      updateWordCounts: vi.fn().mockResolvedValue(undefined),
    };

    geminiServiceMock = {
      autofillWord: vi.fn().mockResolvedValue({
        word: 'ubiquitous',
        phonetic: '/juːˈbɪk.wɪ.təs/',
        partOfSpeech: 'adjective',
        meaningVi: 'Phổ biến, ở đâu cũng có',
        definitionEn: 'Present, appearing, or found everywhere',
        examples: [
          {
            sentence: 'Smartphones are ubiquitous nowadays.',
            translationVi: 'Điện thoại thông minh ngày nay có mặt ở khắp mọi nơi.',
          },
        ],
      }),
    };

    service = new VocabulariesService(
      vocabRepoMock as unknown as VocabulariesRepository,
      decksServiceMock as unknown as DecksService,
      decksRepoMock as unknown as DecksRepository,
      geminiServiceMock as unknown as GeminiService,
    );
  });

  describe('create', () => {
    it('thêm từ mới và tăng word count của deck', async () => {
      const vocab = makeVocab();
      vocabRepoMock.create.mockResolvedValue(vocab);

      const result = await service.create('uid-abc', 'deck-1', {
        word: 'resilient',
        meaningVi: 'Kiên cường',
        partOfSpeech: 'adjective',
        isLearned: false,
      });

      expect(decksServiceMock.findOne).toHaveBeenCalledWith('uid-abc', 'deck-1');
      expect(vocabRepoMock.create).toHaveBeenCalled();
      expect(decksRepoMock.updateWordCounts).toHaveBeenCalledWith('deck-1', 1, 0);
      expect(result.id).toBe('vocab-1');
      expect(result.word).toBe('resilient');
    });

    it('tăng learnedWords count nếu từ mới có isLearned = true', async () => {
      const vocab = makeVocab({ isLearned: true });
      vocabRepoMock.create.mockResolvedValue(vocab);

      await service.create('uid-abc', 'deck-1', {
        word: 'resilient',
        meaningVi: 'Kiên cường',
        isLearned: true,
      });

      expect(decksRepoMock.updateWordCounts).toHaveBeenCalledWith('deck-1', 1, 1);
    });
  });

  describe('toggleLearned', () => {
    it('chuyển từ chưa thuộc sang đã thuộc và tăng learnedWords của deck', async () => {
      const vocab = makeVocab({ isLearned: false });
      vocabRepoMock.findById.mockResolvedValue(vocab);
      vocabRepoMock.update.mockResolvedValue(undefined);

      const result = await service.toggleLearned('uid-abc', 'vocab-1');

      expect(vocabRepoMock.update).toHaveBeenCalledWith('vocab-1', { isLearned: true });
      expect(decksRepoMock.updateWordCounts).toHaveBeenCalledWith('deck-1', 0, 1);
      expect(result.isLearned).toBe(true);
    });

    it('chuyển từ đã thuộc sang chưa thuộc và giảm learnedWords của deck', async () => {
      const vocab = makeVocab({ isLearned: true });
      vocabRepoMock.findById.mockResolvedValue(vocab);
      vocabRepoMock.update.mockResolvedValue(undefined);

      const result = await service.toggleLearned('uid-abc', 'vocab-1');

      expect(vocabRepoMock.update).toHaveBeenCalledWith('vocab-1', { isLearned: false });
      expect(decksRepoMock.updateWordCounts).toHaveBeenCalledWith('deck-1', 0, -1);
      expect(result.isLearned).toBe(false);
    });
  });

  describe('remove', () => {
    it('xóa từ vựng và giảm count của deck', async () => {
      const vocab = makeVocab({ isLearned: true });
      vocabRepoMock.findById.mockResolvedValue(vocab);
      vocabRepoMock.delete.mockResolvedValue(undefined);

      await service.remove('uid-abc', 'vocab-1');

      expect(decksRepoMock.updateWordCounts).toHaveBeenCalledWith('deck-1', -1, -1);
      expect(vocabRepoMock.delete).toHaveBeenCalledWith('vocab-1');
    });

    it('ném ForbiddenException nếu không phải chủ sở hữu', async () => {
      vocabRepoMock.findById.mockResolvedValue(makeVocab({ userId: 'other-user' }));

      await expect(service.remove('uid-abc', 'vocab-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('autofill', () => {
    it('gọi GeminiService để tra cứu chi tiết từ vựng', async () => {
      const result = await service.autofill({ word: 'ubiquitous' });

      expect(geminiServiceMock.autofillWord).toHaveBeenCalledWith('ubiquitous');
      expect(result.word).toBe('ubiquitous');
      expect(result.phonetic).toBe('/juːˈbɪk.wɪ.təs/');
      expect(result.meaningVi).toBe('Phổ biến, ở đâu cũng có');
    });
  });
});
