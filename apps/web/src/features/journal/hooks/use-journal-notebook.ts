"use client";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { getHttpErrorMessage } from "@/lib/http-client";
import type { JournalDto, JournalMood, JournalWeather } from "../types";
import {
  useJournals,
  useCreateJournal,
  useToggleFavoriteJournal,
  useAnalyzeJournal,
  useDeleteJournal,
} from "./use-journal-queries";

const FALLBACK_ENTRY: JournalDto = {
  id: "empty",
  userId: "",
  title: "Chưa có bài viết nào",
  content: "Hãy nhấn 'Mở trang viết mới' để bắt đầu viết nhật ký tiếng Anh hôm nay!",
  wordCount: 0,
  mood: "peaceful",
  weather: "sunny",
  writtenDate: new Date().toISOString().slice(0, 10),
  isFavorite: false,
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function useJournalNotebook() {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAiFeedback, setShowAiFeedback] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<"list" | "editor">("editor");

  // Mặc định khoảng ngày lọc là 1 tháng gần nhất
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const defaultFromDateStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  }, []);

  const [fromDate, setFromDate] = useState<string>(defaultFromDateStr);
  const [toDate, setToDate] = useState<string>(todayStr);

  // Form state cho bài mới
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newMood, setNewMood] = useState<JournalMood>("happy");
  const [newWeather, setNewWeather] = useState<JournalWeather>("sunny");

  // API Queries & Mutations
  const { data: journalsResult, isLoading, isError, refetch } = useJournals({
    limit: 50,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  });
  const createMutation = useCreateJournal();
  const toggleFavoriteMutation = useToggleFavoriteJournal();
  const analyzeMutation = useAnalyzeJournal();
  const deleteMutation = useDeleteJournal();

  const entries: JournalDto[] = useMemo(
    () => journalsResult?.items ?? [],
    [journalsResult?.items]
  );

  // Tự động chọn entry đầu tiên khi load xong nếu chưa chọn
  useEffect(() => {
    if (entries.length > 0) {
      if (!selectedEntryId || !entries.some((e) => e.id === selectedEntryId)) {
        setSelectedEntryId(entries[0]!.id);
      }
    } else {
      setSelectedEntryId(null);
    }
  }, [entries, selectedEntryId]);

  // Nhấn ESC để thoát chế độ tập trung
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocusMode]);

  const activeEntry: JournalDto = useMemo(() => {
    if (isCreatingNew) return FALLBACK_ENTRY;
    return entries.find((e) => e.id === selectedEntryId) ?? entries[0] ?? FALLBACK_ENTRY;
  }, [isCreatingNew, entries, selectedEntryId]);

  // Tìm kiếm bài viết theo title và content
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const query = searchQuery.toLowerCase();
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        e.content.toLowerCase().includes(query)
    );
  }, [entries, searchQuery]);

  const handleStartNew = () => {
    setIsCreatingNew(true);
    setNewTitle("");
    setNewContent("");
    setNewMood("happy");
    setNewWeather("sunny");
    setMobileTab("editor");
  };

  const handleCancelNew = () => {
    setIsCreatingNew(false);
    if (entries.length > 0 && !selectedEntryId) {
      setSelectedEntryId(entries[0]!.id);
    }
  };

  const handleSelectEntry = (id: string) => {
    setSelectedEntryId(id);
    setIsCreatingNew(false);
    setMobileTab("editor");
    setShowAiFeedback(true);
  };

  const handleSaveEntry = async () => {
    if (!newTitle.trim() && !newContent.trim()) {
      toast.warning("Vui lòng nhập tiêu đề hoặc nội dung bài viết");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const finalTitle = newTitle.trim() || "A day in my thoughts";

    try {
      const res = await createMutation.mutateAsync({
        title: finalTitle,
        content: newContent.trim(),
        mood: newMood,
        weather: newWeather,
        writtenDate: today,
        tags: ["daily"],
        analyzeImmediately: true,
      });

      toast.success("Đã lưu bài viết và AI đã chấm điểm thành công!");
      setIsCreatingNew(false);
      if (res.data?.id) {
        setSelectedEntryId(res.data.id);
      }
    } catch (error) {
      const msg = await getHttpErrorMessage(
        error,
        "Không thể lưu nhật ký, vui lòng thử lại"
      );
      toast.error(msg);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleFavoriteMutation.mutateAsync(id);
      toast.success("Đã cập nhật trạng thái yêu thích");
    } catch (error) {
      const msg = await getHttpErrorMessage(
        error,
        "Không thể cập nhật trạng thái yêu thích"
      );
      toast.error(msg);
    }
  };

  const handleAnalyzeAgain = async (id: string) => {
    try {
      await analyzeMutation.mutateAsync(id);
      toast.success("AI đã chấm lại bài viết thành công!");
    } catch (error) {
      const msg = await getHttpErrorMessage(
        error,
        "Không thể phân tích bài viết lúc này"
      );
      toast.error(msg);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Đã xóa bài nhật ký");
      if (selectedEntryId === id) {
        const remaining = entries.filter((e) => e.id !== id);
        setSelectedEntryId(remaining.length > 0 ? remaining[0]!.id : null);
      }
    } catch (error) {
      const msg = await getHttpErrorMessage(error, "Không thể xóa bài nhật ký");
      toast.error(msg);
    }
  };

  return {
    // Data & state
    entries,
    filteredEntries,
    activeEntry,
    selectedEntryId,
    isCreatingNew,
    searchQuery,
    setSearchQuery,
    showAiFeedback,
    setShowAiFeedback,
    isFocusMode,
    setIsFocusMode,
    mobileTab,
    setMobileTab,

    // Date filter state
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    todayStr,
    handleResetDateFilter: () => {
      setFromDate(defaultFromDateStr);
      setToDate(todayStr);
    },
    handleClearDateFilter: () => {
      setFromDate("");
      setToDate("");
    },

    // Form state
    newTitle,
    setNewTitle,
    newContent,
    setNewContent,
    newMood,
    setNewMood,
    newWeather,
    setNewWeather,

    // Loading & mutation states
    isLoading,
    isError,
    refetch,
    isSaving: createMutation.isPending,
    isTogglingFavorite: toggleFavoriteMutation.isPending,
    isAnalyzing: analyzeMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Handlers
    handleStartNew,
    handleCancelNew,
    handleSelectEntry,
    handleSaveEntry,
    handleToggleFavorite,
    handleAnalyzeAgain,
    handleDeleteEntry,
  };
}
