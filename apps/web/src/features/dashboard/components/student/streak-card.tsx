import { FiCheck } from "react-icons/fi";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayStatus {
  dayName: string;
  isCompleted: boolean;
  isToday: boolean;
}

export function StreakCard({ streakDays = 5 }: { streakDays?: number }) {
  const weekDays: DayStatus[] = [
    { dayName: "T2", isCompleted: true, isToday: false },
    { dayName: "T3", isCompleted: true, isToday: false },
    { dayName: "T4", isCompleted: true, isToday: false },
    { dayName: "T5", isCompleted: true, isToday: false },
    { dayName: "T6", isCompleted: true, isToday: true },
    { dayName: "T7", isCompleted: false, isToday: false },
    { dayName: "CN", isCompleted: false, isToday: false },
  ];

  return (
    <div className="bg-surface-container-lowest/90 border border-surface-container-high/80 rounded-3xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
            <Flame className="w-6 h-6 fill-orange-500 text-orange-500" />
          </div>
          <div>
            <h3 className="font-headline font-extrabold text-lg text-on-surface">
              Chuỗi {streakDays} ngày liên tiếp
            </h3>
            <p className="text-xs text-on-surface-variant font-medium">
              Chỉ cần 1 bài học mỗi ngày để duy trì lửa học!
            </p>
          </div>
        </div>
      </div>

      {/* Week days progress */}
      <div className="grid grid-cols-7 gap-2 pt-2">
        {weekDays.map((d, index) => (
          <div key={index} className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "w-9 h-9 rounded-2xl flex items-center justify-center font-headline font-bold text-xs transition-all",
                d.isCompleted
                  ? "bg-orange-500 text-white shadow-xs"
                  : d.isToday
                  ? "border-2 border-orange-500 bg-orange-50 text-orange-600"
                  : "bg-surface-container text-on-surface-variant/60"
              )}
            >
              {d.isCompleted ? <FiCheck className="w-4 h-4 stroke-[3]" /> : d.dayName}
            </div>
            <span
              className={cn(
                "text-[10px] font-bold uppercase",
                d.isToday ? "text-orange-600 font-extrabold" : "text-outline-variant"
              )}
            >
              {d.dayName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
