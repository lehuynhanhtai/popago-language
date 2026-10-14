import { describe, it, expect } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from './zod-validation.pipe.js';

describe('ZodValidationPipe', () => {
  const schema = z.object({
    name: z.string().min(2),
    age: z.number().min(18),
  });

  const pipe = new ZodValidationPipe(schema);

  it('trả về dữ liệu hợp lệ khi parse thành công', () => {
    const validData = { name: 'Alice', age: 25 };
    expect(pipe.transform(validData)).toEqual(validData);
  });

  it('ném BadRequestException khi dữ liệu không hợp lệ', () => {
    const invalidData = { name: 'A', age: 10 };
    expect(() => pipe.transform(invalidData)).toThrow(BadRequestException);
  });
});
