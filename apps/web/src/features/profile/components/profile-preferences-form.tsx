"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores";
import { useProfile, useUpdatePreferences } from "../hooks/use-profile";
import { toast } from "sonner";
import { getHttpErrorMessage } from "@/lib/http-client";
import { Bell, Check, Clock, Loader2, Sparkles, Target } from "lucide-react";
import type { EnglishLevel } from "@repo/shared";

export function ProfilePreferencesForm() {
  const { data: profile } = useProfile();
  const user = useAuthStore((s) => s.user);
  const updatePreferencesMutation = useUpdatePreferences();

  const [targetLevel, setTargetLevel] = useState<EnglishLevel>(
    profile?.preferences?.targetLevel || user?.targetLevel || "beginner"
  );
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(
    profile?.preferences?.dailyGoalMinutes ?? user?.dailyGoalMinutes ?? 15
  );
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(
    profile?.preferences?.reminderEnabled ?? user?.reminderEnabled ?? false
  );
  const [reminderTime, setReminderTime] = useState<string>(
    profile?.preferences?.reminderTime ?? user?.reminderTime ?? "20:00"
  );

  useEffect(() => {
    const prefs = profile?.preferences;
    if (prefs) {
      if (prefs.targetLevel) setTargetLevel(prefs.targetLevel);
      if (prefs.dailyGoalMinutes !== undefined)
        setDailyGoalMinutes(prefs.dailyGoalMinutes);
      if (prefs.reminderEnabled !== undefined)
        setReminderEnabled(prefs.reminderEnabled);
      if (prefs.reminderTime) setReminderTime(prefs.reminderTime);
    } else if (user) {
      if (user.targetLevel) setTargetLevel(user.targetLevel);
      if (user.dailyGoalMinutes !== undefined)
        setDailyGoalMinutes(user.dailyGoalMinutes);
      if (user.reminderEnabled !== undefined)
        setReminderEnabled(user.reminderEnabled);
      if (user.reminderTime) setReminderTime(user.reminderTime);
    }
  }, [profile?.preferences, user]);

  const levels: {
    id: EnglishLevel;
    title: string;
    sub: string;
    desc: string;
  }[] = [
    {
      id: "beginner",
      title: "Mới bắt đầu",
      sub: "Level A1 - A2",
      desc: "Luyện phát âm chuẩn, từ vựng nền tảng và phản xạ cơ bản.",
    },
    {
      id: "intermediate",
      title: "Trung cấp",
      sub: "Level B1 - B2",
      desc: "Nâng cao từ vựng chuyên sâu, giao tiếp linh hoạt tự nhiên.",
    },
    {
      id: "advanced",
      title: "Nâng cao",
      sub: "Level C1 - C2",
      desc: "Thuyết trình chuyên nghiệp, phản xạ tức thì, tư duy tiếng Anh.",
    },
  ];

  const goals = [15, 30, 45, 60];

  const handleSave = async () => {
    try {
      await updatePreferencesMutation.mutateAsync({
        targetLevel,
        dailyGoalMinutes,
        reminderEnabled,
        reminderTime: reminderEnabled ? reminderTime : undefined,
      });
      toast.success("Đã cập nhật tùy chọn học tập thành công!");
    } catch (err) {
      const msg = await getHttpErrorMessage(
        err,
        "Không thể lưu tùy chọn học tập"
      );
      toast.error(msg);
    }
  };

  const isSaving = updatePreferencesMutation.isPending;

  return (
    <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-surface-container-high/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-headline font-black text-xl text-on-surface">
              Mục tiêu & Kế hoạch học tập
            </h2>
            <p className="text-xs text-on-surface-variant">
              Tùy chỉnh lộ trình bài giảng và thuật toán gợi ý từ vựng theo nhu cầu
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-on-primary font-headline font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          <span>{isSaving ? "Đang lưu..." : "Lưu thay đổi"}</span>
        </button>
      </div>

      {/* Target Level Selection */}
      <div className="space-y-3">
        <label className="text-xs font-headline font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Trình độ tiếng Anh mục tiêu
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {levels.map((lvl) => {
            const isSelected = targetLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setTargetLevel(lvl.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-primary/5 border-primary ring-2 ring-primary/20 shadow-xs"
                    : "bg-surface-container/40 border-surface-container-high hover:border-surface-container-highest"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-headline font-extrabold text-sm text-on-surface">
                      {lvl.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isSelected
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {lvl.sub}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {lvl.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Goal Minutes */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-headline font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-secondary" />
          Mục tiêu thời gian học mỗi ngày
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {goals.map((minutes) => {
            const isSelected = dailyGoalMinutes === minutes;
            return (
              <button
                key={minutes}
                type="button"
                onClick={() => setDailyGoalMinutes(minutes)}
                className={`py-3 px-4 rounded-2xl border font-headline font-bold text-sm transition-all text-center cursor-pointer ${
                  isSelected
                    ? "bg-secondary text-on-secondary border-secondary shadow-xs"
                    : "bg-surface-container/40 text-on-surface border-surface-container-high hover:border-surface-container-highest"
                }`}
              >
                {minutes} phút / ngày
              </button>
            );
          })}
        </div>
      </div>

      {/* Reminder Notification */}
      <div className="p-4 rounded-2xl bg-surface-container/30 border border-surface-container-high/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-surface-container text-on-surface-variant">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <p className="font-headline font-bold text-sm text-on-surface">
              Nhắc nhở học tập hàng ngày
            </p>
            <p className="text-xs text-on-surface-variant">
              Gửi thông báo nhắc nhở để giữ vững chuỗi học tập Streak
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {reminderEnabled && (
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="px-3 py-1.5 bg-surface-container border border-surface-container-high rounded-xl text-xs font-bold font-headline text-on-surface focus:outline-none focus:border-primary"
            />
          )}

          <button
            type="button"
            onClick={() => setReminderEnabled(!reminderEnabled)}
            className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer flex items-center ${
              reminderEnabled
                ? "bg-primary justify-end"
                : "bg-surface-container-high justify-start"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}
