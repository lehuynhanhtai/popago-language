"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@repo/shared";
import { toast } from "sonner";
import { FiMail, FiLock, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { AuthCard } from "./auth-card";
import { PasswordInput } from "./password-input";
import { OAuthButtons } from "./oauth-buttons";
import { cn } from "@/lib/utils";

import { authService } from "../services/auth-service";
import { getHttpErrorMessage } from "@/lib/http-client";
import { useAuthStore } from "@/stores";
import { AuthLoadingOverlay } from "./auth-loading-overlay";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectDestination = searchParams.get("redirect") || "/dashboard";

  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreparingSession, setIsPreparingSession] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema as any),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const setAuth = useAuthStore((s) => s.setAuth);

  const onSubmit = async (values: LoginInput) => {
    setIsSubmitting(true);
    try {
      const response = await authService.login(values);
      if (response.data) {
        authService.saveAuthSession(response.data);

        // Đồng bộ store toàn cục
        const profile = response.data.user;
        const displayName =
          profile.displayName || values.email.split("@")[0] || "Học viên";

        const userRole: "admin" | "student" =
          profile.role === "admin" ? "admin" : "student";

        setAuth(
          {
            id: profile.id,
            email: profile.email,
            fullName: displayName,
            avatarUrl: profile.avatarUrl || undefined,
            role: userRole,
            targetLevel: profile.preferences?.targetLevel || "beginner",
            streakDays: profile.stats?.streakDays ?? 1,
            totalXp: profile.stats?.totalXp ?? 0,
            wordsLearned: profile.stats?.wordsLearnedCount ?? 0,
          },
          response.data.idToken
        );

        setAuthenticatedUser(displayName);
      }

      toast.success("Đăng nhập thành công!", {
        icon: <FiCheckCircle className="text-emerald-500 w-5 h-5" />,
        description: `Chào mừng bạn quay lại sân chơi PoPaGo.`,
      });

      // Bật trạng thái chờ tải dữ liệu người dùng & lộ trình học tập
      setIsPreparingSession(true);
    } catch (error) {
      const message = await getHttpErrorMessage(
        error,
        "Email hoặc mật khẩu không chính xác!"
      );
      toast.error(message);
      setIsPreparingSession(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Chào mừng trở lại!"
      subtitle="Đăng nhập để tiếp tục hành trình học tiếng Anh vui nhộn và duy trì chuỗi học tập (Streak)."
      footerPrompt="Chưa có tài khoản PoPaGo?"
      footerLinkText="Đăng ký miễn phí"
      footerLinkHref="/register"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-headline font-bold text-on-surface mb-1.5 uppercase tracking-wider">
            Email của bạn
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

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-headline font-bold text-on-surface uppercase tracking-wider">
              Mật khẩu
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-headline font-semibold text-primary hover:text-primary-hover hover:underline underline-offset-2 transition-colors"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <PasswordInput
              placeholder="Nhập mật khẩu của bạn"
              {...register("password")}
              error={errors.password?.message}
              className="pl-11"
            />
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4 pointer-events-none" />
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-error font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember me checkbox */}
        <div className="flex items-center justify-between py-1">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-primary border-outline-variant focus-visible:ring-primary/20 accent-primary"
            />
            <span className="text-xs font-medium text-on-surface-variant">
              Ghi nhớ đăng nhập trên thiết bị này
            </span>
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || isPreparingSession}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
        >
          {isPreparingSession ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang tải dữ liệu tài khoản...
            </span>
          ) : isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang xác thực...
            </span>
          ) : (
            <>
              <span>Đăng nhập ngay</span>
              <FiArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Social Login Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-container-high" />
          </div>
          <span className="relative px-3 bg-surface-container-lowest text-xs uppercase tracking-wider text-outline font-headline font-bold">
            Hoặc tiếp tục với
          </span>
        </div>

        {/* OAuth Buttons */}
        <OAuthButtons actionText="Đăng nhập" />
      </form>

      {/* Full-screen Loading Overlay for post-login data preparation */}
      <AuthLoadingOverlay
        isVisible={isPreparingSession}
        userName={authenticatedUser}
        onFinished={() => router.push(redirectDestination)}
      />
    </AuthCard>
  );
}
