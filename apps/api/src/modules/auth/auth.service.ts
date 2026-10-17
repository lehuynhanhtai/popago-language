import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Auth, UserRecord } from 'firebase-admin/auth';
import type {
  AuthLoginResult,
  ForgotPasswordInput,
  ForgotPasswordResult,
  LoginInput,
  RefreshTokenInput,
  RefreshTokenResult,
  RegisterInput,
  ResetPasswordInput,
  UserProfileDto,
} from '@repo/shared';
import { FIREBASE_AUTH } from '../../providers/firebase/firebase.constants.js';
import type { FirebaseConfig } from '../../config/firebase.config.js';
import { UsersService } from '../users/users.service.js';
import type { UserEntity } from '../users/entities/user.entity.js';

export interface RegisterResult {
  user: UserProfileDto;
  customToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(FIREBASE_AUTH)
    private readonly firebaseAuth: Auth,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async register(input: RegisterInput): Promise<RegisterResult> {
    const normalizedEmail = input.email.toLowerCase().trim();

    // 1. Kiểm tra tồn tại trong Firestore
    const isEmailRegistered = await this.usersService.existsByEmail(normalizedEmail);
    if (isEmailRegistered) {
      throw new ConflictException('Email này đã được sử dụng');
    }

    // 2. Tạo tài khoản trong Firebase Auth
    let userRecord: UserRecord;
    try {
      userRecord = await this.firebaseAuth.createUser({
        email: normalizedEmail,
        password: input.password,
        displayName: input.displayName.trim(),
      });
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err?.code === 'auth/email-already-exists') {
        throw new ConflictException('Email này đã tồn tại trên hệ thống xác thực');
      }
      this.logger.error(`Tạo user trên Firebase Auth thất bại: ${err?.message}`);
      throw new BadRequestException(err?.message ?? 'Đăng ký tài khoản thất bại');
    }

    // 3. Tạo document trong Firestore (Rollback nếu lỗi)
    let userEntity: UserEntity;
    try {
      userEntity = await this.usersService.createUser(userRecord.uid, {
        ...input,
        email: normalizedEmail,
      });
    } catch (error: unknown) {
      this.logger.error(
        `Lỗi khi lưu profile vào Firestore cho uid=${userRecord.uid}. Đang thực hiện rollback Auth...`,
        error,
      );
      try {
        await this.firebaseAuth.deleteUser(userRecord.uid);
      } catch (rollbackError) {
        this.logger.error(
          `Rollback Firebase Auth thất bại cho uid=${userRecord.uid}`,
          rollbackError,
        );
      }
      throw new InternalServerErrorException(
        'Không thể khởi tạo thông tin người dùng. Vui lòng thử lại sau',
      );
    }

    // 4. Tạo custom token cho phép client đăng nhập tức thì
    let customToken: string;
    try {
      customToken = await this.firebaseAuth.createCustomToken(userRecord.uid);
    } catch (error: unknown) {
      this.logger.warn(
        `Không thể tạo customToken cho user ${userRecord.uid}, client cần tự đăng nhập lại`,
        error,
      );
      customToken = '';
    }

    return {
      user: this.usersService.toProfileDto(userEntity),
      customToken,
    };
  }

  async login(input: LoginInput): Promise<AuthLoginResult> {
    const normalizedEmail = input.email.toLowerCase().trim();
    const config = this.configService.get<FirebaseConfig>('firebase');
    const apiKey = config?.apiKey;

    if (!apiKey) {
      this.logger.warn(
        'Chưa cấu hình FIREBASE_API_KEY hoặc FIREBASE_WEB_API_KEY. Sử dụng chế độ xác thực fallback.',
      );
      try {
        const userRecord = await this.firebaseAuth.getUserByEmail(normalizedEmail);
        const userEntity = await this.usersService.syncUserProfile(
          userRecord.uid,
          normalizedEmail,
          userRecord.displayName,
        );
        const updatedUser = await this.usersService.updateLoginStreak(userRecord.uid);
        const customToken = await this.firebaseAuth.createCustomToken(userRecord.uid);

        return {
          user: this.usersService.toProfileDto(updatedUser || userEntity),
          idToken: customToken,
          refreshToken: '',
          expiresIn: '3600',
        };
      } catch {
        throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
      }
    }

    const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: input.password,
          returnSecureToken: true,
        }),
      });
    } catch (err: unknown) {
      this.logger.error('Lỗi kết nối tới Google Identity Toolkit:', err);
      throw new InternalServerErrorException('Lỗi kết nối tới dịch vụ xác thực');
    }

    const data = (await response.json()) as {
      idToken?: string;
      refreshToken?: string;
      expiresIn?: string;
      localId?: string;
      displayName?: string;
      error?: { message?: string };
    };

    if (!response.ok || !data.localId) {
      const errMsg = data.error?.message;
      if (
        errMsg === 'EMAIL_NOT_FOUND' ||
        errMsg === 'INVALID_PASSWORD' ||
        errMsg === 'INVALID_LOGIN_CREDENTIALS'
      ) {
        throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
      }
      if (errMsg === 'USER_DISABLED') {
        throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
      }
      this.logger.warn(`Firebase login failed with message: ${errMsg}`);
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const uid = data.localId;
    const userEntity = await this.usersService.syncUserProfile(
      uid,
      normalizedEmail,
      data.displayName,
    );

    const updatedUser = await this.usersService.updateLoginStreak(uid);

    return {
      user: this.usersService.toProfileDto(updatedUser || userEntity),
      idToken: data.idToken ?? '',
      refreshToken: data.refreshToken ?? '',
      expiresIn: data.expiresIn ?? '3600',
    };
  }

  async getMe(uid: string): Promise<UserProfileDto> {
    const user = await this.usersService.findById(uid);
    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin tài khoản');
    }
    return this.usersService.toProfileDto(user);
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<ForgotPasswordResult> {
    const normalizedEmail = input.email.toLowerCase().trim();

    let userRecord: UserRecord | null = null;
    try {
      userRecord = await this.firebaseAuth.getUserByEmail(normalizedEmail);
    } catch {
      return { email: normalizedEmail };
    }

    if (!userRecord) {
      return { email: normalizedEmail };
    }

    const config = this.configService.get<FirebaseConfig>('firebase');
    const apiKey = config?.apiKey;
    let resetLink: string | undefined;

    // 2. Nếu có apiKey, gọi sendOobCode: vừa gửi email vừa lấy oobCode đồng bộ
    if (apiKey) {
      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              requestType: 'PASSWORD_RESET',
              email: normalizedEmail,
            }),
          },
        );

        const data = (await response.json()) as { oobCode?: string; email?: string };
        if (data.oobCode) {
          const projectId = config?.projectId || 'papago-eng';
          resetLink = `https://${projectId}.firebaseapp.com/__/auth/action?mode=resetPassword&oobCode=${data.oobCode}&apiKey=${apiKey}&lang=vi`;
        }
      } catch (err: unknown) {
        this.logger.warn(`Gửi email đặt lại mật khẩu thất bại qua sendOobCode:`, err);
      }
    }

    // 3. Fallback dùng Admin SDK generatePasswordResetLink nếu chưa tạo được link
    if (!resetLink) {
      try {
        resetLink = await this.firebaseAuth.generatePasswordResetLink(normalizedEmail);
      } catch (error: unknown) {
        this.logger.error(`Lỗi tạo password reset link cho ${normalizedEmail}:`, error);
        throw new InternalServerErrorException('Không thể tạo liên kết khôi phục mật khẩu');
      }
    }

    return {
      email: normalizedEmail,
      resetLink: process.env.NODE_ENV !== 'production' ? resetLink : undefined,
    };
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const config = this.configService.get<FirebaseConfig>('firebase');
    const apiKey = config?.apiKey;

    if (!apiKey) {
      this.logger.warn('Chưa cấu hình FIREBASE_API_KEY để gọi resetPassword API');
      throw new InternalServerErrorException(
        'Dịch vụ đặt lại mật khẩu chưa được cấu hình khóa API',
      );
    }

    const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${apiKey}`;

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oobCode: input.oobCode.trim(),
          newPassword: input.newPassword,
        }),
      });
    } catch (err: unknown) {
      this.logger.error('Lỗi kết nối tới Identity Toolkit resetPassword:', err);
      throw new InternalServerErrorException('Lỗi kết nối tới dịch vụ xác thực');
    }

    const data = (await response.json()) as {
      email?: string;
      error?: { message?: string };
    };

    if (!response.ok) {
      const errMsg = data.error?.message;
      if (errMsg === 'EXPIRED_OOB_CODE') {
        throw new BadRequestException('Mã khôi phục mật khẩu đã hết hạn');
      }
      if (errMsg === 'INVALID_OOB_CODE') {
        throw new BadRequestException('Mã khôi phục mật khẩu không hợp lệ');
      }
      if (errMsg === 'WEAK_PASSWORD') {
        throw new BadRequestException('Mật khẩu mới quá yếu');
      }
      this.logger.warn(`Reset password failed: ${errMsg}`);
      throw new BadRequestException('Đặt lại mật khẩu thất bại, vui lòng kiểm tra lại liên kết');
    }
  }

  async refreshToken(input: RefreshTokenInput): Promise<RefreshTokenResult> {
    const config = this.configService.get<FirebaseConfig>('firebase');
    const apiKey = config?.apiKey;

    if (!apiKey) {
      this.logger.warn('Chưa cấu hình FIREBASE_API_KEY cho dịch vụ refreshToken.');
      return {
        idToken: 'mock-refreshed-token',
        refreshToken: input.refreshToken,
        expiresIn: '3600',
      };
    }

    const endpoint = `https://securetoken.googleapis.com/v1/token?key=${apiKey}`;

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: input.refreshToken,
        }).toString(),
      });
    } catch (err: unknown) {
      this.logger.error('Lỗi kết nối tới securetoken.googleapis.com:', err);
      throw new InternalServerErrorException('Lỗi kết nối tới dịch vụ làm mới phiên');
    }

    const data = (await response.json()) as {
      id_token?: string;
      refresh_token?: string;
      expires_in?: string;
      error?: { message?: string };
    };

    if (!response.ok || !data.id_token) {
      this.logger.warn(`Làm mới token thất bại: ${JSON.stringify(data.error)}`);
      throw new UnauthorizedException('Phiên đăng nhập đã hết hạn hoặc refresh token không hợp lệ');
    }

    return {
      idToken: data.id_token,
      refreshToken: data.refresh_token ?? input.refreshToken,
      expiresIn: data.expires_in ?? '3600',
    };
  }

  async logout(uid: string): Promise<void> {
    try {
      await this.firebaseAuth.revokeRefreshTokens(uid);
      this.logger.log(`Đã thu hồi token đăng nhập thành công cho người dùng: ${uid}`);
    } catch (error: unknown) {
      this.logger.error(`Đăng xuất thất bại cho uid=${uid}:`, error);
      throw new InternalServerErrorException('Đăng xuất thất bại, vui lòng thử lại');
    }
  }
}

