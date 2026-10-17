import { httpClient } from "@/lib/http-client";
import type {
  ApiResponse,
  AuthLoginResult,
  ForgotPasswordInput,
  ForgotPasswordResult,
  LoginInput,
  RefreshTokenResult,
  RegisterInput,
  ResetPasswordInput,
  UserProfileDto,
} from "@repo/shared";

export const authService = {
  /**
   * Đăng nhập người dùng bằng email và mật khẩu
   */
  async login(payload: LoginInput): Promise<ApiResponse<AuthLoginResult>> {
    return httpClient
      .post("auth/login", {
        json: payload,
      })
      .json<ApiResponse<AuthLoginResult>>();
  },

  /**
   * Đăng ký tài khoản học viên mới
   */
  async register(
    payload: RegisterInput
  ): Promise<ApiResponse<{ user: UserProfileDto; idToken: string }>> {
    return httpClient
      .post("auth/register", {
        json: payload,
      })
      .json<ApiResponse<{ user: UserProfileDto; idToken: string }>>();
  },

  /**
   * Yêu cầu gửi link khôi phục mật khẩu tới email
   */
  async forgotPassword(
    payload: ForgotPasswordInput
  ): Promise<ApiResponse<ForgotPasswordResult>> {
    return httpClient
      .post("auth/forgot-password", {
        json: payload,
      })
      .json<ApiResponse<ForgotPasswordResult>>();
  },

  /**
   * Đặt lại mật khẩu mới bằng mã oobCode từ email
   */
  async resetPassword(
    payload: ResetPasswordInput
  ): Promise<ApiResponse<null>> {
    return httpClient
      .post("auth/reset-password", {
        json: payload,
      })
      .json<ApiResponse<null>>();
  },

  /**
   * Làm mới ID token khi token cũ hết hạn
   */
  async refreshToken(
    refreshToken: string
  ): Promise<ApiResponse<RefreshTokenResult>> {
    return httpClient
      .post("auth/refresh-token", {
        json: { refreshToken },
      })
      .json<ApiResponse<RefreshTokenResult>>();
  },

  /**
   * Cập nhật access token mới sau khi refresh
   */
  updateAccessToken(idToken: string, newRefreshToken?: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", idToken);
      if (newRefreshToken) {
        localStorage.setItem("refresh_token", newRefreshToken);
      }
    }
  },

  /**
   * Lưu trữ token xác thực sau khi đăng nhập thành công
   */
  saveAuthSession(loginResult: AuthLoginResult) {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", loginResult.idToken);
      localStorage.setItem("refresh_token", loginResult.refreshToken);
      localStorage.setItem("user_profile", JSON.stringify(loginResult.user));
    }
  },

  /**
   * Xóa phiên đăng nhập
   */
  clearAuthSession() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_profile");
    }
  },
};
