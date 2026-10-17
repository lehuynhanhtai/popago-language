import { Metadata } from "next";
import {
  ProfileHeaderCard,
  ProfileStatsGrid,
  ProfilePreferencesForm,
  ProfileSecurityCard,
} from "@/features/profile";

export const metadata: Metadata = {
  title: "Hồ sơ cá nhân & Cài đặt | PoPaGo",
  description: "Quản lý thông tin tài khoản, chuỗi học tập và tùy chọn học tiếng Anh trên PoPaGo.",
};

export default function ProfilePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
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
