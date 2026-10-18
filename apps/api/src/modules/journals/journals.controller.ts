import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  createJournalSchema,
  updateJournalSchema,
  queryJournalSchema,
} from '@repo/shared';
import type {
  ApiResponse as IApiResponse,
  JournalDto,
  PaginatedResult,
} from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { JournalsService } from './journals.service.js';
import type { CreateJournalDto } from '@repo/shared';
import type { UpdateJournalDto } from '@repo/shared';
import type { QueryJournalDto } from '@repo/shared';

@ApiTags('Journals')
@ApiBearerAuth('firebase-auth')
@Controller('journals')
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách nhật ký của học viên (có filter & phân trang)',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'startAfterId', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'mood', required: false, type: String })
  @ApiQuery({ name: 'isFavorite', required: false, type: Boolean })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách nhật ký thành công',
  })
  async findAll(
    @CurrentUser('uid') uid: string,
    @Query(new ZodValidationPipe(queryJournalSchema)) query: QueryJournalDto,
  ): Promise<IApiResponse<PaginatedResult<JournalDto>>> {
    const result = await this.journalsService.findAll(uid, query);
    return {
      success: true,
      data: result,
      message: 'Lấy danh sách nhật ký thành công',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết 1 bài nhật ký' })
  @ApiParam({ name: 'id', description: 'Journal document ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy chi tiết nhật ký thành công',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Không tìm thấy bài nhật ký' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Không có quyền truy cập' })
  async findOne(
    @CurrentUser('uid') uid: string,
    @Param('id') id: string,
  ): Promise<IApiResponse<JournalDto>> {
    const journal = await this.journalsService.findOne(uid, id);
    return {
      success: true,
      data: journal,
      message: 'Lấy chi tiết nhật ký thành công',
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo bài nhật ký mới (tự động tính wordCount, kích hoạt AI chấm nếu analyzeImmediately = true)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo nhật ký thành công',
  })
  async create(
    @CurrentUser('uid') uid: string,
    @Body(new ZodValidationPipe(createJournalSchema)) dto: CreateJournalDto,
  ): Promise<IApiResponse<JournalDto>> {
    const journal = await this.journalsService.create(uid, dto);
    return {
      success: true,
      data: journal,
      message: 'Tạo nhật ký thành công',
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật bài nhật ký (title, content, mood, weather, tags)' })
  @ApiParam({ name: 'id', description: 'Journal document ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật nhật ký thành công',
  })
  async update(
    @CurrentUser('uid') uid: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateJournalSchema)) dto: UpdateJournalDto,
  ): Promise<IApiResponse<JournalDto>> {
    const journal = await this.journalsService.update(uid, id, dto);
    return {
      success: true,
      data: journal,
      message: 'Cập nhật nhật ký thành công',
    };
  }

  @Patch(':id/favorite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Bật/tắt trạng thái yêu thích của bài nhật ký (bookmark ribbon)',
  })
  @ApiParam({ name: 'id', description: 'Journal document ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật trạng thái yêu thích thành công',
  })
  async toggleFavorite(
    @CurrentUser('uid') uid: string,
    @Param('id') id: string,
  ): Promise<IApiResponse<JournalDto>> {
    const journal = await this.journalsService.toggleFavorite(uid, id);
    return {
      success: true,
      data: journal,
      message: 'Cập nhật trạng thái yêu thích thành công',
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa bài nhật ký' })
  @ApiParam({ name: 'id', description: 'Journal document ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xóa nhật ký thành công',
  })
  async remove(
    @CurrentUser('uid') uid: string,
    @Param('id') id: string,
  ): Promise<IApiResponse<null>> {
    await this.journalsService.remove(uid, id);
    return {
      success: true,
      data: null,
      message: 'Xóa nhật ký thành công',
    };
  }

  @Post(':id/analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Yêu cầu AI phân tích lại bài viết và tạo bút phê mới',
  })
  @ApiParam({ name: 'id', description: 'Journal document ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Phân tích AI thành công',
  })
  async analyze(
    @CurrentUser('uid') uid: string,
    @Param('id') id: string,
  ): Promise<IApiResponse<JournalDto>> {
    const journal = await this.journalsService.analyze(uid, id);
    return {
      success: true,
      data: journal,
      message: 'Phân tích AI thành công',
    };
  }
}
