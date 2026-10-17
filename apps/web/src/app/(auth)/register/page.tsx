import { RegisterForm } from "@/features/auth";

export const metadata = {
  title: "Đăng ký tài khoản miễn phí | PoPaGo",
  description: "Tạo tài khoản học tiếng Anh miễn phí 100% cùng PoPaGo với lộ trình cá nhân hóa.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
