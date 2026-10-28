# Project Instructions: Fullstack Monorepo (Next.js + NestJS + Turborepo)

Dự án này sử dụng kiến trúc Fullstack Monorepo (Turborepo), cấu hình theo chuẩn ECC
(Everything Claude Code) đã được **lọc riêng cho stack TypeScript**.

> **Trạng thái ECC**: `.agents/` là **local-only** (đã thêm vào `.gitignore`, không push lên git).
> Mỗi developer tự cài/cấu hình bộ skill của mình. Xem mục 5 để bảo trì.

---

## 1. Kiến trúc Monorepo (Turborepo)

| Workspace | Vai trò | Stack chính |
|---|---|---|
| `apps/web` | Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Zustand, TanStack Query/Table/Virtual, react-hook-form + Zod |
| `apps/api` | Backend | NestJS 12, TypeScript (ESM), Firestore (`@google-cloud/firestore`), Firebase Admin, Zod, Swagger |
| `packages/shared` | Types + utils dùng chung | TypeScript |
| `packages/config` | ESLint / tsconfig / Prettier | — |
| `packages/ui` | UI component library | React, Tailwind |

Chi tiết cây thư mục chuẩn:
- Frontend: [structure-fe.md](file:///docs/front-end/structure-fe.md)
- Backend: [structure-be.md](file:///docs/back-end/structure-be.md)

**Package manager**: `pnpm@10.33.0` · **Node**: `>=20` · **Task runner**: Turborepo 2

---

## 2. Stack đang dùng — và KHÔNG dùng

Repo **chỉ có TypeScript/JavaScript**. Bằng chứng: 0 file `.py`, `.go`, `.rs`, `.java`,
`.kt`, `.swift`, `.php`, `.cs`, `.dart`, `.cpp`, `.rb`, `.vue` trong `apps/` và `packages/`.

Vì vậy các rule/agent cho Python, Go, Rust, Java, Kotlin, Swift, PHP, C#, C++, Ruby, Vue,
Angular, Flutter, Django, FastAPI **đã được loại bỏ khỏi `.agents/`**. Không thêm lại
trừ khi repo thực sự mở rộng sang stack đó.

---

## 3. Ràng buộc & Quy chuẩn (.agents/rules)

Mọi thay đổi code **bắt buộc** tuân theo quy chuẩn trong `.agents/rules/`.
Dưới đây là **toàn bộ 22 rule** đang có hiệu lực.

### A. Quy chuẩn chung (10)

- [common-development-workflow.md](file:///.agents/rules/common-development-workflow.md) — Lập plan trước khi sửa tính năng lớn; research & reuse trước khi viết mới.
- [common-coding-style.md](file:///.agents/rules/common-coding-style.md) — Quy ước đặt tên, cấu trúc file, nguyên tắc viết code chung.
- [common-patterns.md](file:///.agents/rules/common-patterns.md) — Design pattern dùng chung.
- [common-testing.md](file:///.agents/rules/common-testing.md) — Ưu tiên TDD cho bug fix và feature mới.
- [common-code-review.md](file:///.agents/rules/common-code-review.md) — Tự review trước khi kết thúc task.
- [common-security.md](file:///.agents/rules/common-security.md) — Không hardcode secrets, sanitize input, validate mọi boundary.
- [common-performance.md](file:///.agents/rules/common-performance.md) — Nguyên tắc hiệu năng chung.
- [common-git-workflow.md](file:///.agents/rules/common-git-workflow.md) — Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`…).
- [common-hooks.md](file:///.agents/rules/common-hooks.md) — Quy ước hook/automation.
- [common-agents.md](file:///.agents/rules/common-agents.md) — Hướng dẫn cộng tác giữa các agent.

### B. TypeScript (5)

- [typescript-coding-style.md](file:///.agents/rules/typescript-coding-style.md) — Strict mode, **không dùng `any`** (dùng `unknown` + narrow), immutability, không `console.log` trong production.
- [typescript-patterns.md](file:///.agents/rules/typescript-patterns.md) — Type-safe pattern, runtime validation bằng **Zod**.
- [typescript-testing.md](file:///.agents/rules/typescript-testing.md) — Chiến lược test cho TypeScript.
- [typescript-security.md](file:///.agents/rules/typescript-security.md) — Rào chắn bảo mật phía TypeScript.
- [typescript-hooks.md](file:///.agents/rules/typescript-hooks.md) — Hook/automation cho TypeScript.

### C. React & Web (7)

- [react-coding-style.md](file:///.agents/rules/react-coding-style.md) — Phân tách rõ **Server Component** vs **Client Component** (`'use client'`).
- [react-hooks.md](file:///.agents/rules/react-hooks.md) — Dùng hook đúng cách, tránh re-render thừa.
- [react-patterns.md](file:///.agents/rules/react-patterns.md) — Composition, state management, data fetching.
- [react-testing.md](file:///.agents/rules/react-testing.md) — Test component và hook.
- [react-security.md](file:///.agents/rules/react-security.md) — XSS, sanitize, xử lý token phía client.
- [web-performance.md](file:///.agents/rules/web-performance.md) — Tối ưu **Core Web Vitals**, bundle size, lazy loading.
- [web-design-quality.md](file:///.agents/rules/web-design-quality.md) — Chất lượng UI/UX, accessibility, responsive.

---

## 4. NestJS Backend Guidelines (`apps/api`)

Áp dụng cho mọi thay đổi trong `apps/api`.

### Kiến trúc

- Theo **Clean Architecture** chia theo module: `Controller → Service → Repository / Data Provider`.
- Không để Controller chứa business logic; không để Service truy cập Firestore trực tiếp
  nếu đã có Repository.
- Mỗi module tự đóng gói: `*.module.ts`, `*.controller.ts`, `*.service.ts`, DTO, entity/schema.

### Validation

- **Validate toàn bộ payload đầu vào bằng DTO** + `ValidationPipe`.
- Dùng **Zod** cho schema phức tạp; `class-validator` cho DTO khai báo.
- Không tin bất kỳ dữ liệu nào từ client — kể cả ID trong URL param.

### Xử lý lỗi

- Gom lỗi tập trung qua **Exception Filters**.
- **Không để lộ** stack trace, tên collection, hay chi tiết hạ tầng ra response.
- Trả lỗi theo HTTP status chuẩn; message hướng người dùng, log chi tiết ở server.

### Firestore & Firebase

- Truy cập Firestore qua **Repository/Data Provider**, không rải `firestore.collection()`
  khắp Service.
- Field nào client được ghi phải khai báo tường minh — tránh ghi đè field hệ thống.
- `firebase-admin` chỉ khởi tạo **một lần**, credentials lấy từ env, **không commit**.
- Cân nhắc composite index khi thêm query mới (xem `firestore.indexes.json`).

### TypeScript trong API

- Project dùng **ESM** (`"type": "module"`) — chú ý phần mở rộng import và `tsconfig`.
- Lint bằng **oxlint** (`--type-aware`), không phải ESLint.

---

## 5. Cấu trúc `.agents/` và cách bảo trì

```
.agents/
├── rules/      22 file  — quy chuẩn (TS + React + web + common)
├── agents/     30 file  — agent definitions khớp stack
├── workflows/  48 file  — slash-command / workflow
├── skills/     48 dir   — skill nạp vào catalog của session
└── ecc-install-state.json — manifest của ECC installer
```

### `.agents/` là local-only — KHÔNG commit

Thư mục này nằm trong `.gitignore` và đã được xóa khỏi toàn bộ lịch sử git.
Mỗi developer tự cài bộ skill riêng. Không dùng `git add -f .agents/`.

### ⚠️ `.agents/` do ECC installer quản lý

`ecc-install-state.json` ghi lại 280 file được tạo từ ECC v2.2.2. Các file đã bị loại bỏ
thủ công **sẽ được khôi phục** nếu chạy lại `configure-ecc` hoặc `install-plan.js`.

**Không chạy lại installer với `--profile minimal`/`developer`** — sẽ kéo về 122 file rules
cho 22 ngôn ngữ (python, rust, swift, php, kotlin, golang…) mà repo không dùng.

Nếu buộc phải cài lại, phải giới hạn ngôn ngữ:

```powershell
node scripts/install-plan.js --profile minimal --legacy-languages typescript --json
```

---

## 6. Bảng định tuyến: loại task → công cụ

Dùng bảng này để chọn đúng skill / agent / workflow.

| Loại task | Skill | Agent | Workflow |
|---|---|---|---|
| **Tính năng mới** | `tdd-workflow`, `intent-driven-development` | `planner` → `tdd-guide` → `code-reviewer` | `feature-dev`, `plan`, `prp-plan` |
| **Fix bug** | `tdd-workflow`, `verification-loop` | `build-error-resolver` | `build-fix` |
| **Refactor** | `verification-loop` | `refactor-cleaner`, `code-simplifier` | `refactor-clean` |
| **Code review** | `verification-loop`, `santa-method` | `code-reviewer`, `typescript-reviewer`, `react-reviewer` | `code-review`, `review-pr` |
| **Bảo mật** | — | `security-reviewer` | `security-scan` |
| **Hiệu năng** | `browser-qa` | `performance-optimizer` | — |
| **Accessibility** | `browser-qa` | `a11y-architect` | — |
| **Type design** | — | `type-design-analyzer` | — |
| **E2E test** | `e2e-testing` | `e2e-runner` | `test-coverage` |
| **Điều tra bug khó** | `agent-introspection-debugging`, `click-path-audit` | `silent-failure-hunter`, `spec-miner` | — |
| **Hiểu codebase** | `codebase-onboarding`, `code-tour` | `code-explorer`, `code-architect` | `update-codemaps` |
| **Kiến trúc** | `architecture-decision-records` | `architect`, `code-architect` | `plan-prd` |
| **Tài liệu** | `living-docs-governance` | `doc-updater`, `docs-lookup` | `update-docs` |
| **Kiểm soát context** | `context-budget`, `strategic-compact` | `harness-optimizer` | `harness-audit`, `cost-report` |
| **Dọn cấu hình ECC** | `agent-sort`, `config-gc`, `skill-stocktake` | — | `skill-health` |
| **Kết thúc task** | `agent-self-evaluation`, `delivery-gate` | `agent-evaluator` | — |

---

## 7. Lệnh verify thực tế của repo

Chạy từ **thư mục gốc repo**:

```bash
# Toàn bộ (qua Turborepo)
pnpm check-types     # turbo run check-types  → tsc --noEmit
pnpm lint            # turbo run lint         → web: eslint · api: oxlint
pnpm build           # turbo run build        → next build + nest build
pnpm format          # prettier --write "**/*.{ts,tsx,md}"
```

Chạy riêng từng app:

```bash
# Frontend
pnpm --filter web check-types    # next typegen && tsc --noEmit
pnpm --filter web lint           # eslint --max-warnings 0
pnpm --filter web build          # next build
pnpm --filter web dev            # next dev --port 3000

# Backend
pnpm --filter @repo/api check-types   # tsc --noEmit
pnpm --filter @repo/api lint          # oxlint --type-aware src/ test/
pnpm --filter @repo/api test          # vitest run
pnpm --filter @repo/api test:cov      # vitest run --coverage
pnpm --filter @repo/api test:e2e      # vitest run --config ./vitest.config.e2e.ts
pnpm --filter @repo/api dev           # nest start --watch
```

Seed dữ liệu (chỉ `apps/api`):

```bash
pnpm --filter @repo/api seed:admin
pnpm --filter @repo/api seed:journal
pnpm --filter @repo/api seed:decks
pnpm --filter @repo/api seed:vocabularies
```

**Thứ tự verify trước khi kết thúc task** (theo `verification-loop`):

1. `pnpm check-types` — không được có lỗi type
2. `pnpm lint` — `web` chạy với `--max-warnings 0`, nên warning cũng fail
3. `pnpm --filter @repo/api test` — test phải pass
4. `pnpm build` — xác nhận build được
5. Tự review diff theo `.agents/rules/common-code-review.md`

---

## 8. Các tác tử và kỹ năng tích hợp

- **Skills** — `.agents/skills/` (48): nạp tự động vào catalog session, gọi bằng công cụ `skill`.
  Tiêu biểu: `tdd-workflow`, `verification-loop`, `e2e-testing`, `browser-qa`,
  `intent-driven-development`, `strategic-compact`, `context-budget`, `agent-sort`.
- **Agents** — `.agents/agents/` (30): định nghĩa vai chuyên biệt, đọc khi cần theo bảng mục 6.
- **Workflows** — `.agents/workflows/` (48): slash-command / quy trình, gọi thủ công theo tên.
