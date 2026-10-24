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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  createDeckSchema,
  updateDeckSchema,
  queryDeckSchema,
} from '@repo/shared';
import type {
  ApiResponse as IApiResponse,
  DeckDto,
  PaginatedResult,
  QueryDeckDto,
} from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { DecksService } from './decks.service.js';
import { CreateDeckDto, UpdateDeckDto } from './dto/index.js';

@ApiTags('Vocabulary Decks')
@ApiBearerAuth('firebase-auth')
@Controller('decks')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo bộ từ vựng mới theo chủ đề' })
  @ApiBody({ type: CreateDeckDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo bộ từ vựng thành công',
  })
  async create(
    @CurrentUser('uid') uid: string,
    @Body(new ZodValidationPipe(createDeckSchema)) dto: CreateDeckDto,
  ): Promise<IApiResponse<DeckDto>> {
    const deck = await this.decksService.create(uid, dto);
    return {
      success: true,
      data: deck,
      message: 'Tạo bộ từ vựng thành công',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách các bộ từ vựng của học viên' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'startAfterId', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách bộ từ thành công',
  })
  async findAll(
    @CurrentUser('uid') uid: string,
    @Query(new ZodValidationPipe(queryDeckSchema)) query: QueryDeckDto,
  ): Promise<IApiResponse<PaginatedResult<DeckDto>>> {
    const result = await this.decksService.findAll(uid, query);
    return {
      success: true,
      data: result,
      message: 'Lấy danh sách bộ từ thành công',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một bộ từ vựng' })
  @ApiParam({ name: 'id', description: 'Deck document ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin bộ từ thành công',
  })
  async findOne(
    @CurrentUser('uid') uid: string,
    @Param('id') id: string,
  ): Promise<IApiResponse<DeckDto>> {
    const deck = await this.decksService.findOne(uid, id);
    return {
      success: true,
      data: deck,
      message: 'Lấy thông tin bộ từ thành công',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin bộ từ vựng' })
  @ApiParam({ name: 'id', description: 'Deck document ID' })
  @ApiBody({ type: UpdateDeckDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật bộ từ thành công',
  })
  async update(
    @CurrentUser('uid') uid: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateDeckSchema)) dto: UpdateDeckDto,
  ): Promise<IApiResponse<DeckDto>> {
    const deck = await this.decksService.update(uid, id, dto);
    return {
      success: true,
      data: deck,
      message: 'Cập nhật bộ từ thành công',
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa một bộ từ vựng' })
  @ApiParam({ name: 'id', description: 'Deck document ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xóa bộ từ thành công',
  })
  async remove(
    @CurrentUser('uid') uid: string,
    @Param('id') id: string,
  ): Promise<IApiResponse<null>> {
    await this.decksService.remove(uid, id);
    return {
      success: true,
      data: null,
      message: 'Xóa bộ từ thành công',
    };
  }
}
