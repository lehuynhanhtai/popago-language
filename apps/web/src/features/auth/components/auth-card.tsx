import { ReactNode } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
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
    <Card className={cn("mx-auto w-full max-w-md p-6 sm:p-8", className)}>
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
              className="font-headline font-bold text-primary hover:text-primary-hover hover:underline underline-offset-4 transition-colors"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      )}
    </Card>
  );
}
