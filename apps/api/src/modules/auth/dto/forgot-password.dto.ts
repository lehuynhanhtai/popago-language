import { ApiProperty } from '@nestjs/swagger';
import type { ForgotPasswordInput } from '@repo/shared';

export class ForgotPasswordDto implements ForgotPasswordInput {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Địa chỉ email của tài khoản cần đặt lại mật khẩu',
  })
  email!: string;
}
