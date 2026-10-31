import { FiCheck, FiX, FiHeart, FiSmile, FiShield, FiUsers } from "react-icons/fi";

export function MissionSection() {
  return (
    <section id="mission" className="py-24 bg-surface-container-low rounded-3xl my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-bold uppercase tracking-widest bg-secondary-container text-on-secondary-container mb-4">
            <FiHeart className="text-error" /> Sứ Mệnh Vì Cộng Đồng
          </span>
          <h2 className="font-headline text-3xl sm:text-5xl font-extrabold text-on-surface tracking-tight">
            Vì sao chúng tôi tạo ra PoPaGo <span className="text-primary">miễn phí</span>?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Học tiếng Anh là chìa khóa mở ra tương lai, nhưng rất nhiều bạn trẻ bị chặn lại bởi các gói thuê bao đắt đỏ. 
            Chúng tôi tin rằng cơ hội học tập chất lượng cao phải thuộc về <strong>tất cả mọi người</strong>.
          </p>
        </div>

        {/* Comparison Cards: Khác biệt của PoPaGo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Card 1: Ứng dụng thu phí thông thường */}
          <div className="bg-surface-container-lowest/80 p-8 sm:p-10 rounded-3xl border border-surface-container-high opacity-85">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline font-bold text-xl text-on-surface">
                Nền tảng thu phí thường gặp
              </h3>
              <span className="px-3 py-1 rounded-pill text-xs font-semibold bg-error/10 text-error">
                Có phí định kỳ
              </span>
            </div>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li className="flex items-start gap-3">
                <FiX className="text-error text-lg flex-shrink-0 mt-0.5" />
                <span>Cho học thử 3 ngày rồi bắt nhập thẻ tín dụng gia hạn tự động.</span>
              </li>
              <li className="flex items-start gap-3">
                <FiX className="text-error text-lg flex-shrink-0 mt-0.5" />
                <span>Khóa các tính năng quan trọng (luyện phát âm, bài test) sau paywall.</span>
              </li>
              <li className="flex items-start gap-3">
                <FiX className="text-error text-lg flex-shrink-0 mt-0.5" />
                <span>Học thuộc lòng từ vựng và ngữ pháp theo kiểu gượng ép, mau chán.</span>
              </li>
              <li className="flex items-start gap-3">
                <FiX className="text-error text-lg flex-shrink-0 mt-0.5" />
                <span>Quảng cáo chèn liên tục làm gián đoạn dòng suy nghĩ của học viên.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: PoPaGo - Sân chơi miễn phí */}
          <div className="bg-gradient-to-br from-primary to-primary-hover text-on-primary p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container/20 rounded-pill blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline font-black text-2xl text-on-primary">
                  Sân chơi PoPaGo
                </h3>
                <span className="px-3 py-1 rounded-pill text-xs font-bold bg-secondary-container text-on-secondary-container">
                  100% Free Trọn Đời
                </span>
              </div>
              <ul className="space-y-4 text-sm text-on-primary/95">
                <li className="flex items-start gap-3">
                  <FiCheck className="text-secondary-emphasis text-xl flex-shrink-0 mt-0.5" />
                  <span><strong>Không thu phí, không thẻ ngân hàng:</strong> Mọi bài học mở tự do cho mọi người.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheck className="text-secondary-emphasis text-xl flex-shrink-0 mt-0.5" />
                  <span><strong>Học như chơi game (Gamification):</strong> Tích điểm XP, giữ ngọn lửa streak, đấu boss từ vựng.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheck className="text-secondary-emphasis text-xl flex-shrink-0 mt-0.5" />
                  <span><strong>Công nghệ tương tác cao:</strong> Nhận diện phát âm, audio chuẩn bản ngữ, flashcard tương tác 3D.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheck className="text-secondary-emphasis text-xl flex-shrink-0 mt-0.5" />
                  <span><strong>Cộng đồng gắn kết:</strong> Cùng học, cùng thi đua vượt qua các cấp bậc vui vẻ mỗi ngày.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-on-primary/20 flex items-center gap-3 text-xs font-semibold">
              <FiShield className="text-lg text-secondary-container" />
              <span>Cam kết vĩnh viễn không thương mại hóa giáo dục cơ bản.</span>
            </div>
          </div>
        </div>

        {/* 3 cam kết nhỏ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
          <div className="bg-surface-container-lowest p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-hero bg-primary-container/20 text-primary flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface">Mục tiêu rõ ràng</h4>
              <p className="text-xs text-on-surface-variant">Chỉ 10-15 phút mỗi ngày để tạo phản xạ tự nhiên.</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-hero bg-secondary-container/20 text-secondary flex items-center justify-center text-2xl">
              🎮
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface">Vui là trên hết</h4>
              <p className="text-xs text-on-surface-variant">Biến ngữ pháp khô khan thành câu chuyện phiêu lưu.</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-hero bg-tertiary-container/20 text-tertiary flex items-center justify-center text-2xl">
              🤝
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface">Vì cộng đồng Việt</h4>
              <p className="text-xs text-on-surface-variant">Thiết kế tối ưu cho thói quen và lỗi phát âm người Việt.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
