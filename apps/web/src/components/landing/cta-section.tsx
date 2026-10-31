import Link from "next/link";
import { FiArrowRight, FiCheck } from "react-icons/fi";

export function CtaSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-gradient-to-br from-primary via-primary to-primary-hover text-on-primary p-10 sm:p-16 lg:p-20 rounded-3xl text-center relative overflow-hidden shadow-2xl">
        {/* Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-pill -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-container/20 rounded-pill translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-pill text-xs font-headline font-bold uppercase tracking-wider bg-secondary-container text-on-secondary-container">
            🎁 100% Miễn Phí Vì Cộng Đồng
          </span>

          <h2 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-black text-on-primary tracking-tight leading-tight">
            Sẵn sàng biến tiếng Anh thành <span className="underline decoration-secondary-container decoration-wavy">sân chơi</span> của bạn?
          </h2>

          <p className="text-base sm:text-lg text-on-primary/90 max-w-2xl mx-auto leading-relaxed">
            Không cần thẻ ngân hàng. Không khóa tính năng. Hãy để mỗi ngày học tiếng Anh tràn ngập niềm vui và cảm hứng tự nhiên.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-3 bg-white text-primary font-headline font-black px-10 py-5 rounded-pill text-lg shadow-xl hover:scale-105 active:scale-95 transition-all group"
            >
              <span>Tham Gia Miễn Phí Ngay</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-on-primary/80">
            <span className="flex items-center gap-1.5">
              <FiCheck className="text-secondary-emphasis text-sm" /> Miễn phí trọn đời
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheck className="text-secondary-emphasis text-sm" /> Không quảng cáo phiền toái
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheck className="text-secondary-emphasis text-sm" /> Bắt đầu chỉ sau 30 giây
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
