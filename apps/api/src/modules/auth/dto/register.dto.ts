import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { RegisterInput, EnglishLevel } from '@repo/shared';

export class RegisterDto implements RegisterInput {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Địa chỉ email của người dùng',
  })
  email!: string;

  @ApiProperty({
    example: 'Password123@',
    description: 'Mật khẩu tài khoản (tối thiểu 6 ký tự)',
  })
  password!: string;

  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên hiển thị của người dùng',
  })
  displayName!: string;

  @ApiPropertyOptional({
    example: 'beginner',
    enum: ['beginner', 'intermediate', 'advanced'],
    description: 'Trình độ tiếng Anh mục tiêu',
    default: 'beginner',
  })
  targetLevel?: EnglishLevel;

  @ApiPropertyOptional({
    example: 15,
    description: 'Mục tiêu học tập hàng ngày tính theo phút (5 - 120 phút)',
    default: 15,
  })
  dailyGoalMinutes?: number;
}
