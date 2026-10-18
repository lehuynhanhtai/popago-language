import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import type { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, metadata?: ArgumentMetadata) {
    // Chỉ bỏ qua các custom decorator (như @CurrentUser)
    if (metadata?.type === 'custom') {
      return value;
    }

    const result = this.schema.safeParse(value);
    if (!result.success) {
      const issues = result.error.issues.map((issue) => {
        const path = issue.path.join('.');
        return path ? `${path}: ${issue.message}` : issue.message;
      });

      throw new BadRequestException({
        message: 'Dữ liệu không hợp lệ',
        errors: issues,
      });
    }
    return result.data;
  }
}
