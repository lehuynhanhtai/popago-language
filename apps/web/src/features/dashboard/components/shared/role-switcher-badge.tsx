"use client";

import { useAuthStore } from "@/stores";
import { FiUserCheck, FiShield } from "react-icons/fi";

export function RoleSwitcherBadge() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role || "student";

  if (role === "admin") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 border border-secondary/20 rounded-2xl text-secondary font-headline font-bold text-xs shadow-2xs">
        <FiShield className="w-3.5 h-3.5" />
        <span>Quản trị viên</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-2xl border border-surface-container-high/80 text-on-surface font-headline font-bold text-xs shadow-2xs">
      <FiUserCheck className="w-3.5 h-3.5 text-primary" />
      <span>Học viên</span>
    </div>
  );
}
