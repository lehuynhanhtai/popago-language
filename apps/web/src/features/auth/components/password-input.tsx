"use client";

import { forwardRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "w-full px-4 py-3 pr-11 rounded-2xl bg-surface-container-lowest/80 border text-on-surface text-sm transition-all outline-none placeholder:text-outline-variant",
            "focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10",
            error
              ? "border-error focus-visible:border-error focus-visible:ring-error/10"
              : "border-surface-container-high hover:border-outline-variant",
            className
          )}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors p-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {showPassword ? (
            <FiEyeOff className="w-4 h-4" />
          ) : (
            <FiEye className="w-4 h-4" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
