"use client";

import { useAuthStore } from "@/stores";
import { FiMenu, FiBell, FiStar } from "react-icons/fi";
import { Flame } from "lucide-react";
import { RoleSwitcherBadge } from "../shared/role-switcher-badge";

interface DashboardTopbarProps {
  onOpenMobileMenu: () => void;
}

export function DashboardTopbar({ onOpenMobileMenu }: DashboardTopbarProps) {
  const user = useAuthStore((s) => s.user);
  const role = user?.role || "student";

  return (
    <header className="h-20 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-surface-container-high/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-all">
      {/* Mobile Toggle & Left Greeting */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-2xl text-on-surface hover:bg-surface-container transition-colors"
          aria-label="Mở menu"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <p className="text-xs font-headline font-semibold text-on-surface-variant">
            Xin chào trở lại,
          </p>
          <h2 className="text-base font-headline font-bold text-on-surface -mt-0.5">
            {user?.fullName || "Bạn của PoPaGo"} 👋
          </h2>
        </div>
      </div>

      {/* Right widgets: Gamification & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Role Switcher preview button */}
        <div className="hidden md:block">
          <RoleSwitcherBadge />
        </div>

        {/* Gamification widgets for student */}
        {role === "student" && (
          <div className="flex items-center gap-2">
            {/* Streak Widget */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 font-headline font-extrabold text-xs shadow-xs"
              title="Chuỗi ngày học liên tiếp (Streak)"
            >
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
              <span>{user?.streakDays || 5} ngày</span>
            </div>

            {/* XP Widget */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-secondary-container/40 border border-secondary-container text-secondary font-headline font-extrabold text-xs shadow-xs"
              title="Tổng điểm kinh nghiệm XP"
            >
              <FiStar className="w-4 h-4 fill-secondary-fixed text-secondary-fixed-dim" />
              <span>{user?.totalXp || 1250} XP</span>
            </div>
          </div>
        )}

        {/* Notifications */}
        <button
          type="button"
          className="p-2.5 rounded-2xl border border-surface-container-high bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant transition-colors relative"
          aria-label="Thông báo"
        >
          <FiBell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-error absolute top-2 right-2 ring-2 ring-surface-container-lowest" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-surface-container-high/60">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-headline font-extrabold text-sm shadow-xs">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "P"}
          </div>
        </div>
      </div>
    </header>
  );
}
