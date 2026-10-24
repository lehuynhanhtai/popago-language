import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CreateDeckInput } from '@repo/shared';

export class CreateDeckDto implements CreateDeckInput {
  @ApiProperty({
    example: 'Từ vựng IELTS Speaking',
    description: 'Tên bộ từ vựng',
  })
  name!: string;

  @ApiPropertyOptional({
    example: 'Bộ từ vựng trọng tâm cho chủ đề Education và Work',
    description: 'Mô tả ngắn gọn về bộ từ vựng',
  })
  description?: string;

  @ApiPropertyOptional({
    example: '#10b981',
    description: 'Mã màu nhận diện bộ từ vựng (HEX code)',
    default: '#10b981',
  })
  themeColor?: string;

  @ApiPropertyOptional({
    example: '📚',
    description: 'Emoji hoặc icon đại diện cho bộ từ',
    default: '📚',
  })
  icon?: string;

  @ApiPropertyOptional({
    example: ['ielts', 'speaking', 'b2'],
    description: 'Danh sách thẻ tag phân loại',
    type: [String],
    default: [],
  })
  tags?: string[];
}
