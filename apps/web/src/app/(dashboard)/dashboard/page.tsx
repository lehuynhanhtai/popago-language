"use client";

import { useAuthStore } from "@/stores";
import { StudentDashboard, AdminDashboard } from "@/features/dashboard";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  return <StudentDashboard />;
}
