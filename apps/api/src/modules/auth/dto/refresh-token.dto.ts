import { ApiProperty } from '@nestjs/swagger';
import type { RefreshTokenInput } from '@repo/shared';

export class RefreshTokenDto implements RefreshTokenInput {
  @ApiProperty({
    example: 'AMf-vBx...',
    description: 'Refresh token nhận được từ lần đăng nhập trước',
  })
  refreshToken!: string;
}
