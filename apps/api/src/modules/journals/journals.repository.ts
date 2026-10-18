import { Inject, Injectable } from '@nestjs/common';
import type { Firestore, Query, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import {
  BaseFirestoreRepository,
  type PaginatedResult,
} from '../../common/repositories/base.repository.js';
import { FIRESTORE_CLIENT } from '../../providers/firebase/firebase.constants.js';
import type { JournalEntity } from './entities/journal.entity.js';
import type { QueryJournalDto } from '@repo/shared';

@Injectable()
export class JournalsRepository extends BaseFirestoreRepository<JournalEntity> {
  constructor(@Inject(FIRESTORE_CLIENT) firestore: Firestore) {
    super(firestore, 'journals');
  }

  async findByUserId(
    userId: string,
    options: QueryJournalDto = {},
  ): Promise<PaginatedResult<JournalEntity>> {
    const { limit = 20, startAfterId, mood, isFavorite, fromDate, toDate } = options;
    const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : Number(limit);
    const safeLimit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 20;

    let query: Query = this.collection
      .where('userId', '==', userId)
      .orderBy('writtenDate', 'desc')
      .orderBy('createdAt', 'desc');

    if (mood) {
      query = query.where('mood', '==', mood);
    }

    if (isFavorite !== undefined) {
      query = query.where('isFavorite', '==', isFavorite);
    }

    if (fromDate) {
      query = query.where('writtenDate', '>=', fromDate);
    }

    if (toDate) {
      query = query.where('writtenDate', '<=', toDate);
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
    })) as JournalEntity[];

    const lastDoc = resultDocs[resultDocs.length - 1];

    return {
      items,
      lastId: lastDoc ? lastDoc.id : undefined,
      hasMore,
    };
  }

  async findByUserIdAndDate(
    userId: string,
    writtenDate: string,
  ): Promise<JournalEntity[]> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('writtenDate', '==', writtenDate)
      .get();

    return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
    })) as JournalEntity[];
  }

  async searchByUserId(
    userId: string,
    search: string,
    limit = 20,
  ): Promise<JournalEntity[]> {
    // Firestore không hỗ trợ full-text search tự nhiên.
    // Lấy tối đa 200 doc mới nhất và lọc client-side.
    // Nếu scale lớn hơn, có thể tích hợp Algolia hoặc Meilisearch sau.
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .orderBy('writtenDate', 'desc')
      .limit(200)
      .get();

    const lowerSearch = search.toLowerCase();

    const matched = snapshot.docs
      .filter((doc) => {
        const data = doc.data();
        return (
          String(data['title'] ?? '').toLowerCase().includes(lowerSearch) ||
          String(data['content'] ?? '').toLowerCase().includes(lowerSearch)
        );
      })
      .slice(0, limit);

    return matched.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
    })) as JournalEntity[];
  }
}
