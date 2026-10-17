export const AUTH_TOKEN_COOKIE = "auth_token";
export const USER_ROLE_COOKIE = "user_role";

const DEFAULT_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 ngày

/**
 * Ghi cookie xác thực và role lên trình duyệt
 */
export function setAuthCookies(
  token: string,
  role = "student",
  maxAgeSeconds = DEFAULT_MAX_AGE_SECONDS
): void {
  if (typeof document === "undefined") return;

  const isSecure = window.location.protocol === "https:";
  const secureFlag = isSecure ? "; Secure" : "";

  document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(
    token
  )}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secureFlag}`;

  document.cookie = `${USER_ROLE_COOKIE}=${encodeURIComponent(
    role
  )}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secureFlag}`;
}

/**
 * Xóa toàn bộ cookie xác thực
 */
export function clearAuthCookies(): void {
  if (typeof document === "undefined") return;

  const expirePast = "Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Path=/; SameSite=Lax";
  document.cookie = `${AUTH_TOKEN_COOKIE}=; ${expirePast}`;
  document.cookie = `${USER_ROLE_COOKIE}=; ${expirePast}`;
}

/**
 * Đọc giá trị cookie theo tên ở phía Client
 */
export function getAuthCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    if (!c) continue;
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}
