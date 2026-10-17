"use client";

import { useProfile } from "../hooks/use-profile";
import { ProfileHeaderCard } from "./profile-header-card";
import { ProfileStatsGrid } from "./profile-stats-grid";
import { ProfilePreferencesForm } from "./profile-preferences-form";
import { ProfileSecurityCard } from "./profile-security-card";
import { RefreshCw } from "lucide-react";

export function ProfileView() {
  const { isLoading, isFetching } = useProfile();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Skeleton Header */}
        <div className="h-44 bg-surface-container-lowest border border-surface-container-high rounded-3xl p-8" />
        {/* Skeleton Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 bg-surface-container-lowest border border-surface-container-high rounded-3xl"
            />
          ))}
        </div>
        {/* Skeleton Preferences */}
        <div className="h-72 bg-surface-container-lowest border border-surface-container-high rounded-3xl p-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative">
      {/* Background Revalidating Indicator */}
      {isFetching && !isLoading && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-highest/90 text-on-surface text-xs font-medium shadow-lg backdrop-blur-md border border-surface-container-high transition-all">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
          <span>Đang đồng bộ dữ liệu mới nhất...</span>
        </div>
      )}

      {/* 1. Header Card (Avatar, Role, Edit Display Name) */}
      <ProfileHeaderCard />

      {/* 2. Gamification & Learning Stats */}
      <ProfileStatsGrid />

      {/* 3. Learning Goals & Preferences */}
      <ProfilePreferencesForm />

      {/* 4. Security & Authentication */}
      <ProfileSecurityCard />
    </div>
  );
}
