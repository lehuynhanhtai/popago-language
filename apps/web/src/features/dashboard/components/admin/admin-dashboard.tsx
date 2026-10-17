"use client";

import { SystemMetricsGrid } from "./system-metrics-grid";
import { RecentActivities } from "./recent-activities";
import { FiTrendingUp, FiDownload } from "react-icons/fi";

export function AdminDashboard() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Admin Header action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest/80 border border-surface-container-high/80 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
            <span className="text-xs font-headline font-bold text-secondary uppercase tracking-widest">
              Admin Analytics
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-headline font-black text-on-surface mt-1">
            Báo Cáo Tăng Trưởng & Chỉ Số Toàn Sàn
          </h2>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
            Dữ liệu tổng hợp tình hình hoạt động, phân bổ học viên và tương tác theo thời gian thực.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-surface-container-high bg-surface-container-lowest hover:bg-surface-container font-headline font-bold text-xs text-on-surface transition-all shadow-xs"
          >
            <FiDownload className="w-4 h-4" />
            <span>Xuất báo cáo</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-secondary text-on-secondary font-headline font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <FiTrendingUp className="w-4 h-4" />
            <span>Xem xu hướng tháng</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <SystemMetricsGrid />

      {/* Realtime activities & Level distribution */}
      <RecentActivities />
    </div>
  );
}
