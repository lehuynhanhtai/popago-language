import { ApiPropertyOptional } from '@nestjs/swagger';
import type { UpdateProfileInput } from '@repo/shared';

export class UpdateProfileDto implements UpdateProfileInput {
  @ApiPropertyOptional({
    example: 'Nguyễn Văn A',
    description: 'Tên hiển thị của người dùng (2 - 50 ký tự)',
  })
  displayName?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.png',
    description: 'URL ảnh đại diện',
    nullable: true,
  })
  avatarUrl?: string | null;
}
