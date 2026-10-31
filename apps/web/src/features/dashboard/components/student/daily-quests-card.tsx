import { FiAward, FiCheckCircle, FiCircle } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface Quest {
  id: string;
  title: string;
  rewardXp: number;
  completed: boolean;
}

export function DailyQuestsCard() {
  const quests: Quest[] = [
    {
      id: "q1",
      title: "Luyện phát âm AI chuẩn 5 câu",
      rewardXp: 20,
      completed: true,
    },
    {
      id: "q2",
      title: "Lật và ôn 10 thẻ Flashcard từ mới",
      rewardXp: 15,
      completed: true,
    },
    {
      id: "q3",
      title: "Học liên tục 15 phút không ngắt quãng",
      rewardXp: 30,
      completed: false,
    },
  ];

  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="bg-surface-container-lowest/90 border border-surface-container-high/80 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-secondary-container/40 text-secondary flex items-center justify-center">
            <FiAward className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-headline font-extrabold text-base text-on-surface">
              Nhiệm vụ hôm nay
            </h3>
            <p className="text-xs text-on-surface-variant font-medium">
              Hoàn thành để nhận thêm điểm thưởng XP
            </p>
          </div>
        </div>
        <span className="text-xs font-headline font-black px-2.5 py-1 rounded-full bg-surface-container text-primary">
          {completedCount}/{quests.length}
        </span>
      </div>

      <div className="space-y-2.5 pt-1">
        {quests.map((q) => (
          <div
            key={q.id}
            className={cn(
              "p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all",
              q.completed
                ? "bg-surface-container-low/60 border-surface-container-high/60 opacity-80"
                : "bg-surface-container-lowest border-surface-container-high hover:border-primary/40 shadow-xs"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {q.completed ? (
                <FiCheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <FiCircle className="w-5 h-5 text-outline-variant shrink-0" />
              )}
              <span
                className={cn(
                  "text-xs font-headline font-semibold truncate",
                  q.completed
                    ? "line-through text-on-surface-variant"
                    : "text-on-surface"
                )}
              >
                {q.title}
              </span>
            </div>

            <span className="shrink-0 text-xs font-headline font-black text-secondary px-2 py-0.5 rounded-full bg-secondary-container/30 border border-secondary-container/50">
              +{q.rewardXp} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
