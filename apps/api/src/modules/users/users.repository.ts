import { Inject, Injectable } from '@nestjs/common';
import type { Firestore } from 'firebase-admin/firestore';
import { BaseFirestoreRepository } from '../../common/repositories/base.repository.js';
import { FIRESTORE_CLIENT } from '../../providers/firebase/firebase.constants.js';
import type { UserEntity } from './entities/user.entity.js';

@Injectable()
export class UsersRepository extends BaseFirestoreRepository<UserEntity> {
  constructor(@Inject(FIRESTORE_CLIENT) firestore: Firestore) {
    super(firestore, 'users');
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const snapshot = await this.collection
      .where('email', '==', email.toLowerCase().trim())
      .limit(1)
      .get();

    if (snapshot.empty || !snapshot.docs[0]) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as UserEntity;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }
}
