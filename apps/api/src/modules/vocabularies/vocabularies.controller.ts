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
  createVocabularySchema,
  updateVocabularySchema,
  queryVocabularySchema,
  aiAutofillWordSchema,
} from '@repo/shared';
import type {
  ApiResponse as IApiResponse,
  VocabularyDto,
  PaginatedResult,
  QueryVocabularyDto,
  AiAutofillWordResult,
} from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { VocabulariesService } from './vocabularies.service.js';
import {
  CreateVocabularyDto,
  UpdateVocabularyDto,
  AiAutofillWordDto,
} from './dto/index.js';

@ApiTags('Vocabularies')
@ApiBearerAuth('firebase-auth')
@Controller()
export class VocabulariesController {
  constructor(private readonly vocabulariesService: VocabulariesService) {}

  // -------------------------------------------------------------------
  // 1. Thêm từ vựng vào một bộ từ
  // -------------------------------------------------------------------
  @Post('decks/:deckId/vocabularies')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Thêm thẻ từ vựng mới vào một bộ từ' })
  @ApiParam({ name: 'deckId', description: 'ID của bộ từ vựng' })
  @ApiBody({ type: CreateVocabularyDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Thêm từ vựng thành công',
  })
  async create(
    @CurrentUser('uid') uid: string,
    @Param('deckId') deckId: string,
    @Body(new ZodValidationPipe(createVocabularySchema)) dto: CreateVocabularyDto,
  ): Promise<IApiResponse<VocabularyDto>> {
    const vocab = await this.vocabulariesService.create(uid, deckId, dto);
    return {
      success: true,
      data: vocab,
      message: 'Thêm từ vựng thành công',
    };
  }

  // -------------------------------------------------------------------
  // 2. Lấy danh sách từ vựng trong bộ từ
  // -------------------------------------------------------------------
  @Get('decks/:deckId/vocabularies')
  @ApiOperation({ summary: 'Lấy danh sách các từ vựng trong một bộ từ' })
  @ApiParam({ name: 'deckId', description: 'ID của bộ từ vựng' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'startAfterId', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'isLearned', required: false, type: Boolean })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách từ vựng thành công',
  })
  async findAllByDeck(
    @CurrentUser('uid') uid: string,
    @Param('deckId') deckId: string,
    @Query(new ZodValidationPipe(queryVocabularySchema)) query: QueryVocabularyDto,
  ): Promise<IApiResponse<PaginatedResult<VocabularyDto>>> {
    const result = await this.vocabulariesService.findAllByDeck(uid, deckId, query);
    return {
      success: true,
      data: result,
      message: 'Lấy danh sách từ vựng thành công',
    };
  }

  // -------------------------------------------------------------------
  // 3. AI Autofill thông tin từ vựng
  // -------------------------------------------------------------------
  @Post('vocabularies/ai-autofill')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sử dụng Gemini AI để điền nhanh IPA, nghĩa tiếng Việt và ví dụ' })
  @ApiBody({ type: AiAutofillWordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tra cứu thông tin từ vựng thành công',
  })
  async autofill(
    @Body(new ZodValidationPipe(aiAutofillWordSchema)) dto: AiAutofillWordDto,
  ): Promise<IApiResponse<AiAutofillWordResult>> {
    const result = await this.vocabulariesService.autofill(dto);
    return {
      success: true,
      data: result,
      message: 'Tra cứu thông tin từ vựng thành công',
    };
  }

  // -------------------------------------------------------------------
  // 4. Lấy chi tiết một từ vựng
  // -------------------------------------------------------------------
  @Get('vocabularies/:id')
  @ApiOperation({ summary: 'Lấy chi tiết một thẻ từ vựng' })
  @ApiParam({ name: 'id', description: 'Vocabulary document ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin từ vựng thành công',
  })
  async findOne(
    @CurrentUser('uid') uid: string,
    @Param('id') id: string,
  ): Promise<IApiResponse<VocabularyDto>> {
    const vocab = await this.vocabulariesService.findOne(uid, id);
    return {
      success: true,
      data: vocab,
      message: 'Lấy thông tin từ vựng thành công',
    };
  }

  // -------------------------------------------------------------------
  // 5. Chỉnh sửa một từ vựng
  // -------------------------------------------------------------------
  @Patch('vocabularies/:id')
  @ApiOperation({ summary: 'Chỉnh sửa thông tin thẻ từ vựng' })
  @ApiParam({ name: 'id', description: 'Vocabulary document ID' })
  @ApiBody({ type: UpdateVocabularyDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật từ vựng thành công',
  })
  async update(
    @CurrentUser('uid') uid: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateVocabularySchema)) dto: UpdateVocabularyDto,
  ): Promise<IApiResponse<VocabularyDto>> {
    const vocab = await this.vocabulariesService.update(uid, id, dto);
    return {
      success: true,
      data: vocab,
      message: 'Cập nhật từ vựng thành công',
    };
  }

  // -------------------------------------------------------------------
  // 6. Xóa một từ vựng
  // -------------------------------------------------------------------
  @Delete('vocabularies/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa một thẻ từ vựng khỏi bộ' })
  @ApiParam({ name: 'id', description: 'Vocabulary document ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xóa từ vựng thành công',
  })
  async remove(
    @CurrentUser('uid') uid: string,
    @Param('id') id: string,
  ): Promise<IApiResponse<null>> {
    await this.vocabulariesService.remove(uid, id);
    return {
      success: true,
      data: null,
      message: 'Xóa từ vựng thành công',
    };
  }

  // -------------------------------------------------------------------
  // 7. Đổi trạng thái đã thuộc / chưa thuộc
  // -------------------------------------------------------------------
  @Patch('vocabularies/:id/toggle-learned')
  @ApiOperation({ summary: 'Đánh dấu đã thuộc hoặc chưa thuộc thẻ từ vựng' })
  @ApiParam({ name: 'id', description: 'Vocabulary document ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật trạng thái học thành công',
  })
  async toggleLearned(
    @CurrentUser('uid') uid: string,
    @Param('id') id: string,
  ): Promise<IApiResponse<VocabularyDto>> {
    const vocab = await this.vocabulariesService.toggleLearned(uid, id);
    return {
      success: true,
      data: vocab,
      message: 'Cập nhật trạng thái học thành công',
    };
  }
}
