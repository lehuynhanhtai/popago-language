import { Inject, Injectable } from '@nestjs/common';
import {
  Firestore,
  CollectionReference,
  DocumentReference,
  FieldValue,
  Timestamp,
  WriteBatch,
  Transaction,
} from 'firebase-admin/firestore';
import { FIRESTORE_CLIENT } from './firebase.constants.js';

@Injectable()
export class FirestoreService {
  constructor(
    @Inject(FIRESTORE_CLIENT)
    private readonly firestore: Firestore,
  ) {}

  get db(): Firestore {
    return this.firestore;
  }

  collection(collectionPath: string): CollectionReference {
    return this.firestore.collection(collectionPath);
  }

  doc(documentPath: string): DocumentReference {
    return this.firestore.doc(documentPath);
  }

  serverTimestamp(): FieldValue {
    return FieldValue.serverTimestamp();
  }

  toTimestamp(date: Date): Timestamp {
    return Timestamp.fromDate(date);
  }

  batch(): WriteBatch {
    return this.firestore.batch();
  }

  runTransaction<T>(
    updateFunction: (transaction: Transaction) => Promise<T>,
  ): Promise<T> {
    return this.firestore.runTransaction(updateFunction);
  }
}
