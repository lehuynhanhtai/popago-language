/**
 * Palette theme cho deck từ vựng — nguồn sự thật duy nhất.
 *
 * Ràng buộc: mọi màu phải đạt ≥ 4.5:1 khi đặt chữ trắng lên trên, vì nút "Ôn tập"
 * và progress bar dùng `text-white` trên nền `themeColor`.
 * Kiểm bằng: pnpm --filter web check:contrast
 */
export interface DeckThemeColor {
  label: string;
  value: string;
}

export const DECK_THEME_COLORS: readonly DeckThemeColor[] = [
  { label: "Indigo", value: "#4f46e5" },
  { label: "Emerald", value: "#047857" },
  { label: "Violet", value: "#7c3aed" },
  { label: "Sky", value: "#0369a1" },
  { label: "Rose", value: "#e11d48" },
  { label: "Amber", value: "#b45309" },
  { label: "Teal", value: "#0f766e" },
  { label: "Orange", value: "#c2410c" },
] as const;

export const DEFAULT_THEME_COLOR = "#4f46e5";

/**
 * Deck cũ lưu mã màu của palette trước (Tailwind 500) — trắng trên các màu đó
 * chỉ đạt 2.1–4.5:1. Map sang bậc tương ứng trong palette mới để giữ đúng ý
 * người dùng mà vẫn đạt AA.
 */
const LEGACY_THEME_COLORS: Readonly<Record<string, string>> = {
  "#6366f1": "#4f46e5",
  "#10b981": "#047857",
  "#8b5cf6": "#7c3aed",
  "#0ea5e9": "#0369a1",
  "#f43f5e": "#e11d48",
  "#f59e0b": "#b45309",
  "#14b8a6": "#0f766e",
  "#f97316": "#c2410c",
};

/** Trả về màu theme hợp lệ để dùng trực tiếp trên UI. */
export function resolveThemeColor(value?: string | null): string {
  if (!value) return DEFAULT_THEME_COLOR;
  const normalized = value.toLowerCase();
  return LEGACY_THEME_COLORS[normalized] ?? value;
}
