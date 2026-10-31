"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@repo/shared";
import { toast } from "sonner";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiCompass,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { AuthCard } from "./auth-card";
import { PasswordInput } from "./password-input";
import { OAuthButtons } from "./oauth-buttons";
import { cn } from "@/lib/utils";
import { authService } from "../services/auth-service";
import { getHttpErrorMessage } from "@/lib/http-client";

export function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema as any),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      targetLevel: "beginner",
      dailyGoalMinutes: 15,
    },
  });

  const passwordValue = watch("password") || "";
  const selectedLevel = watch("targetLevel");
  const selectedGoal = watch("dailyGoalMinutes");

  // Đánh giá độ mạnh mật khẩu
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: "", color: "bg-transparent" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, text: "Yếu", color: "bg-error" };
      case 2:
        return { score: 50, text: "Trung bình", color: "bg-secondary-emphasis" };
      case 3:
        return { score: 75, text: "Khá", color: "bg-primary-container" };
      case 4:
      default:
        return { score: 100, text: "Rất mạnh", color: "bg-emerald-500" };
    }
  };

  const passwordStrength = getPasswordStrength(passwordValue);

  const onSubmit = async (values: RegisterInput) => {
    if (!agreedTerms) {
      toast.error("Vui lòng đồng ý với điều khoản sử dụng của PoPaGo.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authService.register(values);
      toast.success("Đăng ký tài khoản thành công!", {
        icon: <FiCheckCircle className="text-emerald-500 w-5 h-5" />,
        description: `Chào mừng ${response.data?.user.displayName || values.displayName}!`,
      });
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      const message = await getHttpErrorMessage(
        error,
        "Đăng ký không thành công. Vui lòng kiểm tra lại thông tin!"
      );
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Tạo tài khoản PoPaGo"
      subtitle="Bắt đầu học tiếng Anh hoàn toàn miễn phí, không áp lực và vui nhộn mỗi ngày."
      footerPrompt="Đã có tài khoản học viên?"
      footerLinkText="Đăng nhập ngay"
      footerLinkHref="/login"
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-headline font-bold text-on-surface mb-1.5 uppercase tracking-wider">
            Tên hiển thị của bạn
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="VD: Minh Trí hoặc Alex"
              {...register("displayName")}
              className={cn(
                "w-full px-4 py-3 pl-11 rounded-2xl bg-surface-container-lowest/80 border text-on-surface text-sm transition-all outline-none placeholder:text-outline-variant",
                "focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10",
                errors.displayName
                  ? "border-error focus-visible:border-error focus-visible:ring-error/10"
                  : "border-surface-container-high hover:border-outline-variant"
              )}
            />
            <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4 pointer-events-none" />
          </div>
          {errors.displayName && (
            <p className="mt-1.5 text-xs text-error font-medium">
              {errors.displayName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-headline font-bold text-on-surface mb-1.5 uppercase tracking-wider">
            Địa chỉ Email
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

        {/* Password */}
        <div>
          <label className="block text-xs font-headline font-bold text-on-surface mb-1.5 uppercase tracking-wider">
            Mật khẩu bảo mật
          </label>
          <div className="relative">
            <PasswordInput
              placeholder="Tối thiểu 6 ký tự"
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

          {/* Password strength indicator */}
          {passwordValue && (
            <div className="mt-2 space-y-1">
              <div className="w-full h-1.5 bg-surface-container-high rounded-pill overflow-hidden">
                <div
                  className={cn("h-full transition-all duration-300", passwordStrength.color)}
                  style={{ width: `${passwordStrength.score}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-on-surface-variant font-medium">
                <span>Độ mạnh mật khẩu</span>
                <span className="font-semibold">{passwordStrength.text}</span>
              </div>
            </div>
          )}
        </div>

        {/* Level and Goal Preference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Trình độ hiện tại */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-headline font-bold text-on-surface mb-1.5 uppercase tracking-wider">
              <FiCompass className="text-primary w-3.5 h-3.5" />
              Trình độ hiện tại
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "beginner", label: "Mới học" },
                { id: "intermediate", label: "Trung cấp" },
                { id: "advanced", label: "Nâng cao" },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setValue("targetLevel", lvl.id as any)}
                  className={cn(
                    "py-2 px-1 text-xs rounded-hero font-headline font-medium border text-center transition-all cursor-pointer",
                    selectedLevel === lvl.id
                      ? "bg-primary text-on-primary border-primary shadow-xs"
                      : "bg-surface-container-lowest border-surface-container-high text-on-surface hover:bg-surface-container"
                  )}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mục tiêu hàng ngày */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-headline font-bold text-on-surface mb-1.5 uppercase tracking-wider">
              <FiClock className="text-secondary w-3.5 h-3.5" />
              Mục tiêu mỗi ngày
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { minutes: 10, label: "10 phút" },
                { minutes: 15, label: "15 phút" },
                { minutes: 30, label: "30 phút" },
              ].map((goal) => (
                <button
                  key={goal.minutes}
                  type="button"
                  onClick={() => setValue("dailyGoalMinutes", goal.minutes)}
                  className={cn(
                    "py-2 px-1 text-xs rounded-hero font-headline font-medium border text-center transition-all cursor-pointer",
                    selectedGoal === goal.minutes
                      ? "bg-secondary-container text-on-secondary-container border-secondary-container shadow-xs font-bold"
                      : "bg-surface-container-lowest border-surface-container-high text-on-surface hover:bg-surface-container"
                  )}
                >
                  {goal.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Terms of Service */}
        <div className="pt-2">
          <label className="inline-flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded-field text-primary border-outline-variant focus-visible:ring-primary/20 accent-primary shrink-0"
            />
            <span className="text-xs text-on-surface-variant leading-relaxed">
              Tôi đồng ý với{" "}
              <Link href="#" className="font-semibold text-primary hover:underline">
                Điều khoản dịch vụ
              </Link>{" "}
              và{" "}
              <Link href="#" className="font-semibold text-primary hover:underline">
                Chính sách bảo mật
              </Link>{" "}
              của PoPaGo.
            </span>
          </label>
        </div>

        {/* Submit Button */}
                <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          className="w-full font-headline font-bold"
        >
          {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản miễn phí"}
          {!isSubmitting && <FiArrowRight className="w-4 h-4" />}
        </Button>

        {/* Social Register Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-container-high" />
          </div>
          <span className="relative px-3 bg-surface-container-lowest text-xs uppercase tracking-wider text-outline font-headline font-bold">
            Hoặc đăng ký nhanh bằng
          </span>
        </div>

        {/* OAuth Buttons */}
        <OAuthButtons actionText="Đăng ký" />
      </form>
    </AuthCard>
  );
}
