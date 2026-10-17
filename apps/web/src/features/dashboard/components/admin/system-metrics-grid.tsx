import { FiUsers, FiActivity, FiCheckSquare, FiClock } from "react-icons/fi";
import { StatMetricCard } from "../shared/stat-metric-card";

export function SystemMetricsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatMetricCard
        title="Tổng người dùng"
        value="18,450"
        subtitle="+1,240 tài khoản mới tháng này"
        icon={<FiUsers className="w-6 h-6 text-primary" />}
        iconBgColor="bg-primary/10 text-primary"
        badge={{ text: "+14.2%", isPositive: true }}
      />

      <StatMetricCard
        title="Học viên Active (DAU)"
        value="3,120"
        subtitle="Học viên học hôm nay"
        icon={<FiActivity className="w-6 h-6 text-secondary" />}
        iconBgColor="bg-secondary-container/40 text-secondary"
        badge={{ text: "+6.8%", isPositive: true }}
      />

      <StatMetricCard
        title="Lượt học hoàn thành"
        value="142,800"
        subtitle="Tổng số bài học đã hoàn tất"
        icon={<FiCheckSquare className="w-6 h-6 text-emerald-600" />}
        iconBgColor="bg-emerald-500/10 text-emerald-600"
        badge={{ text: "+22.4%", isPositive: true }}
      />

      <StatMetricCard
        title="Tổng giờ học cộng đồng"
        value="48,650h"
        subtitle="100% tài nguyên miễn phí"
        icon={<FiClock className="w-6 h-6 text-purple-600" />}
        iconBgColor="bg-purple-500/10 text-purple-600"
        badge={{ text: "Ổn định", isPositive: true }}
      />
    </div>
  );
}
