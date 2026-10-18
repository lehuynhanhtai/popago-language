import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_TOKEN_COOKIE, USER_ROLE_COOKIE } from "@/lib/auth-cookies";

/**
 * Danh sách các route dành cho khách (chưa đăng nhập)
 */
const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

/**
 * Danh sách tiền tố các route yêu cầu đăng nhập (học viên hoặc admin)
 */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/courses",
  "/flashcards",
  "/practice",
  "/leaderboard",
];

/**
 * Danh sách tiền tố các route chỉ dành riêng cho Admin
 */
const ADMIN_ONLY_PREFIXES = ["/users", "/content", "/settings"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const authToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const userRole = request.cookies.get(USER_ROLE_COOKIE)?.value || "student";
  const isAuthenticated = Boolean(authToken);

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const isAdminOnlyRoute = ADMIN_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  // 1. Nếu đã đăng nhập mà truy cập các trang auth (login, register,...) -> chuyển hướng sang /dashboard
  if (isAuthRoute && isAuthenticated) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 2. Nếu chưa đăng nhập mà truy cập route được bảo vệ hoặc route admin -> chuyển hướng sang /login kèm param redirect
  if ((isProtectedRoute || isAdminOnlyRoute) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    const destination = `${pathname}${search}`;
    if (destination !== "/dashboard") {
      loginUrl.searchParams.set("redirect", destination);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 3. Nếu là route admin nhưng người dùng không có role admin -> chuyển hướng về /dashboard
  if (isAdminOnlyRoute && isAuthenticated && userRole !== "admin") {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

/**
 * Cấu hình matcher loại trừ toàn bộ assets tĩnh và internal Next.js requests
 */
export const config = {
  matcher: [
    /*
     * Match toàn bộ routes ngoại trừ:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Các định dạng file tĩnh (svg, png, jpg, webp, mp3,...)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|txt|mp3|wav|ogg)$).*)",
  ],
};
