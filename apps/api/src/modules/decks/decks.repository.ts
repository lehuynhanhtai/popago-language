import { Inject, Injectable } from '@nestjs/common';
import { FieldValue } from 'firebase-admin/firestore';
import type { Firestore, Query, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import {
  BaseFirestoreRepository,
  type PaginatedResult,
} from '../../common/repositories/base.repository.js';
import { FIRESTORE_CLIENT } from '../../providers/firebase/firebase.constants.js';
import type { DeckEntity } from './entities/deck.entity.js';
import type { QueryDeckDto } from '@repo/shared';

@Injectable()
export class DecksRepository extends BaseFirestoreRepository<DeckEntity> {
  constructor(@Inject(FIRESTORE_CLIENT) firestore: Firestore) {
    super(firestore, 'decks');
  }

  async findByUserId(
    userId: string,
    options: QueryDeckDto = {},
  ): Promise<PaginatedResult<DeckEntity>> {
    const { limit = 50, startAfterId } = options;
    const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : Number(limit);
    const safeLimit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 50;

    let query: Query = this.collection
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc');

    if (startAfterId) {
      const startAfterDoc = await this.collection.doc(startAfterId).get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
    }

    const snapshot = await query.limit(safeLimit + 1).get();
    const docs = snapshot.docs;
    const hasMore = docs.length > safeLimit;
    const resultDocs = hasMore ? docs.slice(0, safeLimit) : docs;

    const items = resultDocs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
    })) as DeckEntity[];

    const lastId = resultDocs.length > 0 ? resultDocs[resultDocs.length - 1].id : undefined;

    return {
      items,
      lastId,
      hasMore,
    };
  }

  async searchByUserId(
    userId: string,
    search: string,
    limit = 50,
  ): Promise<DeckEntity[]> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const lowerSearch = search.toLowerCase();
    const matches: DeckEntity[] = [];

    for (const doc of snapshot.docs) {
      const data = doc.data() as Omit<DeckEntity, 'id'>;
      const nameMatch = data.name?.toLowerCase().includes(lowerSearch);
      const descMatch = data.description?.toLowerCase().includes(lowerSearch);
      const tagMatch = data.tags?.some((t) => t.toLowerCase().includes(lowerSearch));

      if (nameMatch || descMatch || tagMatch) {
        matches.push({ id: doc.id, ...data });
        if (matches.length >= limit) break;
      }
    }

    return matches;
  }

  async findByName(userId: string, name: string): Promise<DeckEntity | null> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('name', '==', name.trim())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as DeckEntity;
  }

  async updateWordCounts(
    id: string,
    totalWordsDelta: number,
    learnedWordsDelta: number,
  ): Promise<void> {
    const updates: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (totalWordsDelta !== 0) {
      updates.totalWords = FieldValue.increment(totalWordsDelta);
    }
    if (learnedWordsDelta !== 0) {
      updates.learnedWords = FieldValue.increment(learnedWordsDelta);
    }

    await this.collection.doc(id).update(updates);
  }
}
