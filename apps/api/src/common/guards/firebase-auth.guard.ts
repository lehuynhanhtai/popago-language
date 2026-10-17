import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Auth, DecodedIdToken } from 'firebase-admin/auth';
import type { Request } from 'express';
import { FIREBASE_AUTH } from '../../providers/firebase/firebase.constants.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    @Inject(FIREBASE_AUTH)
    private readonly firebaseAuth: Auth,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization format. Expected "Bearer <token>"');
    }

    try {
      const decodedToken = await this.firebaseAuth.verifyIdToken(token, true);
      (request as unknown as { user: DecodedIdToken }).user = decodedToken;
      return true;
    } catch {
      throw new UnauthorizedException('Token không hợp lệ, đã hết hạn hoặc đã bị thu hồi');
    }
  }
}
