import { HeroSection } from "@/components/landing/hero-section";
import { MissionSection } from "@/components/landing/mission-section";
import { EnglishZonesBento } from "@/components/landing/english-zones-bento";
import { GamificationSection } from "@/components/landing/gamification-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CtaSection } from "@/components/landing/cta-section";

export const metadata = {
  title: "PoPaGo - Sân Chơi Học Tiếng Anh Miễn Phí Vì Cộng Đồng",
  description:
    "Nền tảng học tiếng Anh 100% miễn phí vì cộng đồng theo phương pháp game hóa vui nhộn, luyện phát âm AI, từ vựng 3D và không áp lực.",
};

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <MissionSection />
      <EnglishZonesBento />
      <GamificationSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
