"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { authService } from "@/features/auth";
import {
  FiGrid,
  FiBookOpen,
  FiLayers,
  FiAward,
  FiMic,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiGift,
  FiFolder,
  FiLoader,
} from "react-icons/fi";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  onCloseMobile?: () => void;
}

export function DashboardSidebar({ onCloseMobile }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const role = user?.role || "student";

  const studentNavItems = [
    { label: "Tổng quan học tập", href: "/dashboard", icon: FiGrid },
    { label: "Nhật ký tiếng anh", href: "/journal", icon: FiBookOpen },
    { label: "Từ vựng", href: "/vocabulary", icon: FiLayers },
  ];

  const adminNavItems = [
    { label: "Thống kê hệ thống", href: "/dashboard", icon: FiBarChart2 },
    { label: "Quản lý người dùng", href: "/users", icon: FiUsers },
    { label: "Kiểm duyệt nội dung", href: "/content", icon: FiFolder },
    { label: "Cấu hình ứng dụng", href: "/settings", icon: FiSettings },
  ];

  const navItems = role === "admin" ? adminNavItems : studentNavItems;

  return (
    <aside className="w-64 h-full flex flex-col justify-between bg-surface-container-lowest border-r border-surface-container-high/80 p-5 select-none">
      {/* Top Header / Logo */}
      <div>
        <Link
          href="/"
          className="flex items-center gap-2.5 pb-6 border-b border-surface-container-high/60 group"
          onClick={onCloseMobile}
        >
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-on-primary font-headline font-black text-xl shadow-md group-hover:scale-105 group-hover:rotate-3 transition-transform">
            P
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-extrabold text-xl tracking-tight text-primary">
              PoPaGo
            </span>
            <span className="text-[10px] font-headline font-bold text-secondary uppercase tracking-widest -mt-1">
              {role === "admin" ? "Admin Portal" : "Playground"}
            </span>
          </div>
        </Link>

        {/* Role identifier badge in sidebar */}
        <div className="mt-4 px-3 py-2 rounded-2xl bg-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full animate-pulse",
                role === "admin" ? "bg-secondary" : "bg-primary"
              )}
            />
            <span className="text-xs font-headline font-bold text-on-surface capitalize">
              {role === "admin" ? "Quản Trị Viên" : "Học Viên"}
            </span>
          </div>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider bg-surface-container-lowest px-2 py-0.5 rounded-full">
            {role === "admin" ? "Admin" : "Free"}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-1.5">
          <p className="px-3 text-[11px] font-headline font-bold text-outline-variant uppercase tracking-wider mb-2">
            Menu chính
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-headline font-semibold text-xs tracking-tight transition-all",
                  isActive
                    ? "bg-primary text-on-primary shadow-xs font-bold"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-on-primary" : "text-outline")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-4 border-t border-surface-container-high/60 space-y-2">
        {role === "student" && (
          <div className="p-3 rounded-2xl bg-secondary-container/30 border border-secondary-container/50">
            <div className="flex items-center gap-2 text-secondary font-headline font-bold text-xs">
              <FiGift className="w-4 h-4 shrink-0" />
              <span>Học tập 100% miễn phí</span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1 leading-snug">
              Sân chơi cộng đồng vì giáo dục mở không rào cản.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={async () => {
            if (isLoggingOut) return;
            try {
              setIsLoggingOut(true);
              await authService.logout();
            } catch (err) {
              console.warn("Logout error:", err);
            } finally {
              clearAuth();
              if (typeof window !== "undefined") {
                localStorage.clear();
                sessionStorage.clear();
              }
              if (onCloseMobile) onCloseMobile();
              router.replace("/login");
            }
          }}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-headline font-semibold text-error hover:bg-error/10 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <FiLoader className="w-4 h-4 shrink-0 animate-spin" />
          ) : (
            <FiLogOut className="w-4 h-4 shrink-0" />
          )}
          <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất tài khoản"}</span>
        </button>
      </div>
    </aside>
  );
}
