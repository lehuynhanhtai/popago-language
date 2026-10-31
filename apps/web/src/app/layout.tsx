import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Be_Vietnam_Pro } from "next/font/google";
import { AppProviders } from "@/providers";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PoPaGo Language",
  description: "Nền tảng học ngôn ngữ thông minh PoPaGo",
};

// App chỉ có light mode. `colorScheme: "light"` giữ browser chrome + form control
// ở bản sáng kể cả khi OS đang bật dark mode.
export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f2f7ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${plusJakartaSans.variable} ${beVietnamPro.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="font-body bg-surface text-on-surface antialiased" suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
