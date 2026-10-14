import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { DecodedIdToken } from 'firebase-admin/auth';

export type FirebaseUser = DecodedIdToken;

export const CurrentUser = createParamDecorator(
  (data: keyof FirebaseUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as FirebaseUser | undefined;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
