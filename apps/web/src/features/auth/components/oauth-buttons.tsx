"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

interface OAuthButtonsProps {
  actionText?: string;
}

export function OAuthButtons({ actionText = "Tiếp tục" }: OAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<"google" | "facebook" | null>(null);

  const handleOAuthLogin = (provider: "google" | "facebook") => {
    setLoadingProvider(provider);
    // Placeholder xử lý xác thực bên thứ 3
    setTimeout(() => {
      setLoadingProvider(null);
      toast.info(`Tính năng đăng nhập qua ${provider === "google" ? "Google" : "Facebook"} đang được kết nối.`);
    }, 600);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <button
        type="button"
        disabled={loadingProvider !== null}
        onClick={() => handleOAuthLogin("google")}
        className="flex-1 inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border border-surface-container-high bg-surface-container-lowest/80 hover:bg-surface-container hover:border-outline-variant text-on-surface font-headline font-semibold text-sm transition-all shadow-xs active:scale-[0.98] disabled:opacity-60"
      >
        <FcGoogle className="w-5 h-5 shrink-0" />
        <span>{actionText} với Google</span>
      </button>

      <button
        type="button"
        disabled={loadingProvider !== null}
        onClick={() => handleOAuthLogin("facebook")}
        className="flex-1 inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border border-surface-container-high bg-surface-container-lowest/80 hover:bg-surface-container hover:border-outline-variant text-[#1877F2] font-headline font-semibold text-sm transition-all shadow-xs active:scale-[0.98] disabled:opacity-60"
      >
        <FaFacebook className="w-5 h-5 shrink-0" />
        <span className="text-on-surface">{actionText} với Facebook</span>
      </button>
    </div>
  );
}
