import { ApiProperty } from '@nestjs/swagger';
import type { AiAutofillWordInput } from '@repo/shared';

export class AiAutofillWordDto implements AiAutofillWordInput {
  @ApiProperty({
    example: 'ephemeral',
    description: 'Từ vựng tiếng Anh cần AI tra cứu tự động',
  })
  word!: string;
}
