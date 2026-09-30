import { Controller, Get } from '@nestjs/common';
import type { ApiResponse } from '@repo/shared';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): ApiResponse<{ message: string; timestamp: string }> {
    return this.appService.getHello();
  }
}
