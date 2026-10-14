import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '@repo/shared';
import type {
  ApiResponse as IApiResponse,
  AuthLoginResult,
  ForgotPasswordResult,
  UserProfileDto,
} from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { AuthService, type RegisterResult } from './auth.service.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(registerSchema))
  @ApiOperation({
    summary: 'Đăng ký tài khoản người dùng mới',
    description:
      'Tạo tài khoản học viên trong Firebase Authentication và khởi tạo hồ sơ người dùng trong Firestore collection `users`.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Đăng ký tài khoản thành công',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email đã tồn tại trong hệ thống',
  })
  async register(@Body() registerDto: RegisterDto): Promise<IApiResponse<RegisterResult>> {
    const result = await this.authService.register(registerDto);
    return {
      success: true,
      data: result,
      message: 'Đăng ký tài khoản thành công',
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(loginSchema))
  @ApiOperation({
    summary: 'Đăng nhập người dùng bằng email và mật khẩu',
    description:
      'Xác thực thông tin tài khoản qua Firebase Auth, cập nhật chuỗi học tập (streak) và trả về token cùng thông tin học viên.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đăng nhập thành công',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Email hoặc mật khẩu không chính xác',
  })
  async login(@Body() loginDto: LoginDto): Promise<IApiResponse<AuthLoginResult>> {
    const result = await this.authService.login(loginDto);
    return {
      success: true,
      data: result,
      message: 'Đăng nhập thành công',
    };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(forgotPasswordSchema))
  @ApiOperation({
    summary: 'Yêu cầu liên kết đặt lại mật khẩu',
    description:
      'Gửi liên kết khôi phục mật khẩu tới email người dùng thông qua dịch vụ Firebase Authentication.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Yêu cầu được tiếp nhận và xử lý',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Địa chỉ email không hợp lệ',
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<IApiResponse<ForgotPasswordResult>> {
    const result = await this.authService.forgotPassword(forgotPasswordDto);
    return {
      success: true,
      data: result,
      message:
        'Nếu email tồn tại trên hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi đến hòm thư của bạn.',
    };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(resetPasswordSchema))
  @ApiOperation({
    summary: 'Đặt lại mật khẩu mới',
    description:
      'Sử dụng mã oobCode từ email và mật khẩu mới để cập nhật thông tin đăng nhập.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đặt lại mật khẩu thành công',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Mã xác thực không hợp lệ hoặc mật khẩu không đáp ứng tiêu chuẩn',
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<IApiResponse<null>> {
    await this.authService.resetPassword(resetPasswordDto);
    return {
      success: true,
      data: null,
      message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới.',
    };
  }

  @Get('me')
  @ApiBearerAuth('firebase-auth')
  @ApiOperation({
    summary: 'Lấy thông tin tài khoản học viên hiện tại',
    description: 'Trích xuất UID từ Firebase ID Token và trả về thông tin hồ sơ học viên.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thông tin thành công',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token không hợp lệ hoặc đã hết hạn',
  })
  async getMe(@CurrentUser('uid') uid: string): Promise<IApiResponse<UserProfileDto>> {
    const user = await this.authService.getMe(uid);
    return {
      success: true,
      data: user,
      message: 'Lấy thông tin người dùng thành công',
    };
  }
}
