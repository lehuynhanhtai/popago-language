import { Inject, Injectable } from '@nestjs/common';
import type { Firestore, Query, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import {
  BaseFirestoreRepository,
  type PaginatedResult,
} from '../../common/repositories/base.repository.js';
import { FIRESTORE_CLIENT } from '../../providers/firebase/firebase.constants.js';
import type { VocabularyEntity } from './entities/vocabulary.entity.js';
import type { QueryVocabularyDto } from '@repo/shared';

@Injectable()
export class VocabulariesRepository extends BaseFirestoreRepository<VocabularyEntity> {
  constructor(@Inject(FIRESTORE_CLIENT) firestore: Firestore) {
    super(firestore, 'vocabularies');
  }

  async findByDeckId(
    deckId: string,
    options: QueryVocabularyDto = {},
  ): Promise<PaginatedResult<VocabularyEntity>> {
    const { limit = 50, startAfterId, isLearned } = options;
    const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : Number(limit);
    const safeLimit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 50;

    let query: Query = this.collection
      .where('deckId', '==', deckId)
      .orderBy('createdAt', 'desc');

    if (isLearned !== undefined) {
      query = query.where('isLearned', '==', isLearned);
    }

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
    })) as VocabularyEntity[];

    const lastId = resultDocs.length > 0 ? resultDocs[resultDocs.length - 1].id : undefined;

    return {
      items,
      lastId,
      hasMore,
    };
  }

  async searchInDeck(
    deckId: string,
    search: string,
    limit = 50,
  ): Promise<VocabularyEntity[]> {
    const snapshot = await this.collection
      .where('deckId', '==', deckId)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const lowerSearch = search.toLowerCase();
    const matches: VocabularyEntity[] = [];

    for (const doc of snapshot.docs) {
      const data = doc.data() as Omit<VocabularyEntity, 'id'>;
      const wordMatch = data.word?.toLowerCase().includes(lowerSearch);
      const meaningMatch = data.meaningVi?.toLowerCase().includes(lowerSearch);

      if (wordMatch || meaningMatch) {
        matches.push({ id: doc.id, ...data });
        if (matches.length >= limit) break;
      }
    }

    return matches;
  }

  async deleteByDeckId(deckId: string): Promise<number> {
    const snapshot = await this.collection.where('deckId', '==', deckId).get();
    if (snapshot.empty) return 0;

    const batch = this.firestore.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    return snapshot.size;
  }
}
