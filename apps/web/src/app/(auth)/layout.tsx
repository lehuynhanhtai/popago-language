import { ReactNode } from "react";
import Link from "next/link";
import { FiArrowLeft, FiGift, FiShield } from "react-icons/fi";

export const metadata = {
  title: "Xác thực tài khoản | PoPaGo Language",
  description: "Đăng nhập và tham gia cộng đồng học tiếng Anh vui nhộn, miễn phí PoPaGo.",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-surface selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-primary/10 via-primary-container/10 to-transparent blur-3xl pointer-events-none -z-10 rounded-pill" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-secondary-container/20 blur-3xl pointer-events-none -z-10 rounded-pill" />

      {/* Auth Navbar */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          title="Về trang chủ PoPaGo"
        >
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-on-primary font-headline font-black text-xl shadow-md group-hover:scale-105 group-hover:rotate-3 transition-transform">
            P
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-extrabold text-2xl tracking-tight text-primary">
              PoPaGo
            </span>
            <span className="text-[10px] font-headline font-bold text-secondary uppercase tracking-widest -mt-1">
              English Playground
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill text-[11px] font-bold bg-secondary-container text-on-secondary-container ml-2">
            <FiGift className="text-xs" />
            100% Miễn phí
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-headline font-semibold text-on-surface-variant hover:text-primary transition-colors py-2 px-3 rounded-pill hover:bg-surface-container"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full flex justify-center">{children}</div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 border-t border-surface-container-high/60 flex flex-col sm:flex-row items-center justify-between text-xs text-on-surface-variant gap-3">
        <div className="flex items-center gap-1.5 font-medium">
          <FiShield className="text-primary w-3.5 h-3.5" />
          <span>Bảo mật an toàn bởi PoPaGo Identity</span>
        </div>
        <p>© {new Date().getFullYear()} PoPaGo. Nền tảng học tiếng Anh miễn phí vì cộng đồng.</p>
      </footer>
    </div>
  );
}
