# Project Instructions: Fullstack Monorepo (Next.js + NestJS + Turborepo)

Dự án này sử dụng kiến trúc Fullstack Monorepo được cấu hình theo chuẩn ECC (Everything Claude Code) tối ưu cho Antigravity IDE.

---

## 1. Kiến trúc Monorepo (Turborepo)

- **`apps/web`**: Ứng dụng Frontend Next.js (App Router, React 19, TypeScript, Tailwind CSS). Xem chi tiết cây thư mục chuẩn tại [structure-fe.md](file:///docs/structure-fe.md).
- **`apps/api`**: Ứng dụng Backend NestJS (TypeScript, Modular Architecture, DTOs, Guards, Services).
- **`packages/shared`**: Shared TypeScript types, interfaces, utility functions dùng chung cho cả Frontend và Backend.
- **`packages/config`**: Cấu hình chia sẻ chung (eslint, tsconfig, prettier).
- **`packages/ui`**: Shared UI component library dùng chung.

---

## 2. Ràng buộc & Quy chuẩn từ ECC (.agents/rules)

Mọi thay đổi code bắt buộc phải tuân theo các quy chuẩn đã được cài đặt trong thư mục `.agents/rules/`:

### A. Quy chuẩn chung (ECC Common Rules)
- [common-development-workflow.md](file:///.agents/rules/common-development-workflow.md): Lập plan trước khi sửa tính năng lớn, giữ code độc lập, dễ revert.
- [common-testing.md](file:///.agents/rules/common-testing.md): Ưu tiên TDD (Test-Driven Development) cho bug fixes và feature mới.
- [common-security.md](file:///.agents/rules/common-security.md): Rào chắn bảo mật (AgentShield) - không hardcode secrets, sanitize inputs, validate mọi boundary.
- [common-code-review.md](file:///.agents/rules/common-code-review.md): Tự review và kiểm tra tiêu chuẩn trước khi kết thúc task.
- [common-git-workflow.md](file:///.agents/rules/common-git-workflow.md): Tuân thủ Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`,...).

### B. TypeScript & React (Frontend & Shared)
- [typescript-coding-style.md](file:///.agents/rules/typescript-coding-style.md): Strict mode, không dùng `any`, tận dụng union types và immutability.
- [typescript-patterns.md](file:///.agents/rules/typescript-patterns.md): Pattern thiết kế type an toàn, runtime validation (Zod).
- [react-coding-style.md](file:///.agents/rules/react-coding-style.md): Phân tách rõ Server Components và Client Components (`'use client'`).
- [react-hooks.md](file:///.agents/rules/react-hooks.md): Sử dụng hooks đúng cách, tránh re-render thừa.
- [web-performance.md](file:///.agents/rules/web-performance.md) & [web-design-quality.md](file:///.agents/rules/web-design-quality.md): Tối ưu Core Web Vitals, UI chất lượng cao.

### C. NestJS Backend Guidelines
- Tuân thủ cấu trúc Clean Architecture theo module: `Controller -> Service -> Repository / Data Provider`.
- Validate toàn bộ payload đầu vào bằng DTO với ValidationPipe.
- Xử lý lỗi tập trung qua Exception Filters, không để lộ thông tin nhạy cảm của hệ thống ra ngoài.

---

## 3. Các tác tử và kỹ năng tích hợp (.agents)

- **Skills**: Nằm tại `.agents/skills/` gồm `tdd-workflow`, `e2e-testing`, `strategic-compact`, `skill-stocktake`,...
- **Agents**: Nằm tại `.agents/agents/` phục vụ các tác vụ chuyên biệt (review, architect, tdd guide, build error resolve).
