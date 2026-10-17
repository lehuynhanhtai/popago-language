"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { authService } from "@/features/auth";
import { toast } from "sonner";
import { getHttpErrorMessage } from "@/lib/http-client";
import { KeyRound, Loader2, LogOut, MailCheck, ShieldCheck } from "lucide-react";

export function ProfileSecurityCard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSendPasswordReset = async () => {
    if (!user?.email) {
      toast.error("Không tìm thấy địa chỉ email");
      return;
    }

    try {
      setIsSendingReset(true);
      await authService.forgotPassword({ email: user.email });
      toast.success(
        `Đã gửi liên kết đặt lại mật khẩu tới ${user.email}. Vui lòng kiểm tra hộp thư!`
      );
    } catch (err) {
      const msg = await getHttpErrorMessage(
        err,
        "Không thể gửi yêu cầu đặt lại mật khẩu"
      );
      toast.error(msg);
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleLogout = async () => {
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
      router.replace("/login");
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-surface-container-high/60">
        <div className="p-2.5 rounded-2xl bg-surface-container text-on-surface">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-headline font-black text-xl text-on-surface">
            Bảo mật & Phiên đăng nhập
          </h2>
          <p className="text-xs text-on-surface-variant">
            Quản lý mật khẩu và quyền riêng tư tài khoản trên Firebase Auth
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Reset Password Row */}
        <div className="p-4 rounded-2xl bg-surface-container/30 border border-surface-container-high/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-surface-container text-on-surface-variant">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <p className="font-headline font-bold text-sm text-on-surface">
                Đổi mật khẩu tài khoản
              </p>
              <p className="text-xs text-on-surface-variant">
                Nhận liên kết an toàn qua email để cập nhật mật khẩu mới
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSendPasswordReset}
            disabled={isSendingReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-headline font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 self-end sm:self-auto"
          >
            {isSendingReset ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <MailCheck className="w-3.5 h-3.5 text-primary" />
            )}
            <span>{isSendingReset ? "Đang gửi..." : "Gửi email đổi mật khẩu"}</span>
          </button>
        </div>

        {/* Logout Row */}
        <div className="p-4 rounded-2xl bg-error/5 border border-error/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-error/10 text-error">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <p className="font-headline font-bold text-sm text-error">
                Đăng xuất tài khoản
              </p>
              <p className="text-xs text-on-surface-variant">
                Xóa phiên làm việc hiện tại và thu hồi token trên thiết bị này
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-error text-white font-headline font-bold text-xs hover:bg-error/90 transition-colors cursor-pointer disabled:opacity-50 self-end sm:self-auto shadow-xs"
          >
            {isLoggingOut ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LogOut className="w-3.5 h-3.5" />
            )}
            <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất ngay"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
