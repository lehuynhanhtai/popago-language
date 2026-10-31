#!/usr/bin/env node
/**
 * Gate contrast cho palette theme của deck.
 *
 * Nút "Ôn tập" luôn đặt chữ trắng trên nền `themeColor`, nên mọi màu trong
 * palette phải đạt WCAG AA cho text thường (>= 4.5:1) với #ffffff.
 *
 * Chạy: pnpm --filter web check:contrast
 */

import { readFileSync } from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";

const THEMES_FILE = new URL(
  "../src/features/vocabulary/deck-themes.ts",
  import.meta.url,
);
const MIN_RATIO = 4.5;
const WHITE = "#ffffff";

function channelToLinear(channel) {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex) {
  const [r, g, b] = [1, 3, 5].map((offset) =>
    parseInt(hex.slice(offset, offset + 2), 16),
  );
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  );
}

function contrastRatio(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

const source = readFileSync(fileURLToPath(THEMES_FILE), "utf8");

const entries = [
  ...source.matchAll(/label:\s*"([^"]+)",\s*value:\s*"(#[0-9a-fA-F]{6})"/g),
].map(([, label, value]) => ({ label, value }));

const defaultMatch = source.match(
  /DEFAULT_THEME_COLOR\s*=\s*"(#[0-9a-fA-F]{6})"/,
);

if (entries.length < 8) {
  console.error(
    `✗ Không đọc được palette từ ${fileURLToPath(THEMES_FILE)} (thấy ${entries.length} màu, cần >= 8).`,
  );
  console.error(
    '  Kiểm tra lại định dạng dòng `{ label: "...", value: "#rrggbb" },`.',
  );
  process.exit(1);
}

if (!defaultMatch) {
  console.error("✗ Không tìm thấy DEFAULT_THEME_COLOR trong deck-themes.ts.");
  process.exit(1);
}

const checks = [
  ...entries.map(({ label, value }) => ({ label, value })),
  { label: "DEFAULT_THEME_COLOR", value: defaultMatch[1] },
];

let failed = 0;

console.log("Theme deck — contrast với chữ trắng (ngưỡng 4.5:1)\n");

for (const { label, value } of checks) {
  const ratio = contrastRatio(value, WHITE);
  const pass = ratio >= MIN_RATIO;
  if (!pass) failed += 1;
  console.log(
    `${pass ? "✓" : "✗"} ${label.padEnd(20)} ${value}  ${ratio.toFixed(2)}:1`,
  );
}

console.log("");

if (failed > 0) {
  console.error(
    `✗ ${failed}/${checks.length} màu fail AA. Làm đậm màu hoặc đổi màu chữ.`,
  );
  process.exit(1);
}

console.log(`✓ ${checks.length}/${checks.length} màu đạt AA với chữ trắng.`);
