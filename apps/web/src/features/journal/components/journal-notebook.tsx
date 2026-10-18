"use client";

import { useState, useEffect } from "react";
import {
  FiEdit3,
  FiPlus,
  FiCalendar,
  FiBookOpen,
  FiCheckCircle,
  FiAward,
  FiSun,
  FiCloudRain,
  FiCloud,
  FiSmile,
  FiCoffee,
  FiHeart,
  FiZap,
  FiBookmark,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiMaximize2,
  FiMinimize2,
  FiArrowLeft,
  FiList,
} from "react-icons/fi";
import { Sparkles } from "lucide-react";
import { MOCK_JOURNAL_ENTRIES } from "../mock-data";
import type { MockJournalEntry, JournalMood, JournalWeather } from "../types";

export function JournalNotebook() {
  const [entries, setEntries] = useState<MockJournalEntry[]>(MOCK_JOURNAL_ENTRIES);
  const [selectedEntryId, setSelectedEntryId] = useState<string>("entry-1");
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAiFeedback, setShowAiFeedback] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<"list" | "editor">("editor");

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

  // Form state cho bài đang soạn / đang xem
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newMood, setNewMood] = useState<JournalMood>("happy");
  const [newWeather, setNewWeather] = useState<JournalWeather>("sunny");

  const fallbackEntry: MockJournalEntry = {
    id: "fallback",
    title: "Chưa có bài viết nào",
    content: "Hãy nhấn 'Mở trang viết mới' để bắt đầu viết nhật ký tiếng Anh hôm nay!",
    wordCount: 0,
    mood: "peaceful",
    weather: "sunny",
    writtenDate: new Date().toISOString().slice(0, 10),
    isFavorite: false,
    tags: [],
  };

  const activeEntry: MockJournalEntry =
    entries.find((e) => e.id === selectedEntryId) ?? entries[0] ?? fallbackEntry;

  const handleStartNew = () => {
    setIsCreatingNew(true);
    setNewTitle("");
    setNewContent("");
    setNewMood("happy");
    setNewWeather("sunny");
    setMobileTab("editor");
  };

  const handleSelectEntry = (id: string) => {
    setSelectedEntryId(id);
    setIsCreatingNew(false);
    setMobileTab("editor");
  };

  const handleSaveEntry = () => {
    if (!newTitle.trim() && !newContent.trim()) return;

    const words = newContent.trim().split(/\s+/).filter(Boolean).length;
    const today = new Date().toISOString().slice(0, 10);

    const created: MockJournalEntry = {
      id: `entry-${Date.now()}`,
      title: newTitle.trim() || "A day in my thoughts",
      content: newContent,
      wordCount: words,
      mood: newMood,
      weather: newWeather,
      writtenDate: today,
      isFavorite: false,
      tags: ["daily"],
      aiAnalysis: {
        overallScore: 88,
        cefrEstimate: "B1",
        encouragement: "Tuyệt vời! Bạn đã duy trì thói quen viết tiếng Anh hôm nay. Ngữ pháp tự nhiên và diễn đạt mạch lạc.",
        strengths: ["Cấu trúc câu phong phú", "Từ vựng diễn tả trạng thái cảm xúc tốt"],
        feedbackList: [],
      },
    };

    setEntries([created, ...entries]);
    setSelectedEntryId(created.id);
    setIsCreatingNew(false);
  };

  const filteredEntries = entries.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const notebookElement = (
    /* KHUNG CUỐN SỔ TAY 3D (NOTEBOOK SKEUOMORPHIC CONTAINER) */
    <div className="relative rounded-3xl p-3 sm:p-5 bg-gradient-to-br from-[#68131e] via-[#4d0c14] to-[#2c050a] shadow-2xl shadow-[#200306]/50 border border-[#7e1724]/60 w-full transition-all">
      {/* Đường chỉ may viền bìa sổ (Stitched Leather Border effect) */}
      <div className="absolute inset-2 sm:inset-3 border border-dashed border-white/45 rounded-2xl pointer-events-none" />

      {/* Dải ruy băng Bookmark rủ xuống từ đỉnh sổ */}
      <div className="absolute top-0 right-16 sm:right-28 w-6 h-12 bg-gradient-to-b from-[#e5ab3b] to-[#b88220] shadow-md rounded-b-md z-30 flex items-center justify-center">
        <FiBookmark className="w-3.5 h-3.5 text-amber-950" />
      </div>

      {/* Thanh chuyển đổi Mục Lục / Trang Viết trên Mobile */}
      <div className="lg:hidden relative z-20 flex items-center justify-between p-1.5 mb-3 bg-[#420d14] rounded-2xl border border-white/25 shadow-inner">
        <button
          type="button"
          onClick={() => setMobileTab("list")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-headline font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === "list"
              ? "bg-[#fbf9f4] text-[#2c050a] shadow-sm scale-100"
              : "text-white/80 hover:text-white"
          }`}
        >
          <FiList className="w-3.5 h-3.5" />
          <span>Mục lục ({entries.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-headline font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === "editor"
              ? "bg-[#fbf9f4] text-[#2c050a] shadow-sm scale-100"
              : "text-white/80 hover:text-white"
          }`}
        >
          <FiEdit3 className="w-3.5 h-3.5" />
          <span>{isCreatingNew ? "Viết bài mới" : "Trang viết"}</span>
        </button>
      </div>

      {/* 2 Trang Sổ (Two-Page Spread trên Desktop, 1 Trang lật mượt mà trên Mobile) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[680px] sm:h-[720px] lg:h-[750px] rounded-2xl overflow-hidden shadow-inner bg-[#fbf9f4]">
        {/* ============================================================ */}
        {/* TRANG TRÁI (LEFT PAGE): MỤC LỤC & LỊCH SỬ NHẬT KÝ (Col 1-5) */}
        {/* ============================================================ */}
        <div
          className={`lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#e6dece] bg-[#f7f4ec] p-5 sm:p-6 flex-col justify-between relative h-full ${
            mobileTab === "list" ? "flex" : "hidden lg:flex"
          }`}
        >
            {/* Vân bóng râm gập nếp trang giấy ở mép phải */}
            <div className="hidden lg:block absolute top-0 right-0 w-6 h-full bg-gradient-to-l from-black/5 to-transparent pointer-events-none" />

            <div className="space-y-4">
              {/* Tiêu đề trang mục lục */}
              <div className="flex items-center justify-between border-b-2 border-dashed border-[#ded5c2] pb-3">
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 text-amber-800" />
                  <span className="font-headline font-black text-sm uppercase tracking-wider text-amber-900/90">
                    Mục Lục Nhật Ký
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-800/70 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-200">
                  {entries.length} trang viết
                </span>
              </div>

              {/* Hộp tìm kiếm bài viết cũ */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-2.5 w-4 h-4 text-amber-900/40" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tiêu đề, nội dung..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#ede8dc] border border-[#dcd3c1] text-amber-950 placeholder:text-amber-900/40 focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              {/* Danh sách các bài nhật ký dạng sổ tay */}
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto p-2 custom-scrollbar">
                {filteredEntries.map((item) => {
                  const isSelected = !isCreatingNew && item.id === selectedEntryId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectEntry(item.id)}
                      className={`w-full text-left p-3.5 rounded-[12px] transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-white border-primary shadow-sm ring-1 ring-primary/20 scale-[1.01]"
                          : "bg-[#efe9dd]/70 border-[#ded6c3] hover:bg-white/80 hover:border-[#cfc4ae]"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-amber-900/60 font-semibold mb-1">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          {item.writtenDate}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-100/80 text-amber-900 font-bold">
                          {item.wordCount} từ
                        </span>
                      </div>

                      <h4 className="font-headline font-bold text-sm text-[#2b251e] line-clamp-1">
                        {item.title}
                      </h4>

                      <p className="text-xs text-[#6e6353] line-clamp-2 mt-1 leading-relaxed">
                        {item.content}
                      </p>

                      {/* Score badge nhỏ */}
                      {item.aiAnalysis && (
                        <div className="mt-2.5 flex items-center justify-between text-[11px] pt-1.5 border-t border-[#ede6d6]">
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                            <FiAward className="w-3 h-3" />
                            {item.aiAnalysis.overallScore}/100 điểm
                          </span>
                          <span className="font-headline font-bold text-primary">
                            CEFR {item.aiAnalysis.cefrEstimate}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Thông điệp gợi ý cuối trang trái */}
            <div className="mt-4 pt-3 border-t border-dashed border-[#ded5c2] text-center">
              <p className="text-[11px] text-amber-900/60 italic font-medium">
                💡 &quot;Viết 50 từ mỗi ngày giúp bạn ghi nhớ từ vựng lâu hơn 70%.&quot;
              </p>
            </div>
          </div>

          {/* ============================================================ */}
          {/* TRANG PHẢI (RIGHT PAGE): TRANG GIẤY KẺ DÒNG VIẾT NHẬT KÝ (Col 6-12) */}
          {/* ============================================================ */}
          <div
            className={`lg:col-span-7 bg-[#fbf9f4] p-5 sm:p-8 flex-col justify-between relative h-full overflow-hidden ${
              mobileTab === "editor" ? "flex" : "hidden lg:flex"
            }`}
          >
            {/* Nếp gấp gáy sổ mép trái trang phải */}
            <div className="hidden lg:block absolute top-0 left-0 w-6 h-full bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />

            <div className="space-y-4 flex flex-col flex-1 min-h-0">
              {/* 1. Header Trang Viết: Con dấu ngày tháng + Mood & Weather */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#e8dfcf]">
                <div className="flex items-center gap-2">
                  {/* Nút quay lại mục lục trên Mobile */}
                  <button
                    type="button"
                    onClick={() => setMobileTab("list")}
                    className="lg:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#efe9dc] border border-[#dcd2be] text-amber-950 text-xs font-bold hover:bg-[#e4dac6] transition-colors"
                  >
                    <FiArrowLeft className="w-3.5 h-3.5 text-amber-800" />
                    <span>Mục lục</span>
                  </button>

                  {/* Con tem ngày tháng cổ điển */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#efe9dc] border border-[#dcd2be] text-amber-950 text-xs font-headline font-extrabold shadow-xs">
                    <FiCalendar className="w-3.5 h-3.5 text-amber-800" />
                    <span>
                      {isCreatingNew
                        ? "HÔM NAY • " + new Date().toISOString().slice(0, 10)
                        : activeEntry.writtenDate}
                    </span>
                  </div>
                </div>

                {/* Mood & Weather selectors / badges */}
                <div className="flex items-center gap-2">
                  {isCreatingNew ? (
                    <>
                      {/* Chọn Mood khi tạo mới */}
                      <div className="flex items-center gap-1 bg-[#efe9dc] p-1 rounded-xl border border-[#ded5c2]">
                        <button
                          type="button"
                          onClick={() => setNewMood("happy")}
                          className={`p-1.5 rounded-lg transition-all ${
                            newMood === "happy" ? "bg-amber-400 text-amber-950 shadow-xs" : "text-amber-900/60"
                          }`}
                          title="Vui vẻ"
                        >
                          <FiSmile className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewMood("peaceful")}
                          className={`p-1.5 rounded-lg transition-all ${
                            newMood === "peaceful" ? "bg-amber-400 text-amber-950 shadow-xs" : "text-amber-900/60"
                          }`}
                          title="Bình yên"
                        >
                          <FiCoffee className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewMood("energetic")}
                          className={`p-1.5 rounded-lg transition-all ${
                            newMood === "energetic" ? "bg-amber-400 text-amber-950 shadow-xs" : "text-amber-900/60"
                          }`}
                          title="Tràn đầy năng lượng"
                        >
                          <FiZap className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewMood("grateful")}
                          className={`p-1.5 rounded-lg transition-all ${
                            newMood === "grateful" ? "bg-amber-400 text-amber-950 shadow-xs" : "text-amber-900/60"
                          }`}
                          title="Biết ơn"
                        >
                          <FiHeart className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Chọn Thời tiết */}
                      <div className="flex items-center gap-1 bg-[#efe9dc] p-1 rounded-xl border border-[#ded5c2]">
                        <button
                          type="button"
                          onClick={() => setNewWeather("sunny")}
                          className={`p-1.5 rounded-lg transition-all ${
                            newWeather === "sunny" ? "bg-amber-200 text-amber-950 shadow-xs" : "text-amber-900/60"
                          }`}
                        >
                          <FiSun className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewWeather("rainy")}
                          className={`p-1.5 rounded-lg transition-all ${
                            newWeather === "rainy" ? "bg-blue-200 text-blue-950 shadow-xs" : "text-amber-900/60"
                          }`}
                        >
                          <FiCloudRain className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Hiển thị Mood & Weather của bài đang xem */
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-100/90 text-amber-900 font-bold border border-amber-200/80">
                        <FiSmile className="w-3.5 h-3.5 text-amber-700" />
                        <span>Tâm trạng: {activeEntry.mood}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 font-bold border border-blue-200/80">
                        {activeEntry.weather === "sunny" ? (
                          <FiSun className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <FiCloud className="w-3.5 h-3.5 text-blue-500" />
                        )}
                        <span>{activeEntry.weather}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Tiêu đề bài viết */}
              <div>
                {isCreatingNew ? (
                  <input
                    type="text"
                    placeholder="Tiêu đề trang nhật ký hôm nay..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-headline font-black text-[#2c2215] placeholder:text-amber-900/30 bg-transparent border-b-2 border-[#e4dcce] pb-2 focus:outline-none focus:border-primary transition-colors"
                  />
                ) : (
                  <h2 className="text-xl sm:text-2xl font-headline font-black text-[#2c2215] tracking-tight pb-2 border-b-2 border-[#e4dcce]">
                    {activeEntry.title}
                  </h2>
                )}
              </div>

              {/* 3. NỘI DUNG TRANG GIẤY KẺ DÒNG (LINED NOTEBOOK WRITING CANVAS) */}
              <div className="relative flex-1 min-h-0 flex flex-col">
                {isCreatingNew ? (
                  <textarea
                    placeholder="Bắt đầu viết nhật ký bằng tiếng Anh của bạn ở đây... (ví dụ: What made you happy today? How did you practice English?)"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full flex-1 h-full text-[15px] sm:text-base text-[#2c2215] bg-transparent focus:outline-none resize-none font-medium placeholder:text-amber-900/35 custom-scrollbar p-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, transparent 35px, #e9e0d1 35px 36px)",
                      backgroundSize: "100% 36px",
                      backgroundAttachment: "local",
                      lineHeight: "36px",
                    }}
                  />
                ) : (
                  <div
                    className="text-[15px] sm:text-base text-[#2c2215] font-medium flex-1 overflow-y-auto pr-1.5 custom-scrollbar min-h-0 whitespace-pre-wrap p-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, transparent 35px, #eae2d3 35px 36px)",
                      backgroundSize: "100% 36px",
                      backgroundAttachment: "local",
                      lineHeight: "36px",
                    }}
                  >
                    {activeEntry.content}
                  </div>
                )}
              </div>

              {/* 4. HỘP ĐÁNH GIÁ VÀ GÓP Ý CỦA AI (AI INK CORRECTION OVERLAY) */}
              {!isCreatingNew && activeEntry.aiAnalysis && (
                showAiFeedback ? (
                  <div className="rounded-[16px] p-3.5 sm:p-5 bg-gradient-to-br from-emerald-500/10 via-primary/5 to-purple-500/10 border border-emerald-500/20 shadow-xs space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-[10px] bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-headline font-black text-sm text-[#183a2c] truncate sm:whitespace-normal">
                            Bút Phê Của AI Đồng Hành
                          </h4>
                          <p className="text-[11px] text-[#426456] leading-tight">
                            Đánh giá: <strong>{activeEntry.aiAnalysis.overallScore}/100 điểm</strong> • Trình độ câu: <strong>{activeEntry.aiAnalysis.cefrEstimate}</strong>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAiFeedback(false)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 px-2.5 py-1 rounded-[8px] bg-emerald-100/70 hover:bg-emerald-100 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                        title="Thu gọn nhận xét"
                      >
                        <span>Ẩn bớt</span>
                        <FiChevronUp className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Lời khích lệ */}
                    <p className="text-xs text-[#2c473c] bg-white/70 p-3 rounded-[12px] border border-emerald-200/60 leading-relaxed italic">
                      💬 &quot;{activeEntry.aiAnalysis.encouragement}&quot;
                    </p>

                    {/* Gợi ý sửa câu chi tiết */}
                    {activeEntry.aiAnalysis.feedbackList.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <span className="text-xs font-headline font-bold text-amber-900 block">
                          Các điểm nên trau chuốt để câu tự nhiên hơn:
                        </span>
                        {activeEntry.aiAnalysis.feedbackList.map((fb) => (
                          <div
                            key={fb.id}
                            className="p-3 rounded-[12px] bg-white/90 border border-amber-200/80 text-xs space-y-1.5 shadow-2xs"
                          >
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                              <span className="line-through text-red-600 font-semibold bg-red-50/80 px-2 py-0.5 rounded-[6px] border border-red-100">
                                {fb.originalText}
                              </span>
                              <span className="text-gray-400 text-xs shrink-0">➔</span>
                              <span className="text-emerald-700 font-bold bg-emerald-50/80 px-2 py-0.5 rounded-[6px] border border-emerald-100">
                                {fb.suggestedText}
                              </span>
                            </div>
                            <p className="text-gray-600 text-[11px] leading-relaxed pt-0.5">{fb.explanation}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Trạng thái thu gọn (Collapsed Banner) với nút mở lại */
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-[14px] bg-emerald-500/10 border border-emerald-500/25 shadow-xs transition-all animate-in fade-in duration-200">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-[8px] bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate text-xs">
                        <span className="font-headline font-extrabold text-[#183a2c]">
                          Bút phê AI ({activeEntry.aiAnalysis.overallScore}/100 điểm • CEFR {activeEntry.aiAnalysis.cefrEstimate})
                        </span>
                        {activeEntry.aiAnalysis.feedbackList.length > 0 && (
                          <span className="text-[11px] text-[#426456] hidden sm:inline sm:ml-2">
                            • Có {activeEntry.aiAnalysis.feedbackList.length} gợi ý sửa câu
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAiFeedback(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white px-3.5 py-1.5 rounded-[10px] bg-emerald-600 hover:bg-emerald-700 shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      <span>Xem nhận xét AI</span>
                      <FiChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              )}
            </div>

            {/* 5. Footer Trang Viết: Word Count + Action Buttons */}
            <div className="mt-4 pt-3 border-t border-[#e8dfcf] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
              <div className="text-xs text-amber-900/70 font-semibold flex items-center justify-between sm:justify-start gap-2">
                <span>
                  Số từ:{" "}
                  <strong>
                    {isCreatingNew
                      ? newContent.trim().split(/\s+/).filter(Boolean).length
                      : activeEntry.wordCount}
                  </strong>{" "}
                  từ
                </span>
                <span>•</span>
                <span>Mục tiêu tối thiểu: 50 từ/ngày</span>
              </div>

              {isCreatingNew ? (
                <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsCreatingNew(false)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-[#d6cbba] text-amber-950 font-bold text-xs hover:bg-[#ede5d6] transition-colors text-center"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEntry}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white font-headline font-bold text-xs shadow-md hover:bg-emerald-700 active:scale-95 transition-all whitespace-nowrap"
                  >
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    <span>Lưu & Chấm điểm AI</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleStartNew}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#efe7d8] border border-[#dcd0bc] text-amber-950 font-headline font-bold text-xs hover:bg-[#e6dcc9] transition-all whitespace-nowrap shadow-xs cursor-pointer"
                  >
                    <FiEdit3 className="w-3.5 h-3.5" />
                    <span>Viết bài khác</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Top Header & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-secondary-container/40 text-secondary flex items-center justify-center shadow-xs">
                <FiBookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-headline font-black text-2xl text-on-surface tracking-tight">
                  Cuốn Sổ Nhật Ký Tiếng Anh
                </h1>
                <p className="text-xs text-on-surface-variant font-medium">
                  Ghi lại suy nghĩ mỗi ngày bằng tiếng Anh • Nhận góp ý sửa câu tức thì từ AI
                </p>
              </div>
            </div>
          </div>

          {/* Nút hành động mở trang viết mới & Chế độ tập trung */}
          <div className="flex items-center gap-2.5">
            {/* Nút mở chế độ tập trung toàn màn hình */}
            <button
              type="button"
              onClick={() => setIsFocusMode(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface font-headline font-bold text-xs shadow-xs hover:scale-102 active:scale-98 transition-all cursor-pointer"
              title="Mở chế độ tập trung toàn màn hình (Focus Mode)"
            >
              <FiMaximize2 className="w-3.5 h-3.5 text-primary" />
              <span>Chế độ tập trung</span>
            </button>

            <button
              onClick={handleStartNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-on-primary font-headline font-bold text-sm shadow-md hover:bg-primary-dim hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              <span>Mở trang viết mới</span>
            </button>
          </div>
        </div>

        {/* Khung cuốn sổ bình thường */}
        {!isFocusMode && notebookElement}
      </div>

      {/* MODAL CHẾ ĐỘ TẬP TRUNG (FULLSCREEN FOCUS MODAL WITH BLUR BACKDROP) */}
      {isFocusMode && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-start p-3 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-200"
        >
          {/* Thanh công cụ nổi trên đầu modal */}
          <div className="w-full max-w-6xl flex items-center justify-between mb-4 px-2 py-1">
            <div className="flex items-center gap-2.5 text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-headline font-black text-sm text-emerald-300 uppercase tracking-wider">
                Chế độ tập trung
              </span>
              <span className="text-xs text-white/60 hidden sm:inline">
                • Không gian tĩnh lặng, không xao nhãng để bạn tự do viết tiếng Anh
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsFocusMode(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-headline font-bold border border-white/20 shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <FiMinimize2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Thu nhỏ (Esc)</span>
            </button>
          </div>

          {/* Cuốn sổ nằm ở chính giữa khung modal */}
          <div className="w-full max-w-6xl my-auto animate-in zoom-in-95 duration-200">
            {notebookElement}
          </div>
        </div>
      )}
    </>
  );
}
