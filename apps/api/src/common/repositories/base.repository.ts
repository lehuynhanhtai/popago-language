import {
  FieldValue,
  Firestore,
  CollectionReference,
  Query,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

export interface FirestoreTimestampLike {
  seconds: number;
  nanoseconds: number;
  toDate?: () => Date;
}

export interface BaseEntity {
  id?: string;
  createdAt?: Date | FirestoreTimestampLike;
  updatedAt?: Date | FirestoreTimestampLike;
}

export interface PaginationOptions {
  limit?: number;
  startAfterId?: string;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  lastId?: string;
  hasMore: boolean;
}

export abstract class BaseFirestoreRepository<T extends BaseEntity> {
  protected constructor(
    protected readonly firestore: Firestore,
    protected readonly collectionName: string,
  ) {}

  protected get collection(): CollectionReference {
    return this.firestore.collection(this.collectionName);
  }

  async findById(id: string): Promise<T | null> {
    const docRef = this.collection.doc(id);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as T;
  }

  async create(data: Omit<T, 'id'>, customId?: string): Promise<T> {
    const docRef = customId ? this.collection.doc(customId) : this.collection.doc();
    const payload = {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await docRef.set(payload);

    return {
      id: docRef.id,
      ...data,
    } as unknown as T;
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = this.collection.doc(id);
    await docRef.update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  async findAll(limitCount = 100): Promise<T[]> {
    const snapshot = await this.collection.limit(limitCount).get();
    return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  }

  async findPaginated(options: PaginationOptions = {}): Promise<PaginatedResult<T>> {
    const {
      limit = 20,
      startAfterId,
      orderByField = 'createdAt',
      orderDirection = 'desc',
    } = options;

    let query: Query = this.collection.orderBy(orderByField, orderDirection);

    if (startAfterId) {
      const startAfterDoc = await this.collection.doc(startAfterId).get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
    }

    const snapshot = await query.limit(limit + 1).get();
    const docs = snapshot.docs;
    const hasMore = docs.length > limit;
    const resultDocs = hasMore ? docs.slice(0, limit) : docs;

    const items = resultDocs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];

    const lastDoc = resultDocs[resultDocs.length - 1];

    return {
      items,
      lastId: lastDoc ? lastDoc.id : undefined,
      hasMore,
    };
  }
}
