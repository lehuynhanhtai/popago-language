import { FiStar } from "react-icons/fi";

const testimonials = [
  {
    content:
      "Trước đây mình dùng app học tiếng Anh khác, học thử 3 ngày là bắt trả 200k/tháng. Đến với PoPaGo vừa được học miễn phí 100%, vừa có âm thanh luyện phát âm cực chuẩn!",
    author: "Nguyễn Hoàng Nam",
    role: "Sinh viên ĐH Bách Khoa • Streak 45 ngày",
    avatar: "HN",
    color: "bg-primary-container text-on-primary",
  },
  {
    content:
      "Giao diện vui nhộn đúng kiểu sân chơi, âm thanh sống động. Mình tranh thủ 15 phút nghỉ trưa mỗi ngày là vừa đủ vượt ải từ vựng mà không cảm thấy mệt mỏi.",
    author: "Trần Mai Linh",
    role: "Chuyên viên Marketing • Diamond League",
    avatar: "ML",
    color: "bg-secondary-container text-on-secondary-container",
  },
  {
    content:
      "Em rủ cả nhóm bạn thân cùng vào học để đua top bảng xếp hạng mỗi tuần. Lần đầu tiên tụi em cảm thấy học tiếng Anh cuốn hút hơn cả chơi game thông thường!",
    author: "Lê Quốc Bảo",
    role: "Học sinh THPT • 12,500 XP",
    avatar: "QB",
    color: "bg-tertiary-container text-on-tertiary",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-primary font-headline font-extrabold tracking-widest text-xs uppercase">
          Cộng Đồng PoPaGo
        </span>
        <h2 className="font-headline text-3xl sm:text-5xl font-black text-on-surface mt-2 tracking-tight">
          Người Học Nói Gì Về Chúng Tôi?
        </h2>
        <p className="mt-3 text-base sm:text-lg text-on-surface-variant leading-relaxed">
          Hàng ngàn bạn trẻ đã tìm lại niềm cảm hứng học tiếng Anh mỗi ngày cùng PoPaGo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((item, idx) => (
          <div key={idx} className="flex flex-col justify-between gap-6">
            {/* Speech Bubble */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-high/60 shadow-sm relative hover:shadow-lg transition-shadow">
              <div className="flex gap-1 text-secondary-dim mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="text-secondary fill-secondary text-sm" />
                ))}
              </div>
              <p className="font-body text-sm sm:text-base text-on-surface leading-relaxed italic">
                "{item.content}"
              </p>
            </div>

            {/* Author info */}
            <div className="flex items-center gap-4 px-2">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-headline font-bold text-sm shadow-md ${item.color}`}
              >
                {item.avatar}
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm text-on-surface">
                  {item.author}
                </h4>
                <p className="text-xs text-on-surface-variant font-medium">
                  {item.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
