"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores";
import {
  FiLayers,
  FiStar,
  FiClock,
  FiMic,
  FiZap,
  FiArrowRight,
} from "react-icons/fi";
import { Flame } from "lucide-react";
import { StatMetricCard } from "../shared/stat-metric-card";
import { ResumeLearningCard } from "./resume-learning-card";
import { StreakCard } from "./streak-card";
import { DailyQuestsCard } from "./daily-quests-card";

export function StudentDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatMetricCard
          title="Chuỗi học tập"
          value={`${user?.streakDays || 5} Ngày`}
          subtitle="Giữ vững ngọn lửa học mỗi ngày"
          icon={<Flame className="w-6 h-6 text-orange-500 fill-orange-500" />}
          iconBgColor="bg-orange-500/10 text-orange-600"
          badge={{ text: "Đang cháy 🔥", isPositive: true }}
        />

        <StatMetricCard
          title="Từ vựng đã thuộc"
          value={`${user?.wordsLearned || 142} Từ`}
          subtitle="+12 từ mới trong tuần này"
          icon={<FiLayers className="w-6 h-6 text-primary" />}
          iconBgColor="bg-primary/10 text-primary"
          badge={{ text: "+8.5%", isPositive: true }}
        />

        <StatMetricCard
          title="Tổng điểm kinh nghiệm"
          value={`${user?.totalXp || 1250} XP`}
          subtitle="Đang xếp hạng #3 tuần này"
          icon={<FiStar className="w-6 h-6 text-secondary fill-secondary" />}
          iconBgColor="bg-secondary-container/40 text-secondary"
          badge={{ text: "Top 5%", isPositive: true }}
        />

        <StatMetricCard
          title="Mục tiêu hôm nay"
          value="12 / 15 Phút"
          subtitle="Còn 3 phút nữa là đạt chỉ tiêu"
          icon={<FiClock className="w-6 h-6 text-emerald-600" />}
          iconBgColor="bg-emerald-500/10 text-emerald-600"
          badge={{ text: "80%", isPositive: true }}
        />
      </div>

      {/* Main Grid: Left content (2 cols) & Right side widgets (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resume Learning Card */}
          <ResumeLearningCard />

          {/* Quick Learning Zones */}
          <div className="bg-surface-container-lowest/90 border border-surface-container-high/80 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline font-extrabold text-lg text-on-surface">
                  Khu vực luyện tập nhanh
                </h3>
                <p className="text-xs text-on-surface-variant font-medium">
                  Chọn kỹ năng bạn muốn trau dồi hôm nay
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Flashcard Zone */}
              <Link
                href="/flashcards"
                className="group p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-high/60 hover:border-primary/50 hover:bg-surface-container-lowest hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-hero bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FiLayers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                    Flashcard 3D
                  </h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Ôn lại 20 từ vựng gần đây
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-headline font-bold text-primary">
                  <span>Vào ôn ngay</span>
                  <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Pronunciation AI Zone */}
              <Link
                href="/practice"
                className="group p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-high/60 hover:border-secondary/50 hover:bg-surface-container-lowest hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-hero bg-secondary-container/40 text-secondary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FiMic className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-sm text-on-surface group-hover:text-secondary transition-colors">
                    Luyện âm AI
                  </h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Nhận diện chuẩn ngữ điệu & trọng âm
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-headline font-bold text-secondary">
                  <span>Thử thách nói</span>
                  <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Mini game Challenge */}
              <Link
                href="/games"
                className="group p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-high/60 hover:border-emerald-500/50 hover:bg-surface-container-lowest hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-hero bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FiZap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-sm text-on-surface group-hover:text-emerald-600 transition-colors">
                    Game phản xạ
                  </h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Nối từ và đuổi hình bắt chữ
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-headline font-bold text-emerald-600">
                  <span>Chơi & học</span>
                  <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          {/* Streak Card */}
          <StreakCard streakDays={user?.streakDays || 5} />

          {/* Daily Quests Card */}
          <DailyQuestsCard />
        </div>
      </div>
    </div>
  );
}
