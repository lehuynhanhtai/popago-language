import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
}

/**
 * Khối loading duy nhất của app. Dùng thay cho việc rải `animate-pulse` thủ công.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-field bg-surface-container-high", className)}
    />
  );
}
