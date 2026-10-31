# Theme & Palette — apps/web

**Trạng thái: light-only by design.** Quyết định chốt ngày 2026-10-31 (xem [visual-audit.md](visual-audit.md)).
Nguồn sự thật duy nhất: `apps/web/src/app/globals.css` (khối `@theme`).

## Vì sao light-only

Trước đợt dọn này app **không có** dark mode nào chạy được: 0 class `dark:`, 0 `prefers-color-scheme`,
0 `.dark`. Nhưng palette vẫn mang 51 token của Material 3 — trong đó 23 token never-used và 6 token
đặt tên theo cơ chế dark theme (`-dim`, `-fixed`, `inverse-`). Hệ quả: người đọc code tưởng có
dark mode, và mỗi lần thêm UI mới lại phải đoán dùng token nào.

Quyết định: **một chế độ sáng duy nhất**, palette rút về 27 token mang nghĩa giao diện.

Muốn mở lại dark mode sau này thì làm đúng thứ tự: (1) tạo `[data-theme="dark"]` với palette riêng,
(2) thêm toggle + lưu preference, (3) quay lại audit 10 chiều. **Không** thêm lại token `-dim`/`inverse`
vào khối `@theme` hiện tại.

## Palette (27 token)

| Token | Hex | Dùng cho |
|---|---|---|
| `surface-container-lowest` | `#ffffff` | Card, dialog, bề mặt nổi cao nhất |
| `surface-raised` | `#f2f7ff` | Banner/nền nâng nhẹ |
| `surface` | `#f2f7ff` | Nền app (`body`) |
| `surface-container-low` | `#e8f2ff` | Khối phụ |
| `surface-container` | `#dce9fb` | Khối phụ đậm hơn |
| `surface-container-high` | `#d5e4f7` | Border/divider, nền chip |
| `surface-container-highest` | `#cedef2` | Nền nhấn mạnh nhất |
| `outline` | `#6d7885` | Viền control, icon phụ |
| `outline-variant` | `#a3aebc` | Viền mảnh, scrollbar |
| `on-surface` | `#25303b` | Chữ chính |
| `on-surface-variant` | `#525d69` | Chữ phụ, metadata |
| `primary` | `#0055c4` | Hành động chính, link |
| `primary-hover` | `#004aad` | Trạng thái hover của primary |
| `primary-container` | `#739eff` | Nền nhấn primary |
| `on-primary` | `#f0f2ff` | Chữ trên nền primary |
| `secondary` | `#6e5a00` | Nhấn phụ |
| `secondary-hover` | `#604e00` | Hover của secondary |
| `secondary-container` | `#fdd433` | Nền nhấn vàng |
| `secondary-emphasis` | `#fdd433` | Icon/nhấn vàng trên nền tối |
| `secondary-strong` | `#eec622` | Vàng đậm hơn (fill, icon) |
| `on-secondary` | `#fff2d1` | Chữ trên nền secondary |
| `on-secondary-container` | `#5a4900` | Chữ trên nền secondary-container |
| `tertiary` | `#9b3e20` | Nhấn thứ ba |
| `tertiary-hover` | `#8b3315` | Hover của tertiary |
| `tertiary-container` | `#ff9472` | Nền nhấn cam |
| `on-tertiary` | `#ffefeb` | Chữ trên nền tertiary |
| `error` | `#b31b25` | Lỗi, hành động xoá |
| `error-hover` | `#9f0519` | Hover của error |
| `error-container` | `#fff1f2` | Nền lỗi nhẹ (banner, badge) |
| `on-error-container` | `#9f1239` | Chữ trên nền error-container |
| `success` | `#047857` | Trạng thái thành công |
| `success-hover` | `#065f46` | Hover của success |
| `success-container` | `#ecfdf5` | Nền thành công nhẹ |
| `on-success-container` | `#065f46` | Chữ trên nền success-container |
| `warning` | `#b45309` | Trạng thái cảnh báo |
| `warning-container` | `#fffbeb` | Nền cảnh báo nhẹ |

`secondary-container` và `secondary-emphasis` cùng giá trị `#fdd433` nhưng khác vai trò (nền vs icon).
Nếu sau này cần phân biệt bằng sắc độ, đổi `secondary-emphasis` — đừng gộp hai token.

## Thang shape (radius)

Dùng thẳng thang mặc định của Tailwind, **không** thêm hay override token `--radius-*`. Trước đây
`--radius-lg/xl` bị đổi (32/48px) khiến `rounded-xl` to hơn `rounded-3xl`, menu dropdown bị biến
thành viên thuốc.

| Lớp | Class | Giá trị | Dùng cho |
|---|---|---|---|
| Nhỏ | `rounded-md` | 6px | Checkbox, badge vuông nhỏ |
| Control | `rounded-xl` | 12px | Button, input, select, tab, icon button |
| Nổi | `rounded-2xl` | 16px | Menu, dropdown, popover, tooltip |
| Khối | `rounded-3xl` | 24px | Card, dialog, panel lớn |
| Tròn | `rounded-full` | pill | Avatar, badge tròn, nút tròn |

Quy tắc: **bán kính ≤ 1/3 chiều cao** phần tử. Hộp cao 40px thì tối đa `rounded-xl` (12px); chỉ dùng
`rounded-full` khi thực sự muốn hình viên thuốc (CTA marketing, chip, avatar).
`<Button shape="pill">` dành cho CTA ở landing, không dùng trong app.

## Component primitive

| File | Dùng khi |
|---|---|
| `components/ui/button.tsx` | Mọi nút có hành động. `variant`: primary/secondary/ghost/danger; `size`: sm/md/lg; `shape`: field/pill; có `isLoading`. Với `<Link>` cần trông như nút: `buttonVariants({...})`. |
| `components/ui/card.tsx` | Mọi khối card. `padding`: none/sm/md/lg; `interactive` thêm hover shadow. |
| `components/ui/dialog.tsx` | Mọi modal (native `<dialog>`, Escape, focus trap, scroll lock). |
| `components/ui/skeleton.tsx` | Khối loading. |

## Quy tắc

1. **Không hex trong `.tsx`.** Màu chỉ đến từ token. Ngoại lệ có kiểm soát: màu do người dùng chọn
   (theme của deck) — palette đó sống ở `features/vocabulary/deck-themes.ts` và phải qua kiểm contrast.
2. **Không dùng palette Tailwind thô** (`slate-*`, `indigo-*`, `zinc-*`…) cho UI mới.
3. **Sàn tương phản**: chữ ≥ 4.5:1, thành phần UI (icon, viền, progress) ≥ 3:1.
   Token hiện tại đạt 6.04–12.48:1 trên nền `surface`.
4. **Đặt tên theo vai trò, không theo cơ chế**: `primary-hover` thay vì `primary-dim`,
   `secondary-strong` thay vì `secondary-fixed-dim`. Hậu tố `dim`/`fixed`, tiền tố `inverse` bị cấm.
5. Thêm token mới = sửa đúng một nơi (`globals.css`) + cập nhật bảng trên.

## Lịch sử

| Ngày | Thay đổi |
|---|---|
| 2026-10-31 | 51 → 27 token. Xoá 24 token không dùng/không còn nghĩa (gồm `background`, `surface-dim`, `surface-variant`, `surface-tint`, `*-fixed`, `*-dim`, `inverse-*`). Đổi tên 6 token sang nghĩa light-only. Thêm `color-scheme: light` + `viewport.colorScheme`. Xoá webfont Material Symbols không dùng, đưa scrollbar về `outline-variant`, xoá 12 class animation chết. |
