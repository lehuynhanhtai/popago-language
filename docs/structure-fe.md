# Cấu trúc thư mục Frontend (`apps/web`)

Dự án sử dụng mô hình **Feature-Driven Architecture** kết hợp **Route Groups** trên Next.js App Router.

```text
apps/web/
├── public/                     # Static assets (images, icons, fonts)
├── src/
│   ├── app/                    # Chỉ xử lý Routing, Layouts, Server Pages
│   │   ├── (public)/           # Layout 1: Landing page, giới thiệu, blog
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── (auth)/             # Layout 2: Đăng nhập/Đăng ký (tối giản, căn giữa)
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   ├── (dashboard)/        # Layout 3: Giao diện chính (Sidebar + Topbar)
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── courses/page.tsx
│   │   │   └── profile/page.tsx
│   │   │
│   │   ├── (study)/            # Layout 4: Phòng học/Luyện thi (Fullscreen, focus mode)
│   │   │   ├── layout.tsx
│   │   │   └── lessons/[id]/page.tsx
│   │   │
│   │   ├── api/                # Next.js Route Handlers (BFF/Proxy nếu cần)
│   │   ├── globals.css         # Style toàn cục / Tailwind base
│   │   ├── layout.tsx          # Root Layout (chứa Providers, html, body)
│   │   ├── not-found.tsx       # 404 page
│   │   └── error.tsx           # Global error boundary
│   │
│   ├── components/             # UI Components dùng chung toàn web
│   │   ├── layouts/            # Sidebar, Header, Footer, Navigation
│   │   └── ui/                 # Nút bấm, modal, form input (nếu chưa tách sang @repo/ui)
│   │
│   ├── features/               # Module hóa theo từng nghiệp vụ (Domain-driven)
│   │   ├── auth/               # Nghiệp vụ xác thực
│   │   │   ├── components/     # LoginForm, RegisterForm,...
│   │   │   ├── hooks/          # useAuth, useSession,...
│   │   │   ├── services/       # authApi.ts
│   │   │   └── types/          # types nội bộ của feature auth
│   │   ├── course/             # Nghiệp vụ khóa học / bài giảng
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   └── flashcard/          # Nghiệp vụ từ vựng / flashcard
│   │
│   ├── hooks/                  # Custom hooks dùng chung (useMediaQuery, useDebounce,...)
│   ├── lib/                    # Cấu hình client (http-client, utils, env validation)
│   ├── providers/              # React Context Providers (ThemeProvider, QueryProvider,...)
│   └── types/                  # Types dùng riêng trong web (dùng chung FE-BE nằm ở @repo/shared)
│
├── next.config.js
├── package.json
└── tsconfig.json
```

