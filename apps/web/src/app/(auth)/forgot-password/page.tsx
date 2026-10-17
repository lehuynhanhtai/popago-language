import { ForgotPasswordForm } from "@/features/auth";

export const metadata = {
  title: "Quên mật khẩu | PoPaGo",
  description: "Khôi phục mật khẩu tài khoản PoPaGo nhanh chóng và an toàn.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
