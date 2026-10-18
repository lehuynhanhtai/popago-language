import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { journalService } from "../services/journal-service";
import type {
  CreateJournalInput,
  JournalDto,
  QueryJournalInput,
  UpdateJournalInput,
} from "@repo/shared";

export const journalKeys = {
  all: ["journals"] as const,
  lists: () => [...journalKeys.all, "list"] as const,
  list: (params?: QueryJournalInput) => [...journalKeys.lists(), params] as const,
  details: () => [...journalKeys.all, "detail"] as const,
  detail: (id: string) => [...journalKeys.details(), id] as const,
};

/**
 * Hook lấy danh sách bài nhật ký có bộ lọc và phân trang
 */
export function useJournals(params?: QueryJournalInput) {
  return useQuery({
    queryKey: journalKeys.list(params),
    queryFn: async () => {
      const res = await journalService.getJournals(params);
      return res.data;
    },
    staleTime: 1000 * 60 * 2, // 2 phút
  });
}

/**
 * Hook lấy chi tiết một bài viết nhật ký
 */
export function useJournal(id?: string) {
  return useQuery({
    queryKey: id ? journalKeys.detail(id) : ["journals", "detail", "empty"],
    queryFn: async () => {
      if (!id) return null;
      const res = await journalService.getJournal(id);
      return res.data;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook tạo bài nhật ký mới kèm kích hoạt AI chấm
 */
export function useCreateJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateJournalInput) =>
      journalService.createJournal(payload),
    onSuccess: (res) => {
      if (res.data) {
        queryClient.setQueryData<JournalDto>(
          journalKeys.detail(res.data.id),
          res.data
        );
      }
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
    },
  });
}

/**
 * Hook cập nhật nội dung bài nhật ký
 */
export function useUpdateJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateJournalInput }) =>
      journalService.updateJournal(id, payload),
    onSuccess: (res, variables) => {
      if (res.data) {
        queryClient.setQueryData<JournalDto>(
          journalKeys.detail(variables.id),
          res.data
        );
      }
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
    },
  });
}

/**
 * Hook bật/tắt yêu thích (Bookmark)
 */
export function useToggleFavoriteJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => journalService.toggleFavorite(id),
    onSuccess: (res, id) => {
      if (res.data) {
        queryClient.setQueryData<JournalDto>(journalKeys.detail(id), res.data);
      }
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
    },
  });
}

/**
 * Hook xóa bài nhật ký
 */
export function useDeleteJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => journalService.deleteJournal(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: journalKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
    },
  });
}

/**
 * Hook yêu cầu AI phân tích lại bài viết
 */
export function useAnalyzeJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => journalService.analyzeJournal(id),
    onSuccess: (res, id) => {
      if (res.data) {
        queryClient.setQueryData<JournalDto>(journalKeys.detail(id), res.data);
      }
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
    },
  });
}
