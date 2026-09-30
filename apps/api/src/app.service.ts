import { Injectable } from '@nestjs/common';
import type { ApiResponse } from '@repo/shared';

@Injectable()
export class AppService {
  getHello(): ApiResponse<{ message: string; timestamp: string }> {
    return {
      success: true,
      data: {
        message: 'English Learning Monorepo API is active!',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
