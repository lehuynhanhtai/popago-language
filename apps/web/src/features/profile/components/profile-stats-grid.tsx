"use client";

import { useAuthStore } from "@/stores";
import { BookOpen, Flame, Layers, Star } from "lucide-react";

export function ProfileStatsGrid() {
  const user = useAuthStore((s) => s.user);

  const stats = [
    {
      id: "streak",
      label: "Chuỗi ngày học liên tục",
      value: `${user?.streakDays ?? 0} ngày`,
      desc: "Giữ lửa hàng ngày để nhận quà Streak!",
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    {
      id: "xp",
      label: "Tổng điểm kinh nghiệm",
      value: `${user?.totalXp ?? 0} XP`,
      desc: "Điểm kinh nghiệm tích lũy từ các bài học",
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      id: "words",
      label: "Từ vựng đã ghi nhớ",
      value: `${user?.wordsLearned ?? 0} từ`,
      desc: "Học qua Flashcard và bài tập tương tác",
      icon: Layers,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      id: "lessons",
      label: "Bài học đã hoàn thành",
      value: "12 bài",
      desc: "Lộ trình bài giảng theo khung chuẩn quốc tế",
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-headline font-extrabold text-lg text-on-surface">
          Thành tích học tập
        </h2>
        <span className="text-xs font-medium text-on-surface-variant">
          Cập nhật tự động theo thời gian thực
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container-high/80 hover:border-surface-container-highest transition-all shadow-xs flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-headline font-semibold text-on-surface-variant">
                  {item.label}
                </span>
                <div
                  className={`p-2.5 rounded-2xl ${item.bg} ${item.color} ${item.border} border group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <p className="font-headline font-black text-2xl text-on-surface tracking-tight">
                  {item.value}
                </p>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
