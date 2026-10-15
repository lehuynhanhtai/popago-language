import { FiZap, FiAward, FiTrendingUp, FiTarget } from "react-icons/fi";

const gamifiedFeatures = [
  {
    icon: "🔥",
    title: "Ngọn Lửa Streak",
    desc: "Chỉ cần 1 bài học ngắn 10 phút mỗi ngày để nuôi dưỡng ngọn lửa streak không bị tắt. Xây dựng kỷ luật học tập nhẹ nhàng.",
    color: "bg-error/10 text-error",
  },
  {
    icon: "🏆",
    title: "Giải Đấu Hạng Tuần",
    desc: "Thi đua tích điểm XP cùng các học viên khác. Thăng hạng từ Bronze lên Ruby và Diamond League mỗi chủ nhật.",
    color: "bg-secondary-container/30 text-secondary",
  },
  {
    icon: "🎖️",
    title: "Huy Hiệu & Danh Hiệu",
    desc: "Mở khóa các danh hiệu độc đáo như 'Thánh Bắt Âm', 'Bậc Thầy Thành Ngữ', 'Chiến Binh Đêm Muộn' khi hoàn thành cột mốc.",
    color: "bg-primary-container/20 text-primary",
  },
  {
    icon: "💎",
    title: "Vật Phẩm & Đổi Quà",
    desc: "Dùng kim cương tích lũy khi học để mua khiên bảo vệ streak, nhân đôi điểm kinh nghiệm trong các sự kiện cuối tuần.",
    color: "bg-tertiary-container/20 text-tertiary",
  },
];

export function GamificationSection() {
  return (
    <section id="gamified" className="py-24 bg-surface-container-low rounded-3xl my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-headline font-extrabold tracking-widest text-xs uppercase">
            Học Không Bao Giờ Chán
          </span>
          <h2 className="font-headline text-3xl sm:text-5xl font-black text-on-surface mt-2 tracking-tight">
            Cơ Chế Game Hóa <span className="text-secondary">Đầy Hứng Khởi</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Chúng tôi đưa những cơ chế gây nghiện lành mạnh nhất của thế giới game vào từng bài học tiếng Anh, 
            biến mỗi ngày học thành một cuộc phiêu lưu săn tìm tri thức.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {gamifiedFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-high/60 hover:-translate-y-1.5 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-surface-container">
                  {feat.icon}
                </div>
                <h3 className="font-headline font-bold text-xl text-on-surface mb-3">
                  {feat.title}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {feat.desc}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-surface-container-high/40 flex items-center gap-1.5 text-xs font-bold text-primary">
                <span>Miễn phí 100% cho mọi cấp độ</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
