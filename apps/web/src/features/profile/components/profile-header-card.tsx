"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores";
import { useProfile, useUpdateProfile } from "../hooks/use-profile";
import { toast } from "sonner";
import { getHttpErrorMessage } from "@/lib/http-client";
import { Check, Edit2, Loader2, Shield, User, X } from "lucide-react";

export function ProfileHeaderCard() {
  const { data: profile } = useProfile();
  const user = useAuthStore((s) => s.user);
  const updateProfileMutation = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(
    profile?.displayName || user?.fullName || ""
  );

  useEffect(() => {
    if (profile?.displayName) {
      setDisplayName(profile.displayName);
    } else if (user?.fullName) {
      setDisplayName(user.fullName);
    }
  }, [profile?.displayName, user?.fullName]);

  const role = profile?.role || user?.role || "student";
  const fullName = profile?.displayName || user?.fullName || "Người dùng PoPaGo";
  const email = profile?.email || user?.email || "Chưa cập nhật email";
  const avatarLetter = fullName.charAt(0).toUpperCase();

  const handleSave = async () => {
    if (!displayName.trim() || displayName.trim().length < 2) {
      toast.error("Tên hiển thị phải có ít nhất 2 ký tự");
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        displayName: displayName.trim(),
      });
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (err) {
      const msg = await getHttpErrorMessage(
        err,
        "Không thể cập nhật thông tin"
      );
      toast.error(msg);
    }
  };

  const handleCancel = () => {
    setDisplayName(fullName);
    setIsEditing(false);
  };

  const isSaving = updateProfileMutation.isPending;

  return (
    <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
        {/* Avatar badge */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 rounded-3xl bg-linear-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center font-headline font-black text-3xl shadow-md border-4 border-surface-container-lowest">
            {avatarLetter}
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-xs">
            <span
              className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse"
              title="Tài khoản đang hoạt động"
            />
          </div>
        </div>

        {/* User Info Details */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-center sm:justify-start">
            {isEditing ? (
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="px-3.5 py-1.5 bg-surface-container border border-primary rounded-xl text-base font-headline font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 w-full"
                  placeholder="Nhập họ và tên..."
                  disabled={isSaving}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="p-2 bg-primary text-on-primary rounded-xl hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
                  title="Lưu thay đổi"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="p-2 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-xl transition-all cursor-pointer"
                  title="Hủy"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                <h1 className="font-headline font-black text-2xl sm:text-3xl text-on-surface tracking-tight">
                  {fullName}
                </h1>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                  title="Chỉnh sửa tên hiển thị"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Role Badge */}
            <div>
              {role === "admin" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-headline font-extrabold bg-amber-500/10 text-amber-600 border border-amber-500/30 shadow-xs">
                  <Shield className="w-3.5 h-3.5" />
                  Quản trị viên
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-headline font-bold bg-primary/10 text-primary border border-primary/20 shadow-xs">
                  <User className="w-3.5 h-3.5" />
                  Học viên PoPaGo
                </span>
              )}
            </div>
          </div>

          <p className="text-sm font-medium text-on-surface-variant">{email}</p>

          <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
            <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant/80 font-medium bg-surface-container/60 px-3 py-1 rounded-xl">
              Trạng thái:{" "}
              <span className="font-bold text-emerald-600">Đang hoạt động</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
