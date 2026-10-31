export default function DashboardLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      {/* Top 4 Stat Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-3xl bg-surface-container-lowest/80 border border-surface-container-high/80 shadow-xs flex flex-col justify-between h-36"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="w-24 h-3.5 bg-surface-container-high rounded-pill animate-pulse" />
                <div className="w-32 h-7 bg-surface-container-highest rounded-hero animate-pulse" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-surface-container-high animate-pulse shrink-0" />
            </div>
            <div className="w-40 h-3 bg-surface-container-high/70 rounded-pill animate-pulse mt-3" />
          </div>
        ))}
      </div>

      {/* Main Grid: Left content (2 cols) & Right side widgets (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resume Learning Card Skeleton */}
          <div className="p-6 sm:p-7 rounded-3xl bg-surface-container-lowest/80 border border-surface-container-high/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-36 h-4 bg-surface-container-high rounded-pill animate-pulse" />
              <div className="w-20 h-6 bg-surface-container-high rounded-hero animate-pulse" />
            </div>

            <div className="space-y-3">
              <div className="w-3/4 h-6 bg-surface-container-highest rounded-hero animate-pulse" />
              <div className="w-1/2 h-4 bg-surface-container-high rounded-pill animate-pulse" />
            </div>

            {/* Progress Bar Skeleton */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="w-28 h-3 bg-surface-container-high rounded-pill animate-pulse" />
                <div className="w-12 h-3 bg-surface-container-high rounded-pill animate-pulse" />
              </div>
              <div className="w-full h-3 bg-surface-container-high rounded-pill overflow-hidden">
                <div className="w-1/3 h-full bg-surface-container-highest animate-pulse" />
              </div>
            </div>

            {/* Action button skeleton */}
            <div className="flex justify-end pt-2">
              <div className="w-36 h-11 bg-primary/20 rounded-2xl animate-pulse" />
            </div>
          </div>

          {/* Quick Learning Zones Skeleton */}
          <div className="p-6 rounded-3xl bg-surface-container-lowest/80 border border-surface-container-high/80 shadow-xs space-y-4">
            <div className="space-y-1.5">
              <div className="w-48 h-5 bg-surface-container-highest rounded-hero animate-pulse" />
              <div className="w-64 h-3.5 bg-surface-container-high rounded-pill animate-pulse" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-high/60 flex flex-col justify-between h-36"
                >
                  <div className="w-10 h-10 rounded-hero bg-surface-container-high animate-pulse mb-3" />
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-surface-container-highest rounded-panel animate-pulse" />
                    <div className="w-32 h-3 bg-surface-container-high rounded-pill animate-pulse" />
                  </div>
                  <div className="w-20 h-3 bg-surface-container-high rounded-pill animate-pulse mt-3" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          {/* Streak Card Skeleton */}
          <div className="p-6 rounded-3xl bg-surface-container-lowest/80 border border-surface-container-high/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/15 animate-pulse" />
              <div className="space-y-2">
                <div className="w-28 h-4 bg-surface-container-highest rounded-panel animate-pulse" />
                <div className="w-36 h-3 bg-surface-container-high rounded-pill animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5 pt-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div
                  key={day}
                  className="h-10 rounded-hero bg-surface-container-high animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Daily Quests Skeleton */}
          <div className="p-6 rounded-3xl bg-surface-container-lowest/80 border border-surface-container-high/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-32 h-5 bg-surface-container-highest rounded-hero animate-pulse" />
              <div className="w-16 h-4 bg-surface-container-high rounded-pill animate-pulse" />
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((quest) => (
                <div
                  key={quest}
                  className="p-3.5 rounded-2xl bg-surface-container-low/60 border border-surface-container-high/60 flex items-center justify-between"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="w-36 h-3.5 bg-surface-container-highest rounded-md animate-pulse" />
                    <div className="w-24 h-2.5 bg-surface-container-high rounded-pill animate-pulse" />
                  </div>
                  <div className="w-12 h-5 bg-surface-container-high rounded-pill animate-pulse shrink-0 ml-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
