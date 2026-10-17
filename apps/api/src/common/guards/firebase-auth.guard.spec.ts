import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Auth } from 'firebase-admin/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FirebaseAuthGuard } from './firebase-auth.guard.js';

describe('FirebaseAuthGuard', () => {
  let guard: FirebaseAuthGuard;
  let authMock: Partial<Auth>;
  let reflector: Reflector;

  beforeEach(() => {
    authMock = {
      verifyIdToken: vi.fn(),
    };
    reflector = new Reflector();
    guard = new FirebaseAuthGuard(authMock as Auth, reflector);
  });

  const createMockContext = (headers: Record<string, string> = {}): ExecutionContext => {
    const request = {
      headers,
      user: undefined,
    };

    return {
      getHandler: vi.fn(),
      getClass: vi.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: vi.fn(),
        getNext: vi.fn(),
      }),
    } as unknown as ExecutionContext;
  };

  it('cho phép truy cập nếu route có đánh dấu @Public', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
    const context = createMockContext();

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('báo lỗi nếu thiếu Authorization header', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    const context = createMockContext({});

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('báo lỗi nếu format Authorization header không hợp lệ', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    const context = createMockContext({ authorization: 'Basic 123456' });

    await expect(guard.canActivate(context)).rejects.toThrow(
      'Invalid Authorization format. Expected "Bearer <token>"',
    );
  });

  it('gắn thông tin user vào request nếu verify token thành công', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    const mockUser = { uid: 'user_123', email: 'test@example.com' };
    (authMock.verifyIdToken as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);

    const context = createMockContext({ authorization: 'Bearer valid_id_token' });
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(authMock.verifyIdToken).toHaveBeenCalledWith('valid_id_token', true);
    const req = context.switchToHttp().getRequest() as { user: typeof mockUser };
    expect(req.user).toEqual(mockUser);
  });

  it('báo lỗi nếu token đã bị thu hồi hoặc không hợp lệ', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    (authMock.verifyIdToken as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('auth/id-token-revoked'),
    );

    const context = createMockContext({ authorization: 'Bearer revoked_token' });
    await expect(guard.canActivate(context)).rejects.toThrow(
      'Token không hợp lệ, đã hết hạn hoặc đã bị thu hồi',
    );
  });
});
