"use client";

import Link from "next/link";
import { FiMic, FiLayers, FiHeadphones, FiBookOpen, FiArrowUpRight } from "react-icons/fi";

export function EnglishZonesBento() {
  return (
    <section id="zones" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div className="max-w-2xl">
          <span className="text-primary font-headline font-extrabold tracking-widest text-xs uppercase">
            Học Như Chơi Game
          </span>
          <h2 className="font-headline text-3xl sm:text-5xl font-black text-on-surface mt-2 tracking-tight">
            4 Khu Vui Chơi <span className="text-primary">Tiếng Anh</span> Độc Đáo
          </h2>
          <p className="text-on-surface-variant text-base sm:text-lg mt-3 leading-relaxed">
            Mỗi khu vực là một chế độ chơi được thiết kế riêng để bạn rèn luyện toàn diện 4 kỹ năng mà không hề cảm thấy áp lực.
          </p>
        </div>

        <Link
          href="/register"
          className="inline-flex items-center gap-2 font-headline font-bold text-sm text-primary hover:text-primary-hover group"
        >
          <span>Khám phá toàn bộ bài học</span>
          <FiArrowUpRight className="text-base group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[620px]">
        {/* Zone 1: Đấu trường phát âm (Voice Arena) */}
        <div className="md:col-span-2 md:row-span-1 bg-gradient-to-br from-primary to-primary-container rounded-3xl p-8 text-on-primary relative overflow-hidden flex flex-col justify-between group cursor-pointer shadow-lg hover:shadow-2xl transition-all">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-pill blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />
          
          <div className="flex items-center justify-between z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl text-on-primary">
              <FiMic />
            </div>
            <span className="px-3 py-1 rounded-pill text-xs font-bold bg-white/20 backdrop-blur-md">
              Công nghệ sóng âm AI
            </span>
          </div>

          <div className="z-10 mt-6">
            <div className="flex items-center gap-2 text-secondary-emphasis text-xs font-bold uppercase tracking-wider mb-1">
              <span>Zone 01 • Luyện Nói & Ngữ Điệu</span>
            </div>
            <h3 className="font-headline font-black text-2xl sm:text-3xl text-on-primary mb-2">
              Đấu Trường Phát Âm Chuẩn
            </h3>
            <p className="text-sm text-on-primary/90 max-w-md leading-relaxed">
              Thu âm giọng nói của bạn, đối chiếu biểu đồ sóng âm chuẩn bản xứ và nhận phản hồi chi tiết đến từng âm vị kết thúc (ending sounds).
            </p>
          </div>
        </div>

        {/* Zone 2: Vũ trụ Từ vựng 3D (Tactile Vocabulary) */}
        <div className="md:col-span-1 md:row-span-2 bg-secondary-container rounded-3xl p-8 text-on-secondary-container relative overflow-hidden flex flex-col justify-between group cursor-pointer shadow-lg hover:shadow-2xl transition-all">
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-secondary/15 rounded-pill blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between z-10">
            <div className="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center text-2xl text-secondary">
              <FiLayers />
            </div>
            <span className="px-2.5 py-1 rounded-pill text-xs font-bold bg-secondary/10">
              3000+ Thẻ bài
            </span>
          </div>

          <div className="z-10 my-auto py-6">
            <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-md shadow-sm border border-secondary/20 mb-4 transform group-hover:rotate-2 transition-transform">
              <div className="text-xs font-bold text-secondary uppercase">Mini Card</div>
              <div className="font-headline font-black text-xl text-on-surface">Unstoppable</div>
              <div className="text-xs text-on-surface-variant">Không gì cản bước được</div>
            </div>
          </div>

          <div className="z-10">
            <div className="text-secondary font-bold text-xs uppercase tracking-wider mb-1">
              Zone 02 • Flashcard 3D
            </div>
            <h3 className="font-headline font-black text-2xl text-on-secondary-container mb-2">
              Vũ Trụ Từ Vựng
            </h3>
            <p className="text-sm text-on-secondary-container/85 leading-relaxed">
              Chạm, lật, kéo thả từ vựng theo chủ đề đời thực. Học theo phương pháp Spaced Repetition (Lặp lại ngắt quãng) không bao giờ quên.
            </p>
          </div>
        </div>

        {/* Zone 3: Luyện nghe phản xạ (Speed Listening) */}
        <div className="md:col-span-1 md:row-span-1 bg-surface-container-highest rounded-3xl p-8 text-on-surface relative overflow-hidden flex flex-col justify-between group cursor-pointer shadow-lg hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl text-primary">
              <FiHeadphones />
            </div>
            <span className="px-2.5 py-1 rounded-pill text-xs font-bold bg-primary/10 text-primary">
              Phản xạ tức thì
            </span>
          </div>

          <div className="z-10 mt-4">
            <div className="text-primary font-bold text-xs uppercase tracking-wider mb-1">
              Zone 03 • Nghe Phản Xạ
            </div>
            <h3 className="font-headline font-bold text-xl text-on-surface mb-2">
              Bắt Âm Tốc Độ
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Rèn luyện tai nghe qua các đoạn hội thoại thực tế, điều chỉnh tốc độ từ chậm đến siêu tốc.
            </p>
          </div>
        </div>

        {/* Zone 4: Ngữ pháp cốt truyện (Story Quest Grammar) */}
        <div className="md:col-span-2 md:row-span-1 bg-gradient-to-r from-tertiary to-tertiary-hover rounded-3xl p-8 text-on-tertiary relative overflow-hidden flex flex-col justify-between group cursor-pointer shadow-lg hover:shadow-2xl transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-pill blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl text-on-tertiary">
              <FiBookOpen />
            </div>
            <span className="px-3 py-1 rounded-pill text-xs font-bold bg-white/20 backdrop-blur-md">
              Học qua cốt truyện
            </span>
          </div>

          <div className="z-10 mt-6">
            <div className="text-tertiary text-xs font-bold uppercase tracking-wider mb-1">
              Zone 04 • Nhập Vai Thực Tế
            </div>
            <h3 className="font-headline font-black text-2xl sm:text-3xl text-on-tertiary mb-2">
              Cốt Truyện Ngữ Pháp
            </h3>
            <p className="text-sm text-on-tertiary/90 max-w-md leading-relaxed">
              Giải quyết tình huống: Order cà phê ở London, phỏng vấn xin việc ở Silicon Valley hay check-in sân bay quốc tế.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
