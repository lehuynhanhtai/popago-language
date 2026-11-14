"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@repo/shared";
import { toast } from "sonner";
import { FiMail, FiArrowLeft, FiCheckCircle, FiSend } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { AuthCard } from "./auth-card";
import { cn } from "@/lib/utils";

import { authService } from "../services/auth-service";
import { getHttpErrorMessage } from "@/lib/http-client";

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema as any),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = async (values: ForgotPasswordInput) => {
    setIsSubmitting(true);
    try {
      await authService.forgotPassword(values);
      toast.success("Liên kết khôi phục mật khẩu đã được gửi!", {
        description: "Vui lòng kiểm tra hộp thư đến hoặc thư rác.",
      });
      setSubmittedEmail(values.email);
      setCountdown(60);
    } catch (error) {
      const message = await getHttpErrorMessage(
        error,
        "Không thể gửi email lúc này. Vui lòng thử lại sau!"
      );
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    if (countdown > 0 || !submittedEmail) return;
    onSubmit({ email: submittedEmail });
  };

  if (submittedEmail) {
    return (
      <AuthCard
        title="Kiểm tra hòm thư của bạn"
        subtitle="Chúng tôi đã gửi đường dẫn đặt lại mật khẩu đến email được cung cấp."
        footerPrompt="Nhớ ra mật khẩu cũ?"
        footerLinkText="Quay lại Đăng nhập"
        footerLinkHref="/login"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-secondary-container/40 flex items-center justify-center text-secondary border border-secondary-container">
            <FiCheckCircle className="w-8 h-8 text-emerald-600" />
          </div>

          <div className="bg-surface-container-low/80 p-4 rounded-2xl border border-surface-container-high/60">
            <p className="text-xs text-on-surface-variant font-medium">Email nhận liên kết:</p>
            <p className="font-headline font-bold text-sm text-primary break-all mt-0.5">
              {submittedEmail}
            </p>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            Nếu bạn không thấy email trong Hộp thư đến, vui lòng kiểm tra thêm mục <strong>Thư rác (Spam)</strong> hoặc <strong>Quảng cáo</strong>.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || isSubmitting}
              className="w-full py-3 px-4 rounded-2xl border border-surface-container-high bg-surface-container-lowest hover:bg-surface-container text-on-surface font-headline font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {countdown > 0
                ? `Gửi lại liên kết sau ${countdown}s`
                : "Gửi lại email xác nhận"}
            </button>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-headline font-semibold text-primary hover:text-primary-hover transition-colors pt-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            Quay lại trang Đăng nhập
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Khôi phục mật khẩu"
      subtitle="Nhập email tài khoản của bạn để nhận hướng dẫn khôi phục mật khẩu an toàn."
      footerPrompt="Nhớ ra mật khẩu của mình?"
      footerLinkText="Đăng nhập ngay"
      footerLinkHref="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-headline font-bold text-on-surface mb-1.5 uppercase tracking-wider">
            Email tài khoản PoPaGo
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="tenban@vidu.com"
              {...register("email")}
              className={cn(
                "w-full px-4 py-3 pl-11 rounded-2xl bg-surface-container-lowest/80 border text-on-surface text-sm transition-all outline-none placeholder:text-outline-variant",
                "focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10",
                errors.email
                  ? "border-error focus-visible:border-error focus-visible:ring-error/10"
                  : "border-surface-container-high hover:border-outline-variant"
              )}
            />
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4 pointer-events-none" />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-error font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit button */}
                <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          className="w-full font-headline font-bold"
        >
          {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi liên kết khôi phục"}
          {!isSubmitting && <FiSend className="w-4 h-4" />}
        </Button>

        {/* Back to login */}
        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-headline font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            Quay lại trang Đăng nhập
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
