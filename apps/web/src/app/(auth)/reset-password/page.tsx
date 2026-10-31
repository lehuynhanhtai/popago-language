import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth";

export const metadata = {
  title: "Đặt lại mật khẩu mới | PoPaGo",
  description: "Thiết lập mật khẩu bảo mật mới cho tài khoản PoPaGo của bạn.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-surface-container-lowest text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-xs text-on-surface-variant font-medium">
            Đang tải dữ liệu xác thực...
          </p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
