import { httpClient } from "@/lib/http-client";
import type {
  ApiResponse,
  CreateJournalInput,
  JournalDto,
  PaginatedResult,
  QueryJournalInput,
  UpdateJournalInput,
} from "@repo/shared";

export const journalService = {
  /**
   * Lấy danh sách nhật ký có bộ lọc và phân trang
   */
  async getJournals(
    params?: QueryJournalInput
  ): Promise<ApiResponse<PaginatedResult<JournalDto>>> {
    const searchParams: Record<string, string | number | boolean> = {};

    if (params) {
      if (params.limit !== undefined) searchParams.limit = params.limit;
      if (params.startAfterId) searchParams.startAfterId = params.startAfterId;
      if (params.search) searchParams.search = params.search;
      if (params.mood) searchParams.mood = params.mood;
      if (params.isFavorite !== undefined) searchParams.isFavorite = params.isFavorite;
      if (params.fromDate) searchParams.fromDate = params.fromDate;
      if (params.toDate) searchParams.toDate = params.toDate;
    }

    return httpClient
      .get("journals", {
        searchParams: Object.keys(searchParams).length > 0 ? searchParams : undefined,
      })
      .json<ApiResponse<PaginatedResult<JournalDto>>>();
  },

  /**
   * Lấy chi tiết một bài viết nhật ký
   */
  async getJournal(id: string): Promise<ApiResponse<JournalDto>> {
    return httpClient.get(`journals/${id}`).json<ApiResponse<JournalDto>>();
  },

  /**
   * Tạo bài nhật ký mới (mặc định analyzeImmediately = true để AI chấm ngay)
   */
  async createJournal(
    payload: CreateJournalInput
  ): Promise<ApiResponse<JournalDto>> {
    return httpClient
      .post("journals", {
        json: {
          analyzeImmediately: true,
          ...payload,
        },
      })
      .json<ApiResponse<JournalDto>>();
  },

  /**
   * Cập nhật thông tin bài nhật ký
   */
  async updateJournal(
    id: string,
    payload: UpdateJournalInput
  ): Promise<ApiResponse<JournalDto>> {
    return httpClient
      .patch(`journals/${id}`, {
        json: payload,
      })
      .json<ApiResponse<JournalDto>>();
  },

  /**
   * Bật/tắt trạng thái yêu thích của bài nhật ký
   */
  async toggleFavorite(id: string): Promise<ApiResponse<JournalDto>> {
    return httpClient
      .patch(`journals/${id}/favorite`)
      .json<ApiResponse<JournalDto>>();
  },

  /**
   * Xóa một bài nhật ký
   */
  async deleteJournal(id: string): Promise<ApiResponse<null>> {
    return httpClient.delete(`journals/${id}`).json<ApiResponse<null>>();
  },

  /**
   * Yêu cầu AI phân tích lại bài viết và cập nhật bút phê
   */
  async analyzeJournal(id: string): Promise<ApiResponse<JournalDto>> {
    return httpClient
      .post(`journals/${id}/analyze`)
      .json<ApiResponse<JournalDto>>();
  },
};
