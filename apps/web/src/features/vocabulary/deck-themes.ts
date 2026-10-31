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
