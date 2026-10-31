"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Nguồn sự thật cho hình dạng + màu của button toàn app.
 * Dùng `buttonVariants()` cho <Link> cần trông như button.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-on-primary shadow-xs enabled:hover:bg-primary-hover",
        secondary:
          "border border-outline-variant bg-surface-container-lowest text-on-surface enabled:hover:bg-surface-container-low",
        ghost:
          "text-on-surface-variant enabled:hover:bg-surface-container enabled:hover:text-on-surface",
        danger: "bg-error text-white shadow-xs enabled:hover:bg-error-hover",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-sm",
      },
      shape: {
        field: "rounded-xl",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      shape: "field",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: ReactNode;
}

export function Button({
  className,
  variant,
  size,
  shape,
  isLoading = false,
  leftIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, shape }), className)}
      disabled={disabled ?? isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        leftIcon
      )}
      {children}
    </button>
  );
}
