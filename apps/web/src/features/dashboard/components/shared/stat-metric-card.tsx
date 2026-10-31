import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconBgColor?: string;
  badge?: {
    text: string;
    isPositive?: boolean;
  };
  className?: string;
}

export function StatMetricCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = "bg-primary/10 text-primary",
  badge,
  className,
}: StatMetricCardProps) {
  return (
    <Card
      padding="md"
      interactive
      className={cn("group relative overflow-hidden", className)}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-headline font-bold text-on-surface-variant uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-headline font-black text-on-surface tracking-tight">
            {value}
          </p>
        </div>

        <div
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
            iconBgColor
          )}
        >
          {icon}
        </div>
      </div>

      {(subtitle || badge) && (
        <div className="mt-3 pt-3 border-t border-surface-container-high/40 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-on-surface-variant font-medium">
              {subtitle}
            </span>
          )}
          {badge && (
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-pill font-bold text-[11px]",
                badge.isPositive
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-surface-container text-on-surface-variant"
              )}
            >
              {badge.text}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
