import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerPrompt?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
  className?: string;
}

export function AuthCard({
  title,
  subtitle,
  children,
  footerPrompt,
  footerLinkText,
  footerLinkHref,
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto bg-surface-container-lowest/90 backdrop-blur-xl border border-surface-container-high/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-primary/5 transition-all",
        className
      )}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-headline font-extrabold text-2xl sm:text-3xl tracking-tight text-on-surface">
          {title}
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant font-medium leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Main Form Content */}
      <div className="space-y-4">{children}</div>

      {/* Footer link */}
      {footerPrompt && footerLinkText && footerLinkHref && (
        <div className="mt-6 pt-5 border-t border-surface-container-high/60 text-center">
          <p className="text-sm text-on-surface-variant">
            {footerPrompt}{" "}
            <Link
              href={footerLinkHref}
              className="font-headline font-bold text-primary hover:text-primary-dim hover:underline underline-offset-4 transition-colors"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
