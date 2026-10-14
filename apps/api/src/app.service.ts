import { Injectable } from '@nestjs/common';
import type { ApiResponse } from '@repo/shared';
import { FirestoreService } from './providers/firebase/firestore.service.js';

@Injectable()
export class AppService {
  constructor(private readonly firestoreService: FirestoreService) {}

  getHello(): ApiResponse<{ message: string; timestamp: string }> {
    return {
      success: true,
      data: {
        message: 'English Learning Monorepo API is active!',
        timestamp: new Date().toISOString(),
      },
    };
  }

  async testFirebase(): Promise<ApiResponse<{ message: string; data: Record<string, unknown> }>> {
    const docRef = this.firestoreService.collection('_healthcheck').doc('connection-test');
    await docRef.set({
      message: 'Hello from NestJS backend!',
      connectedAt: this.firestoreService.serverTimestamp(),
    });

    const snapshot = await docRef.get();

    return {
      success: true,
      data: {
        message: 'Kết nối Firebase Firestore thành công!',
        data: (snapshot.data() as Record<string, unknown>) || {},
      },
    };
  }
}
