import { FiUserCheck, FiAward, FiBook } from "react-icons/fi";

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: "complete" | "streak" | "register";
}

export function RecentActivities() {
  const activities: Activity[] = [
    {
      id: "1",
      user: "Nguyễn Minh Khang",
      action: "hoàn thành xuất sắc",
      target: "Unit 4: Giao tiếp sân bay",
      time: "5 phút trước",
      type: "complete",
    },
    {
      id: "2",
      user: "Trần Bảo Ngọc",
      action: "đạt cột mốc",
      target: "Chuỗi 30 ngày học liên tiếp 🔥",
      time: "12 phút trước",
      type: "streak",
    },
    {
      id: "3",
      user: "Lê Văn Tùng",
      action: "đăng ký tài khoản mới",
      target: "Mục tiêu: Sơ cấp (Beginner)",
      time: "25 phút trước",
      type: "register",
    },
    {
      id: "4",
      user: "Phạm Thu Hương",
      action: "luyện tập phát âm AI",
      target: "Đạt 98/100 điểm ngữ điệu",
      time: "42 phút trước",
      type: "complete",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Bảng hoạt động học tập (2 cols) */}
      <div className="lg:col-span-2 bg-surface-container-lowest/90 border border-surface-container-high/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline font-extrabold text-base text-on-surface">
              Hoạt động học viên theo thời gian thực
            </h3>
            <p className="text-xs text-on-surface-variant font-medium">
              Các sự kiện học tập và đạt mốc điểm của cộng đồng
            </p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        </div>

        <div className="divide-y divide-surface-container-high/60">
          {activities.map((act) => (
            <div key={act.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                  {act.type === "complete" ? (
                    <FiBook className="w-4 h-4 text-primary" />
                  ) : act.type === "streak" ? (
                    <FiAward className="w-4 h-4 text-orange-500" />
                  ) : (
                    <FiUserCheck className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <div className="text-xs">
                  <span className="font-headline font-bold text-on-surface">
                    {act.user}
                  </span>{" "}
                  <span className="text-on-surface-variant">{act.action}</span>{" "}
                  <span className="font-medium text-primary">{act.target}</span>
                </div>
              </div>

              <span className="text-[11px] text-outline font-medium shrink-0">
                {act.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tỷ lệ phân bố cấp độ (1 col) */}
      <div className="bg-surface-container-lowest/90 border border-surface-container-high/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="font-headline font-extrabold text-base text-on-surface">
            Phân bố trình độ học viên
          </h3>
          <p className="text-xs text-on-surface-variant font-medium">
            Tỷ lệ mục tiêu của toàn bộ học viên
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {/* Beginner */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-headline font-semibold">
              <span className="text-on-surface">Người mới bắt đầu (Beginner)</span>
              <span className="text-primary font-bold">58%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "58%" }} />
            </div>
          </div>

          {/* Intermediate */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-headline font-semibold">
              <span className="text-on-surface">Trung cấp (Intermediate)</span>
              <span className="text-secondary font-bold">32%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
              <div className="h-full bg-secondary-fixed-dim rounded-full" style={{ width: "32%" }} />
            </div>
          </div>

          {/* Advanced */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-headline font-semibold">
              <span className="text-on-surface">Nâng cao (Advanced)</span>
              <span className="text-emerald-600 font-bold">10%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "10%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
