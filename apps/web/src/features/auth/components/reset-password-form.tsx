"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FiLock, FiCheckCircle, FiKey, FiArrowRight } from "react-icons/fi";
import { AuthCard } from "./auth-card";
import { PasswordInput } from "./password-input";

import { authService } from "../services/auth-service";
import { getHttpErrorMessage } from "@/lib/http-client";

interface ResetPasswordFormProps {
  initialCode?: string;
}

export function ResetPasswordForm({ initialCode = "" }: ResetPasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = initialCode || searchParams.get("oobCode") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oobCode: oobCode,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword");

  const onSubmit = async (values: {
    oobCode: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (!values.oobCode.trim()) {
      toast.error("Mã xác thực không hợp lệ hoặc đã hết hạn!");
      return;
    }

    if (values.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword({
        oobCode: values.oobCode,
        newPassword: values.newPassword,
      });

      setIsSuccess(true);
      toast.success("Mật khẩu đã được cập nhật thành công!");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      const message = await getHttpErrorMessage(
        error,
        "Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại!"
      );
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthCard
        title="Đổi mật khẩu thành công!"
        subtitle="Mật khẩu của bạn đã được cập nhật an toàn. Hệ thống đang chuyển hướng tới trang Đăng nhập..."
      >
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 animate-bounce">
            <FiCheckCircle className="w-8 h-8" />
          </div>

          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-primary text-on-primary font-headline font-bold text-sm shadow-md hover:bg-primary-dim transition-all"
          >
            <span>Đăng nhập với mật khẩu mới</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Đặt lại mật khẩu"
      subtitle="Thiết lập mật khẩu bảo mật mới cho tài khoản của bạn để tiếp tục sử dụng PoPaGo."
      footerPrompt="Hủy thao tác?"
      footerLinkText="Về trang Đăng nhập"
      footerLinkHref="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Code Field (Ẩn hoặc hiện nếu chưa có code từ URL) */}
        {!oobCode ? (
          <div>
            <label className="block text-xs font-headline font-bold text-on-surface mb-1.5 uppercase tracking-wider">
              Mã xác thực từ email (oobCode)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Dán mã bảo mật từ email tại đây"
                {...register("oobCode", { required: "Vui lòng nhập mã xác thực" })}
                className="w-full px-4 py-3 pl-11 rounded-2xl bg-surface-container-lowest/80 border border-surface-container-high text-on-surface text-sm transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
              <FiKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4 pointer-events-none" />
            </div>
            {errors.oobCode && (
              <p className="mt-1.5 text-xs text-error font-medium">
                {errors.oobCode.message}
              </p>
            )}
          </div>
        ) : (
          <input type="hidden" {...register("oobCode")} value={oobCode} />
        )}

        {/* New Password */}
        <div>
          <label className="block text-xs font-headline font-bold text-on-surface mb-1.5 uppercase tracking-wider">
            Mật khẩu mới
          </label>
          <div className="relative">
            <PasswordInput
              placeholder="Tối thiểu 6 ký tự"
              {...register("newPassword", {
                required: "Vui lòng nhập mật khẩu mới",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              })}
              error={errors.newPassword?.message}
              className="pl-11"
            />
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4 pointer-events-none" />
          </div>
          {errors.newPassword && (
            <p className="mt-1.5 text-xs text-error font-medium">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-headline font-bold text-on-surface mb-1.5 uppercase tracking-wider">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <PasswordInput
              placeholder="Nhập lại mật khẩu mới"
              {...register("confirmPassword", {
                required: "Vui lòng nhập lại mật khẩu",
                validate: (val) =>
                  val === newPasswordValue || "Mật khẩu xác nhận không khớp",
              })}
              error={errors.confirmPassword?.message}
              className="pl-11"
            />
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4 pointer-events-none" />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-error font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang cập nhật...
            </span>
          ) : (
            <>
              <span>Cập nhật mật khẩu mới</span>
              <FiArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </AuthCard>
  );
}
