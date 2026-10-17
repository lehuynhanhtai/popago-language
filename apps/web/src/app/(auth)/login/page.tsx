import { Suspense } from "react";
import { LoginForm } from "@/features/auth";

export const metadata = {
  title: "Đăng nhập | PoPaGo",
  description: "Đăng nhập tài khoản PoPaGo để tiếp tục học tập và duy trì streak hàng ngày.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
