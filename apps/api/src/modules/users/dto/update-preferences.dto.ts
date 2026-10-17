import { ApiPropertyOptional } from '@nestjs/swagger';
import type { UpdatePreferencesInput, EnglishLevel } from '@repo/shared';

export class UpdatePreferencesDto implements UpdatePreferencesInput {
  @ApiPropertyOptional({
    enum: ['beginner', 'intermediate', 'advanced'],
    example: 'intermediate',
    description: 'Trình độ tiếng Anh mục tiêu',
  })
  targetLevel?: EnglishLevel;

  @ApiPropertyOptional({
    example: 30,
    description: 'Mục tiêu học mỗi ngày tính bằng phút (5 - 180)',
  })
  dailyGoalMinutes?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Bật/tắt nhắc nhở ôn bài',
  })
  reminderEnabled?: boolean;

  @ApiPropertyOptional({
    example: '20:00',
    description: 'Giờ nhắc nhở ôn tập (HH:mm)',
  })
  reminderTime?: string;
}
