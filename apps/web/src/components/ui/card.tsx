import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardPadding = "none" | "sm" | "md" | "lg";

const paddingMap: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
  /** Thêm hiệu ứng hover cho card bấm được. */
  interactive?: boolean;
}

/**
 * Recipe card duy nhất của app: 3xl + shadow-xs + border surface-container-high/80.
 * Mọi card mới dùng component này thay vì lặp lại chuỗi class.
 */
export function Card({
  className,
  padding = "md",
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-surface-container-high/80 bg-surface-container-lowest/90 shadow-xs",
        paddingMap[padding],
        interactive && "transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    />
  );
}
