import ky, { HTTPError } from "ky";
import type { ApiResponse, RefreshTokenResult } from "@repo/shared";

// Base API URL cấu hình từ môi trường
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Singleton Promise Lock:
 * Đảm bảo khi có nhiều request đồng thời gặp lỗi 401,
 * chỉ DUY NHẤT 1 request refresh-token được gửi đi.
 */
let refreshTokenPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = (async () => {
    try {
      if (typeof window === "undefined") return null;

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) return null;

      // Dùng fetch gốc độc lập để tránh vòng lặp hook
      const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        throw new Error("Refresh token expired or invalid");
      }

      const json = (await res.json()) as ApiResponse<RefreshTokenResult>;
      const data = json?.data;

      if (data?.idToken) {
        localStorage.setItem("access_token", data.idToken);
        if (data.refreshToken) {
          localStorage.setItem("refresh_token", data.refreshToken);
        }

        // Cập nhật useAuthStore nếu có user
        try {
          const { useAuthStore } = await import("@/stores");
          const { setAuthCookies, getAuthCookie, USER_ROLE_COOKIE } = await import("./auth-cookies");
          const currentUser = useAuthStore.getState().user;
          const role = currentUser?.role || getAuthCookie(USER_ROLE_COOKIE) || "student";
          setAuthCookies(data.idToken, role);

          if (currentUser) {
            useAuthStore.getState().setAuth(currentUser, data.idToken);
          }
        } catch {
          // Ignore store sync errors
        }

        return data.idToken;
      }

      return null;
    } catch {
      // Khi refresh token thất bại (hết hạn / bị thu hồi): Xóa session và chuyển về login
      if (typeof window !== "undefined") {
        try {
          const { clearAuthCookies } = await import("./auth-cookies");
          clearAuthCookies();
        } catch {
          // Ignore
        }

        localStorage.clear();
        sessionStorage.clear();

        try {
          const { useAuthStore } = await import("@/stores");
          useAuthStore.getState().clearAuth();
        } catch {
          // Ignore
        }

        if (
          !window.location.pathname.startsWith("/login") &&
          !window.location.pathname.startsWith("/register")
        ) {
          window.location.href = "/login";
        }
      }
      return null;
    } finally {
      refreshTokenPromise = null;
    }
  })();

  return refreshTokenPromise;
}

/**
 * Trích xuất lỗi chi tiết từ Backend trả về
 */
export async function getHttpErrorMessage(
  error: unknown,
  fallbackMessage = "Đã xảy ra lỗi, vui lòng thử lại sau"
): Promise<string> {
  if (typeof error === "object" && error !== null) {
    const anyErr = error as {
      data?: { message?: string | string[]; error?: string; statusCode?: number };
      response?: Response;
      message?: string | string[];
    };

    // 1. Ky v2 tự động parse body lỗi của BE vào property `error.data`
    if (anyErr.data) {
      if (typeof anyErr.data.message === "string" && anyErr.data.message.trim()) {
        return anyErr.data.message;
      }
      if (Array.isArray(anyErr.data.message) && anyErr.data.message.length > 0) {
        return anyErr.data.message.join(", ");
      }
      if (typeof anyErr.data.error === "string" && anyErr.data.error.trim()) {
        return anyErr.data.error;
      }
    }

    // 2. Thử đọc response.json() nếu chưa bị consume
    if (anyErr.response) {
      try {
        const errorBody = (await anyErr.response.json()) as {
          message?: string | string[];
          error?: string;
        };
        if (typeof errorBody?.message === "string" && errorBody.message.trim()) {
          return errorBody.message;
        }
        if (Array.isArray(errorBody?.message) && errorBody.message.length > 0) {
          return errorBody.message.join(", ");
        }
      } catch {
        // Stream đã được Ky đọc vào error.data
      }
    }

    // 3. Nếu message nằm trực tiếp trên error object
    if (typeof anyErr.message === "string" && anyErr.message.trim()) {
      return anyErr.message;
    }
    if (Array.isArray(anyErr.message) && anyErr.message.length > 0) {
      return anyErr.message.join(", ");
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

/**
 * HTTP Client cấu hình sẵn trên nền tảng Ky v2
 */
export const httpClient = ky.create({
  prefix: API_BASE_URL,
  retry: {
    limit: 1,
    methods: ["get"],
    statusCodes: [408, 504],
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("access_token");
          if (token && !request.headers.has("Authorization")) {
            request.headers.set("Authorization", `Bearer ${token}`);
          }
        }
      },
    ],
    afterResponse: [
      async ({ request, options, response, retryCount }) => {
        // Tránh lặp vô hạn với các endpoint xác thực
        const url = request.url;
        if (
          url.includes("/auth/login") ||
          url.includes("/auth/refresh-token") ||
          url.includes("/auth/register")
        ) {
          return response;
        }

        // Tự động Refresh Token khi gặp lỗi 401 và chưa retry lần nào
        if (response.status === 401 && retryCount === 0) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            request.headers.set("Authorization", `Bearer ${newToken}`);
            return ky(request, options);
          }
        }

        return response;
      },
    ],
  },
});
