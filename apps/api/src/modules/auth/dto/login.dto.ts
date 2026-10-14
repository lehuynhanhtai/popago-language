import { ApiProperty } from '@nestjs/swagger';
import type { LoginInput } from '@repo/shared';

export class LoginDto implements LoginInput {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Địa chỉ email của người dùng',
  })
  email!: string;

  @ApiProperty({
    example: 'Password123@',
    description: 'Mật khẩu tài khoản',
  })
  password!: string;
}
