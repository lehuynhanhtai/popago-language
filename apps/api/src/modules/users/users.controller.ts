import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  updateProfileSchema,
  updatePreferencesSchema,
} from '@repo/shared';
import type {
  ApiResponse as IApiResponse,
  UserProfileDto,
} from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { UsersService } from './users.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UpdatePreferencesDto } from './dto/update-preferences.dto.js';

@ApiTags('Users')
@ApiBearerAuth('firebase-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Lấy thông tin hồ sơ của người dùng hiện tại',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin hồ sơ thành công',
  })
  async getProfile(
    @CurrentUser('uid') uid: string,
  ): Promise<IApiResponse<UserProfileDto>> {
    const user = await this.usersService.findById(uid);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      success: true,
      data: this.usersService.toProfileDto(user),
      message: 'Lấy thông tin hồ sơ thành công',
    };
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật thông tin cá nhân (tên hiển thị, avatar)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật thông tin cá nhân thành công',
  })
  async updateProfile(
    @CurrentUser('uid') uid: string,
    @Body(new ZodValidationPipe(updateProfileSchema)) dto: UpdateProfileDto,
  ): Promise<IApiResponse<UserProfileDto>> {
    const updatedUser = await this.usersService.updateProfile(uid, dto);
    return {
      success: true,
      data: this.usersService.toProfileDto(updatedUser),
      message: 'Cập nhật thông tin cá nhân thành công',
    };
  }

  @Patch('preferences')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật cài đặt học tập (level mục tiêu, thời gian học, nhắc nhở)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật cài đặt học tập thành công',
  })
  async updatePreferences(
    @CurrentUser('uid') uid: string,
    @Body(new ZodValidationPipe(updatePreferencesSchema)) dto: UpdatePreferencesDto,
  ): Promise<IApiResponse<UserProfileDto>> {
    const updatedUser = await this.usersService.updatePreferences(uid, dto);
    return {
      success: true,
      data: this.usersService.toProfileDto(updatedUser),
      message: 'Cập nhật cài đặt học tập thành công',
    };
  }
}
