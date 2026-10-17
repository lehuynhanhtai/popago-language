import { Metadata } from "next";
import { ProfileView } from "@/features/profile";

export const metadata: Metadata = {
  title: "Hồ sơ cá nhân & Cài đặt | PoPaGo",
  description: "Quản lý thông tin tài khoản, chuỗi học tập và tùy chọn học tiếng Anh trên PoPaGo.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
