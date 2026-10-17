"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiLoader } from "react-icons/fi";
import { Flame, Sparkles } from "lucide-react";

interface AuthLoadingOverlayProps {
  isVisible: boolean;
  userName?: string;
  onFinished?: () => void;
}

const LOADING_STEPS = [
  {
    id: 1,
    title: "Xác thực thành công",
    description: "Đã xác nhận danh tính tài khoản",
  },
  {
    id: 2,
    title: "Đồng bộ tiến trình",
    description: "Nạp chuỗi ngày học (Streak) và điểm XP",
  },
  {
    id: 3,
    title: "Sẵn sàng học tập",
    description: "Đang mở không gian Bảng điều khiển PoPaGo",
  },
];

export function AuthLoadingOverlay({
  isVisible,
  userName,
  onFinished,
}: AuthLoadingOverlayProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStepIndex(0);
      setProgress(15);
      return;
    }

    // Sequence mô phỏng nạp data mượt mà
    const t1 = setTimeout(() => {
      setCurrentStepIndex(1);
      setProgress(55);
    }, 450);

    const t2 = setTimeout(() => {
      setCurrentStepIndex(2);
      setProgress(90);
    }, 950);

    const t3 = setTimeout(() => {
      setProgress(100);
      if (onFinished) {
        onFinished();
      }
    }, 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isVisible, onFinished]);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-surface-container-lowest/95 border border-surface-container-high/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-primary/10 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        {/* Glow mascot / brand icon */}
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary/20 via-primary/10 to-secondary/20 flex items-center justify-center shadow-inner relative">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-on-primary font-headline font-black text-2xl shadow-lg shadow-primary/30 animate-pulse">
              P
            </span>
          </div>

          <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-secondary-container text-secondary flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 animate-spin [animation-duration:3s]" />
          </div>

          <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-orange-500/15 text-orange-500 flex items-center justify-center shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-orange-500" />
          </div>
        </div>

        {/* Welcome & Status Message */}
        <div className="space-y-1.5 mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-headline font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            <FiLoader className="w-3.5 h-3.5 animate-spin" />
            Đang tải dữ liệu tài khoản
          </span>
          <h3 className="font-headline font-extrabold text-xl sm:text-2xl text-on-surface">
            {userName ? `Chào mừng trở lại, ${userName}!` : "Đăng nhập thành công!"}
          </h3>
          <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
            Hệ thống đang chuẩn bị tiến trình bài học và dữ liệu thống kê của bạn.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full mb-6">
          <div className="flex justify-between items-center text-xs font-headline font-bold text-on-surface-variant mb-2">
            <span>Tiến trình khởi tạo</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-primary-container to-secondary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps checklist */}
        <div className="w-full space-y-2.5 text-left border-t border-surface-container-high/60 pt-4">
          {LOADING_STEPS.map((step, idx) => {
            const isDone = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={step.id}
                className="flex items-center gap-3 py-1 text-xs transition-opacity duration-200"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isDone
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                      ? "bg-primary/20 text-primary border border-primary/40 animate-pulse"
                      : "bg-surface-container-high text-outline"
                  }`}
                >
                  {isDone ? (
                    <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`font-headline font-bold ${
                      isDone
                        ? "text-on-surface"
                        : isCurrent
                        ? "text-primary"
                        : "text-on-surface-variant/60"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
