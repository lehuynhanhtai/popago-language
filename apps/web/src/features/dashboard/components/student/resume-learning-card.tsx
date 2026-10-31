import Link from "next/link";
import { FiPlay, FiBookOpen } from "react-icons/fi";

interface ResumeLearningCardProps {
  lessonTitle?: string;
  courseTitle?: string;
  progressPercent?: number;
  lessonHref?: string;
}

export function ResumeLearningCard({
  lessonTitle = "Unit 3: Giao tiếp gọi món tại nhà hàng & quán cà phê",
  courseTitle = "Tiếng Anh Giao Tiếp Cơ Bản Cho Người Mới Bắt Đầu",
  progressPercent = 65,
  lessonHref = "/courses/unit-3",
}: ResumeLearningCardProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-primary-container text-on-primary rounded-3xl p-6 sm:p-8 shadow-lg shadow-primary/15 transition-all">
      {/* Decorative background circle */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-headline font-bold bg-white/20 text-white backdrop-blur-md">
            <FiBookOpen className="w-3.5 h-3.5" />
            Đang học dở
          </span>
          <span className="text-xs text-white/80 font-medium">
            {courseTitle}
          </span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-headline font-black text-white tracking-tight leading-snug">
            {lessonTitle}
          </h2>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-xs text-white/90 font-bold">
            <span>Tiến độ bài học</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-secondary-emphasis rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href={lessonHref}
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-white text-primary font-headline font-extrabold text-sm shadow-md hover:bg-surface-raised hover:scale-105 active:scale-95 transition-all"
          >
            <FiPlay className="w-4 h-4 fill-primary" />
            <span>Tiếp tục bài học ngay</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
