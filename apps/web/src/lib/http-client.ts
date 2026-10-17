import ky, { HTTPError } from "ky";
import type { ApiResponse } from "@repo/shared";

// Base API URL cấu hình từ môi trường hoặc mặc định localhost:3001
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Trích xuất lỗi chi tiết từ HTTPError hoặc generic Error
 */
export async function getHttpErrorMessage(
  error: unknown,
  fallbackMessage = "Đã xảy ra lỗi, vui lòng thử lại sau"
): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const errorBody = (await error.response.json()) as ApiResponse<unknown> & {
        message?: string | string[];
      };
      if (Array.isArray(errorBody?.message)) {
        return errorBody.message.join(", ");
      }
      return (
        errorBody?.message ||
        errorBody?.error ||
        `Lỗi hệ thống (${error.response.status})`
      );
    } catch {
      return `Lỗi máy chủ (${error.response.status}: ${error.response.statusText})`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

/**
 * HTTP Client cấu hình sẵn trên nền tảng Ky v2
 */
export const httpClient = ky.create({
  prefix: API_BASE_URL,
  timeout: 15000,
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
  },
});
