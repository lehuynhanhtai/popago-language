"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  FiVolume2,
  FiRepeat,
  FiCheckCircle,
  FiZap,
  FiPlay,
  FiArrowRight,
  FiShield,
  FiStar,
} from "react-icons/fi";

const sampleCards = [
  {
    word: "Playground",
    phonetic: "/ˈpleɪ.ɡraʊnd/",
    type: "noun",
    meaning: "Sân chơi, nơi bạn thỏa sức khám phá và học tập vui vẻ",
    example: "Learning English is my new favorite playground!",
    exampleVi: "Học tiếng Anh là sân chơi yêu thích mới của tôi!",
  },
  {
    word: "Breakthrough",
    phonetic: "/ˈbreɪk.θruː/",
    type: "noun",
    meaning: "Bước đột phá, sự tiến bộ vượt bậc không ngờ tới",
    example: "Practice 10 minutes daily for a real breakthrough.",
    exampleVi: "Luyện 10 phút mỗi ngày để tạo bước đột phá thực sự.",
  },
  {
    word: "Effortless",
    phonetic: "/ˈef.ət.ləs/",
    type: "adjective",
    meaning: "Dễ dàng, nhẹ nhàng như không tốn chút sức lực",
    example: "With games, speaking English becomes effortless.",
    exampleVi: "Với trò chơi, nói tiếng Anh trở nên thật dễ dàng.",
  },
];

export function HeroSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasScored, setHasScored] = useState(false);

  const card = sampleCards[currentIdx]!;

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(card.word);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleScoreXP = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasScored) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#0055c4", "#fdd433", "#ff9472", "#558dff"],
      });
      setHasScored(true);
      setTimeout(() => {
        setHasScored(false);
        setIsFlipped(false);
        setCurrentIdx((prev) => (prev + 1) % sampleCards.length);
      }, 1200);
    }
  };

  const handleNextCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    setCurrentIdx((prev) => (prev + 1) % sampleCards.length);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-16 left-1/4 w-96 h-96 bg-primary-container/20 rounded-pill blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-container/25 rounded-pill blur-3xl -z-10 pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Headlines & Story Intro */}
        <div className="lg:col-span-7 text-left space-y-6">
          {/* Mission Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-secondary-container/30 border border-secondary/30 text-secondary font-headline font-bold text-xs sm:text-sm">
            <FiShield className="text-secondary text-base" />
            <span>Dự án giáo dục 100% Miễn Phí Vì Cộng Đồng</span>
          </div>

          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-black text-on-surface tracking-tight leading-[1.15]">
            Học tiếng Anh như{" "}
            <span className="text-primary underline decoration-secondary-container decoration-wavy decoration-2">
              chơi game
            </span>
            , hoàn toàn miễn phí!
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
            Hầu hết các nền tảng học tiếng Anh hiện nay đều thu phí đắt đỏ hoặc bị khóa tính năng. 
            <strong> PoPaGo</strong> ra đời để phá bỏ rào cản đó: một sân chơi tiếng Anh vui nhộn, 
            tương tác trực quan, giúp bạn học say mê mỗi ngày mà không tốn một xu.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-base px-8 py-4 rounded-pill shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all group"
            >
              <span>Vào Chơi & Học Ngay</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#zones"
              className="inline-flex items-center justify-center gap-2 font-headline font-bold text-base text-on-surface px-6 py-4 rounded-pill border-2 border-surface-container-highest hover:bg-surface-container-low transition-colors"
            >
              <FiPlay className="text-primary" />
              <span>Khám phá 4 khu vui chơi</span>
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-surface-container-high/60 max-w-lg">
            <div>
              <div className="font-headline font-black text-2xl sm:text-3xl text-primary">0 VNĐ</div>
              <div className="text-xs text-on-surface-variant font-medium">Trọn đời miễn phí</div>
            </div>
            <div>
              <div className="font-headline font-black text-2xl sm:text-3xl text-secondary">100%</div>
              <div className="text-xs text-on-surface-variant font-medium">Game hoá sinh động</div>
            </div>
            <div>
              <div className="font-headline font-black text-2xl sm:text-3xl text-tertiary">3000+</div>
              <div className="text-xs text-on-surface-variant font-medium">Từ vựng & phản xạ</div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Flashcard Widget */}
        <div className="lg:col-span-5 relative flex flex-col items-center">
          {/* Floating Badge 1: Streak */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-6, 6, -6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -left-4 sm:-left-8 z-20 bg-surface-container-lowest px-4 py-2.5 rounded-2xl shadow-xl border border-surface-container-high flex items-center gap-2.5"
          >
            <span className="text-xl">🔥</span>
            <div>
              <div className="font-headline font-bold text-xs text-on-surface">Streak 7 Ngày!</div>
              <div className="text-[10px] text-secondary font-semibold">Giữ lửa chăm chỉ</div>
            </div>
          </motion.div>

          {/* Floating Badge 2: XP */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [6, -6, 6] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -right-2 sm:-right-6 z-20 bg-secondary-container px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-on-secondary-container"
          >
            <FiZap className="text-lg text-secondary fill-secondary" />
            <div className="font-headline font-bold text-xs">+120 XP hôm nay!</div>
          </motion.div>

          {/* The Interactive Flashcard Box */}
          <div className="w-full max-w-sm">
            <div className="text-center mb-3 flex items-center justify-between px-2">
              <span className="text-xs font-headline font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                <FiStar className="text-secondary fill-secondary" /> Thử thẻ bài tương tác:
              </span>
              <button
                type="button"
                onClick={handleNextCard}
                className="text-xs font-headline font-bold text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors"
              >
                <FiRepeat /> Đổi thẻ khác
              </button>
            </div>

            {/* Flashcard Body */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="cursor-pointer bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border-2 border-primary/15 hover:border-primary/40 transition-all min-h-[340px] flex flex-col justify-between relative group"
            >
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 rounded-pill text-[11px] font-bold bg-primary-container/20 text-primary uppercase tracking-wide">
                  {card.type}
                </span>
                <button
                  type="button"
                  onClick={handlePronounce}
                  className="w-10 h-10 rounded-pill bg-primary/10 hover:bg-primary text-primary hover:text-on-primary flex items-center justify-center transition-colors"
                  title="Bấm để nghe phát âm"
                  aria-label="Nghe phát âm mẫu"
                >
                  <FiVolume2 className="text-lg" />
                </button>
              </div>

              {/* Card Content with Flip state */}
              <AnimatePresence mode="wait">
                {!isFlipped ? (
                  <motion.div
                    key="front"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="my-auto text-center space-y-2 py-4"
                  >
                    <h3 className="font-headline font-black text-3xl sm:text-4xl text-on-surface tracking-tight">
                      {card.word}
                    </h3>
                    <p className="font-body text-sm text-primary font-medium">{card.phonetic}</p>
                    <p className="text-xs text-on-surface-variant pt-3 italic">
                      " {card.example} "
                    </p>
                    <div className="pt-4 text-xs font-bold text-secondary-hover flex items-center justify-center gap-1">
                      <FiRepeat /> Nhấn vào thẻ để xem nghĩa & ví dụ
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="my-auto text-left space-y-3 py-2 bg-surface-container-low p-4 rounded-2xl"
                  >
                    <div className="text-xs font-bold uppercase tracking-wider text-primary">
                      Định nghĩa tiếng Việt:
                    </div>
                    <p className="font-body font-bold text-base text-on-surface leading-snug">
                      {card.meaning}
                    </p>
                    <div className="border-t border-surface-container-high/60 pt-2 text-xs text-on-surface-variant">
                      <span className="font-semibold text-on-surface">Dịch ví dụ: </span>
                      {card.exampleVi}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action in Card */}
              <button
                type="button"
                onClick={handleScoreXP}
                disabled={hasScored}
                className={`w-full py-3 rounded-pill font-headline font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  hasScored
                    ? "bg-secondary-container text-on-secondary-container font-black"
                    : "bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface"
                }`}
              >
                <FiCheckCircle className="text-base" />
                <span>{hasScored ? "Tuyệt vời! +50 XP" : "Tôi đã thuộc từ này! (+50 XP)"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
