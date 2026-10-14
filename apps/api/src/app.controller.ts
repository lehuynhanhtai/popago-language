import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse as SwaggerApiResponse, ApiTags } from '@nestjs/swagger';
import type { ApiResponse } from '@repo/shared';
import { AppService } from './app.service.js';

import { Public } from './common/decorators/public.decorator.js';

@ApiTags('Health & General')
@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Kiểm tra trạng thái máy chủ API' })
  @SwaggerApiResponse({ status: 200, description: 'API đang hoạt động bình thường' })
  getHello(): ApiResponse<{ message: string; timestamp: string }> {
    return this.appService.getHello();
  }

  @Get('firebase-test')
  @ApiOperation({ summary: 'Kiểm tra kết nối và ghi/đọc dữ liệu Firestore' })
  @SwaggerApiResponse({ status: 200, description: 'Kết nối Firebase Firestore thành công' })
  async testFirebase(): Promise<ApiResponse<{ message: string; data: Record<string, unknown> }>> {
    return this.appService.testFirebase();
  }
}
