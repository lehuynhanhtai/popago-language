# Visual Audit — apps/web (PoPaGo)

- **Ngày**: 2026-10-31
- **Phạm vi**: `apps/web/src` — 63 file `.tsx`, 24 file `.ts`
- **Phương pháp**: đếm tĩnh toàn bộ class/hex/aria trong source (không chụp ảnh UI), đối chiếu token trong `apps/web/src/app/globals.css`, tính contrast WCAG 2.1 cho 18 cặp màu thực tế.
- **Kết quả tổng**: **46/100 (4.6/10)**

> Kết luận một câu: **nền design token tốt hơn mức trung bình, nhưng kỷ luật áp dụng kém** — mọi lỗi nặng đều nằm đúng ở những chỗ *bỏ qua* hệ thống token.

---

## 1. Bảng điểm

| # | Chiều | Điểm | Phán quyết |
|---|---|---|---|
| 1 | Color consistency | 5/10 | 3 bảng màu song song: token M3 (855 lần dùng) · Tailwind slate/indigo (244 + 72) · hex tự do (52 mã) |
| 2 | Typography hierarchy | 6/10 | Font có cá tính + subset tiếng Việt, nhưng 216 lần `text-xs` và heading ngữ nghĩa hỏng |
| 3 | Spacing rhythm | 5/10 | Spacing bám thang 4px, nhưng **thang bo góc bị đảo** |
| 4 | Component consistency | 4/10 | Không có Button/Card dùng chung; `@repo/ui` = scaffold, 0 import |
| 5 | Responsive | 6/10 | `sm:` 141 · `lg:` 54 · `md:` 29 — nhảy cóc 1→2 cột; 5 chỗ chiều cao cứng |
| 6 | Dark mode | 2/10 | 0 class `dark:`, 0 `prefers-color-scheme`; token dark có sẵn nhưng không dùng |
| 7 | Animation | 4/10 | Duration gọn (200/300/500) nhưng 12 class `animate-in` **không có hiệu lực** |
| 8 | Accessibility | 4/10 | Token contrast 6:1+ rất tốt; nhưng 0 `focus-visible:`, 9 `aria-*`, dialog thiếu role |
| 9 | Information density | 5/10 | Dashboard dày vừa phải; micro-text 8–11px quá nhiều |
| 10 | Polish | 5/10 | Có skeleton + overlay, nhưng thiếu `error.tsx`/`not-found.tsx`, hover 3 kiểu |

---

## 2. Chi tiết từng chiều

### 2.1 Color consistency — 5/10

**Điểm mạnh (giữ nguyên):** hệ token M3 trong `globals.css:3-54` được dùng thật, không phải trang trí: 855 utility semantic (`text-on-surface` 97, `text-primary` 87, `text-on-surface-variant` 78). Contrast của token đạt 6.04–12.48:1 — vượt AA ở mọi cặp đã kiểm.

**Vấn đề 1 — bảng màu thứ hai (Tailwind raw):** `slate` 244 lần, `indigo` 72 lần, `emerald` 84, `amber` 74. Riêng `indigo-*` nằm trên 38 dòng thuộc 10 file (`indigo-600` 18 dòng / 9 file), dồn vào feature vocabulary — trong khi token primary là `#0055c4` (xanh). Người dùng thấy form auth màu xanh, form từ vựng màu tím.

- `features/vocabulary/components/decks/deck-dialog.tsx:275` — `bg-indigo-600` cho nút submit
- `features/vocabulary/components/words/word-dialog.tsx:365` — y hệt
- `features/vocabulary/components/decks/deck-card.tsx:102` — `hover:text-indigo-600`

**Vấn đề 2 — bảng màu thứ ba (hex trong journal):** `journal-notebook.tsx` có **65 mã hex trên 40 dòng**, tạo theme "giấy bút" hoàn toàn tách khỏi token: `#fbf9f4` (giấy), `#efe9dc`, `#ded5c2`, `#2c2215`, `#183a2c`…

- `features/journal/components/journal-notebook.tsx:81,112,118,145,172,177,201,227,256,275,313,466,488,523,566,604,674,702`

**Vấn đề 3 — theme color của deck:** `#6366f1` là default cứng ở 4 nơi (`deck-card.tsx:30`, `deck-detail-view.tsx:182`, `flashcard-practice.tsx:189`, `deck-dialog.tsx:20`), cộng 8 màu palette Tailwind chọn tay (`deck-dialog.tsx:8-15`).

**Vấn đề 4 — chi tiết lệch tông:** scrollbar tuỳ biến màu **nâu** `rgba(160,130,95,…)` trong app xanh (`globals.css:102-118`), dùng ở 4 chỗ (`custom-scrollbar`).

**Cách sửa:** cấm hex trong `.tsx` (ESLint rule `no-restricted-syntax` hoặc check CI đơn giản); thay `slate/indigo` bằng `surface-*`/`primary`; chuyển theme giấy thành token `--color-paper-*`; theme deck lấy từ token accent có sẵn `on-` color tương ứng.

### 2.2 Typography hierarchy — 6/10

**Điểm mạnh:** Plus Jakarta Sans (heading) + Be Vietnam Pro (body) đều load subset `vietnamese` (`app/layout.tsx:6-18`); thang bậc thị giác rõ (thin→black 6 bậc, `font-black` 38 lần cho số liệu).

**Vấn đề 1 — body text quá nhỏ:** `text-xs` (12px) **216 lần** so với `text-sm` 111 lần. Với app học ngôn ngữ cho người Việt, 12px là cỡ chú thích, không phải cỡ đọc chính. Thêm 23 lần `text-[11px]`, 9 lần `text-[10px]` (`(auth)/layout.tsx:31`, `public-header.tsx:23`, `dashboard-sidebar.tsx:71`), và 1 lần `text-[8px]` (`journal-notebook.tsx:106`).

**Vấn đề 2 — heading ngữ nghĩa hỏng:** đếm thẻ `<h1..h6>` theo thứ tự xuất hiện:

| Thành phần | Chuỗi heading | Vấn đề |
|---|---|---|
| `landing/hero-section.tsx` | `h1 → h3` | nhảy cấp |
| `landing/testimonials-section.tsx` | `h2 → h4` | nhảy cấp |
| `dashboard/student/student-dashboard.tsx` | `h3 h4 h4 h4` | **không có h1** |
| `profile/profile-view.tsx` | *(không có)* | **trang không có heading** |
| `journal/journal-notebook.tsx` | `h4 h2 h4 h1` | 4 cấp đảo lộn, 1 h1 nằm trong modal |
| `deck-list.tsx` | `h3` | không có h1/h2 |

**Vấn đề 3 — giọng thứ hai:** `deck-card.tsx:102` đặt tên deck bằng `<Link className="text-lg font-bold">` (không phải heading, font body) trong khi dashboard dùng `font-headline font-black` cho cùng vai trò tiêu đề.

**Cách sửa:** mỗi route đúng 1 `h1`; đặt `text-sm` làm body mặc định, `text-xs` chỉ cho metadata; thay `text-[10px]/[8px]` bằng `text-xs`.

### 2.3 Spacing rhythm — 5/10 ⚠️ có bug thật

Spacing ổn: 18 mức padding nhưng đều thuộc thang 4px, `gap-2` (8px) là nhịp chủ đạo (77 lần).

**Nhưng thang bo góc bị đảo** — `globals.css:60-63` override thang mặc định của Tailwind:

```css
--radius-DEFAULT: 1rem;  /* rounded      → 16px */
--radius-lg: 2rem;       /* rounded-lg   → 32px  ← lớn hơn 2xl */
--radius-xl: 3rem;       /* rounded-xl   → 48px  ← lớn hơn 3xl */
--radius-full: 9999px;
```

Kết quả thứ tự bán kính thực tế: `2xl (16px) < 3xl (24px) < lg (32px) < xl (48px)`. Tức là `rounded-xl` (83 lần) render **gấp ba** `rounded-2xl` (100 lần), và `rounded-lg` (30 lần) to hơn `rounded-3xl` (48 lần).

Hệ quả kéo theo: 6 bán kính viết tay `rounded-[6px|8px|10px|12px|14px|16px]` để "chữa cháy" — trong đó `rounded-[16px]` trùng đúng `rounded-2xl`.

**Cách sửa:** bỏ 4 dòng override, thay bằng 4 bậc ngữ nghĩa (`--radius-field: 12px`, `--radius-card: 24px`, `--radius-panel: 32px`, `--radius-pill: 9999px`). Lưu ý: đây là thay đổi **thị giác thật** cho 30 chỗ `rounded-lg` (32px→8px) — làm trong 1 PR riêng, có ảnh so sánh.

### 2.4 Component consistency — 4/10

- `@repo/ui` được khai báo trong `apps/web/package.json` nhưng **0 import** trong toàn bộ `apps/web/src`. Nội dung package vẫn là scaffold Turborepo: `packages/ui/src/button.tsx:15` gọi `alert("Hello from your ${appName} app!")`. → Không thể coi là design system.
- **Card:** 15 chỗ dùng recipe `bg-surface-container-lowest/90 + border + rounded-3xl + shadow-xs` (dashboard/profile/loading) — tốt. Nhưng card vocabulary dùng `rounded-2xl + shadow-sm + bg-white + border-slate-200` (`deck-card.tsx:33`), landing dùng `rounded-3xl + shadow-sm`, auth card dùng `rounded-3xl + shadow-xl shadow-primary/5 + backdrop-blur-xl` (`auth-card.tsx:27`). 4 recipe cho cùng một vai trò.
- **Button:** 3 hình dạng × 2 cách tô màu:

| Nơi | Shape | Fill |
|---|---|---|
| Landing CTA (`hero-section.tsx:118`) | `rounded-full` | gradient `from-primary to-primary-container` |
| Auth submit (`login-form.tsx:179`) | `rounded-2xl` | gradient (như trên) |
| Vocabulary submit (`deck-dialog.tsx:275`) | `rounded-xl` | solid `bg-indigo-600` |
| Dialog destructive (`delete-deck-dialog.tsx:71`) | `rounded-xl` | solid `bg-rose-600` |

- **Shadow:** 12 biến thể (`shadow-xs` 57, `sm` 29, `md` 23, `lg` 16, `2xl` 13, `xl` 11, `inner` 8, `2xs` 4, `primary` 12, `indigo` 2, `emerald` 1, `[#200306]` 1) không gắn với vai trò nào.
- **Dialog:** 6 surface dạng overlay (`deck-dialog:103`, `word-dialog:161`, `delete-deck-dialog:24`, `delete-word-dialog:24`, `auth-loading-overlay:77`, `journal-notebook:768`) nhưng mỗi cái tự dựng lại backdrop, z-index, padding.

**Cách sửa:** tạo `apps/web/src/components/ui/{button,card,dialog,field}.tsx` (đừng dựng trong `@repo/ui` — package đó là scaffold, sẽ tốn công migrate 2 lần); xoá `@repo/ui` khỏi deps hoặc reset nó thành primitive thật.

### 2.5 Responsive — 6/10

`sm:` 141 · `lg:` 54 · `md:` 29. App chủ yếu chỉ có 2 trạng thái (mobile / desktop), `md:` gần như bị bỏ — tablet 768–1024px sẽ rơi vào layout mobile hoặc desktop đầy đủ. Xem `hero-section.tsx:93` (`grid-cols-1 lg:grid-cols-12`).

Chiều cao cứng — 5 chỗ, dễ tràn khi bàn phím ảo mở hoặc màn hình thấp:

- `journal-notebook.tsx:140` — `min-h-[680px] sm:h-[720px] lg:h-[750px]`
- `flashcard-practice.tsx:163` — `h-[60vh]`; `:285,:291` — `min-h-[380px]`
- `word-dialog.tsx:169` — `h-[90vh]`

**Cách sửa:** dùng `dvh` thay `vh`; thêm breakpoint `md:` cho grid 12 cột; đổi `min-h-[680px]` thành `min-h-[min(680px,80dvh)]`.

### 2.6 Dark mode — 2/10

`dark:` = **0**, `prefers-color-scheme` = **0**, không có `.dark` class. Token đã có sẵn cặp dark trong `globals.css:4-54` (`inverse-surface #050f19`, `surface-dim`, `*-dim`) nhưng chưa có cơ chế chuyển.

Điểm 2 thay vì 0 vì nền tảng tốt (tên token đã ngữ nghĩa). **Cần quyết định có chủ đích:** hoặc (a) tuyên bố light-only trong docs và xoá token thừa, hoặc (b) thêm `data-theme="dark"` + palette dark đầy đủ.

### 2.7 Animation — 4/10 ⚠️ có bug thật

**Bug:** 12 class `animate-in` (kèm `fade-in`, `zoom-in-95`, `slide-in-from-left`) nhưng **`tailwindcss-animate` không được cài** (`apps/web/package.json` chỉ có `tailwindcss ^4.3.3`, `globals.css` không có `@plugin`). Các class này **không sinh CSS** → dialog/dropdown không có animation vào như code mong đợi.

Vị trí: `app/(dashboard)/layout.tsx:34`, `(dashboard)/loading.tsx:3`, `auth-loading-overlay.tsx:77,79`, `admin-dashboard.tsx:9`, `student-dashboard.tsx:23`, `profile-view.tsx:34`, `journal-notebook.tsx:516,598,717,768,793`.

Khác: 83 lần `transition-all` (transition mọi thuộc tính), 40 `animate-pulse` trên 11 file, 22 gradient, và landing page gánh `framer-motion` + `canvas-confetti` ngay ở top-level client component (`hero-section.tsx:5-6`).

**Cách sửa:** cài `tw-animate-css` (bản v4) **hoặc** xoá 12 class `animate-in`; thay `transition-all` → `transition-colors`/`transition-transform`/`transition-shadow`; gom skeleton vào `components/ui/skeleton.tsx`.

### 2.8 Accessibility — 4/10

**Mạnh:** contrast token đạt hết (6.04–12.48:1), form có `<label htmlFor>` (30 chỗ), `lang="vi"` đúng.

**Yếu 1 — focus:** `focus-visible:` = **0 lần**. Toàn bộ dùng `focus:` (93 lần, 13 file) → chuột click cũng hiện viền focus. Có 20 chỗ `focus:outline-none` mà chỉ 11 chỗ bù `focus:ring-2` → nguy cơ mất focus indicator.

**Yếu 2 — dialog:** chỉ `journal-notebook.tsx:766-767` có `role="dialog"` + `aria-modal`. 5 dialog còn lại là `<div>` trần: không role, không `aria-labelledby`, không đóng bằng Escape, không trap focus, không khoá scroll. Nút X trong `delete-deck-dialog.tsx:49-55` **không có `aria-label`** → screen reader đọc "button".

**Yếu 3 — aria tổng:** chỉ 9 lần `aria-*` trong 7 file (toàn app 87 file).

**Yếu 4 — contrast thật sự fail ở theme deck:** nút "Ôn tập" đặt chữ trắng trên `themeColor` (`deck-card.tsx:158-163`):

| Theme | Chữ trắng trên nền | Tỉ lệ | Kết luận |
|---|---|---|---|
| Amber `#f59e0b` | | 2.15:1 | fail |
| Emerald `#10b981` | | 2.54:1 | fail |
| Sky `#0ea5e9` | | 2.77:1 | fail |
| Rose `#f43f5e` | | 3.67:1 | fail (AA text) |
| Indigo `#6366f1` | | 4.47:1 | fail (sát ngưỡng) |
| Teal `#14b8a6` / Orange `#f97316` / Violet `#8b5cf6` | | 2.49 / 2.80 / 4.23:1 | fail |

**Cả 8/8 màu trong palette đều fail AA với chữ trắng** — không phải chuyện "vài màu xui", mà là thiết kế palette thiếu bước kiểm contrast.

Nghĩa là: **hệ token đạt AA ở mọi nơi, chỉ fail đúng chỗ người dùng tự chọn màu.**

**Cách sửa:** đổi `focus:` → `focus-visible:`; dựng `Dialog` primitive; tính màu chữ theo luminance của `themeColor` (hoặc chỉ cho chọn theme có `on-` color đi kèm).

### 2.9 Information density — 5/10

Dashboard dày nhưng có nhịp (`p-5`/`p-6`, `gap-4`). Vấn đề nằm ở micro-typography: 23×`text-[11px]`, 9×`text-[10px]`, 1×`text-[8px]` (`journal-notebook.tsx:106`), cộng `p-1`/`p-1.5`/`p-2` (44 + 62 + 89 lần) làm nhiều khối bị bí. Flashcard practice (`min-h-[380px]`) và journal (`h-[750px]`) là 2 chỗ cần thở hơn.

**Cách sửa:** đặt sàn cỡ chữ 12px; tăng `p-2` → `p-3` cho khối có 2 dòng chữ trở lên; chỉ giữ `p-1.5` cho icon button.

### 2.10 Polish — 5/10

**Có:** skeleton cho dashboard (`(dashboard)/loading.tsx`, 27 lần `animate-pulse`), overlay chờ auth (`auth-loading-overlay.tsx`), empty state ở vocabulary (`deck-list.tsx:122,130`), disabled state (`deck-card.tsx:160`).

**Thiếu:**
- Không có `error.tsx`, `global-error.tsx`, `not-found.tsx` trong `apps/web/src/app` (chỉ có đúng 1 `loading.tsx` cho dashboard).
- Hover không thống nhất: `hover:-translate-y-1` (deck-card:33) vs `hover:shadow-md` (stat-metric-card:29) vs `hover:scale-105` (hero CTA:120) vs `hover:bg-slate-50` (dialog).
- `transition-all` không kèm `motion-reduce` → không tôn trọng `prefers-reduced-motion`.
- Scrollbar nâu lệch tông (2.1).

---

## 3. AI-slop check (Mode 3)

| Dấu hiệu | Có? | Bằng chứng |
|---|---|---|
| Gradient thừa | Một phần (22 gradient) | Nút CTA gradient + `from-[#68131e]`… ở journal:81 |
| Blob trang trí | **Có** | `(auth)/layout.tsx:14-15`, `hero-section.tsx:90-91` (4 blob `blur-3xl`) |
| Glassmorphism vô cớ | **Có** | `auth-card.tsx:27` `backdrop-blur-xl` trên card không có gì phía sau; 18 chỗ `backdrop-blur-*` |
| Tím/xanh default | **Có** | `#6366f1` làm default theme, `bg-indigo-600` cho CTA |
| Bo góc mọi thứ | Một phần | `rounded-full` 107 lần (kể cả badge, avatar, tag) |
| Animation scroll quá đà | Không | — |
| Hero generic | **Không** | Hero có bản sắc riêng: gạch chân wavy (`hero-section.tsx:104`), confetti đúng màu brand (`:70`), flashcard tương tác thật |
| Font không cá tính | Không | Jakarta/Be Vietnam Pro là lựa chọn có chủ đích |

**Kết luận:** landing page có bản sắc thật; phần "slop" tập trung ở **auth + vocabulary** — đúng 2 khu vực được viết nhanh nhất.

---

## 4. Kế hoạch sửa (theo thứ tự ưu tiên)

### P0 — lỗi a11y + bug thật (ước 1 ngày)

1. `Dialog` primitive: `role="dialog"`, `aria-modal`, `aria-labelledby`, Escape, focus trap, scroll lock, `aria-label` cho nút X. Thay 5 dialog hiện có.
2. `focus:` → `focus-visible:` toàn bộ (93 chỗ), bảo đảm mọi interactive element có ring.
3. Theme deck: chọn màu chữ theo luminance hoặc giới hạn palette đạt 4.5:1.
4. Xoá 12 class `animate-in` **hoặc** cài `tw-animate-css`.
5. Xoá `.material-symbols-outlined` (`globals.css:66-81`) + `<link>` Material Symbols (`layout.tsx:39-42`) — font tải về mỗi trang nhưng **0 chỗ dùng**.

### P1 — hợp nhất hệ thống (ước 3–4 ngày)

6. `components/ui/button.tsx` với 4 variant (primary/secondary/ghost/danger) + 2 shape (pill cho marketing, field cho app). Xoá quyết định gradient ở submit form.
7. `Card` recipe duy nhất (3xl + `shadow-xs` + `border-surface-container-high/80`), migrate `deck-card`, `auth-card`, landing.
8. Sửa thang radius (`globals.css:60-63`) + migrate 6 bán kính viết tay.
9. Migrate vocabulary (indigo + slate) và journal (65 hex) về token.
10. Gom skeleton/empty state vào primitive; bỏ `@repo/ui` khỏi deps.

### P2 — hoàn thiện (ước 2–3 ngày)

11. Quyết định dark mode (light-only có tài liệu, hoặc thêm `data-theme`).
12. Thêm `error.tsx` / `not-found.tsx` / `loading.tsx` cho các route còn thiếu.
13. Hạ sàn typography 12px, giảm 216 `text-xs`, tăng `p-2`→`p-3` ở khối nhiều dòng.
14. Thêm breakpoint `md:` cho grid 12 cột; `vh` → `dvh`.
15. Quy ước hover: 1 ngôn ngữ (nâng shadow + dịch 2px), tôn trọng `prefers-reduced-motion`.

---

## 5. Gate kiểm được (đúng tinh thần AGENTS.md — gate phải nhị phân)

`rg` chưa được cài trên máy này, nên gate viết bằng PowerShell chạy được ngay từ gốc repo:

```powershell
function Count-Class($pattern) {
  (Get-ChildItem apps\web\src -Recurse -File -Include *.tsx,*.ts |
    Select-String -Pattern $pattern -AllMatches).Matches.Count
}

Count-Class '#[0-9a-fA-F]{6}'                                                  # G1 → 82  | đích 0
Count-Class '\b(?:bg|text|border|ring|from|to)-(?:slate|indigo|gray|zinc)-\d'   # G2 → 316 | đích 0
Count-Class '(?<!-)\bfocus:'                                                   # G3 → 93  | đích 0
Count-Class 'animate-in'                                                       # G4 → 12  | đích 0
Count-Class 'transition-all'                                                   # G5 → 83  | đích 0
Count-Class 'text-\[(?:8|9|10|11)px\]'                                         # G6 → 33  | đích 0
Count-Class 'role="dialog"'                                                    # G8 → 1   | đích 6
```

| Gate | Ý nghĩa | Hiện tại | Đích |
|---|---|---|---|
| G1 | Không hex trong code | 82 | 0 |
| G2 | Không palette Tailwind thô | 316 | 0 |
| G3 | Chỉ dùng `focus-visible:` | 93 | 0 |
| G4 | Animation có hiệu lực | 12 | 0 (hoặc cài plugin) |
| G5 | Không `transition-all` | 83 | 0 |
| G6 | Không chữ < 12px | 33 | 0 |
| G7 | Mỗi route đúng 1 `<h1>` | thiếu ở `/dashboard`, `/journal`, `/profile` | 1 mỗi route |
| G8 | Dialog có ngữ nghĩa | 1 / 6 | 6 / 6 |
| G9 | Contrast nút theme | 8 / 8 fail | 8 / 8 ≥ 4.5:1 |

G7 kiểm bằng Playwright (`e2e-testing` / `browser-qa`): đếm `h1` trên từng route trong 11 `page.tsx`. G9 dùng lại hàm luminance ở mục 2.8.

**Điểm kỳ vọng sau P0+P1:** 4.6 → ~7.0 (a11y 4→7, component 4→7, color 5→8).

---

## 6. Điều nên giữ

- Palette M3 + naming ngữ nghĩa: đúng hướng, contrast đạt, không cần làm lại.
- Cặp font + subset tiếng Việt: chọn đúng, giữ.
- Recipe card dashboard (15 chỗ lặp y nhau): đây là chuẩn để migrate các nơi khác về.
- Bản sắc landing: wavy underline, confetti brand-color, flashcard demo — không "san phẳng" khi chuẩn hoá.

---

## 7. Trạng thái xử lý

| Ngày | Nhánh | Đã xử lý | Gate |
|---|---|---|---|
| 2026-10-31 | `refactor/theme-light-only` | Xoá dark mode: 51 → 27 token, `color-scheme: light`, bỏ webfont Material Symbols, scrollbar về `outline-variant`, xoá 12 class `animate-in` chết | G4 = 0 · G-dark = 0 · G-token = 27 · `lint`/`check-types`/`build` exit 0 |
| *(chờ)* | `fix/a11y-p0` | Dialog primitive, `focus-visible`, `aria-label`, contrast theme deck | G3/G8/G9 |

### Cập nhật `fix/a11y-p0` (2026-10-31)

| Hạng mục | Trước | Sau |
|---|---|---|
| Dialog có ngữ nghĩa đầy đủ | 1/6 | **5/5** (`<Dialog>` native: role, aria-label, `aria-describedby`, Escape, focus trap, scroll lock; 2 dialog xoá là `alertdialog`) |
| `focus:` thuần | 93 | **0** (toàn bộ là `focus-visible:`) |
| Nút icon-only thiếu `aria-label` | 7 | **0** |
| Palette theme deck với chữ trắng | 8/8 fail (2.15–4.47:1) | **8/8 đạt** (4.70–6.29:1), gate `check:contrast` |
| Nút hiện mật khẩu bị `tabIndex={-1}` | không tới được bằng bàn phím | focusable + có ring |

Còn lại (không thuộc P0): focus trap của modal "Chế độ tập trung" trong journal dựa vào layout fullscreen chứ chưa phải `<dialog>`; sẽ gộp khi làm P1.

Quy ước palette sau khi dọn: [theme.md](theme.md).
