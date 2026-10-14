# Cấu trúc thư mục Backend (`apps/api`)

Dự án sử dụng mô hình **Modular Architecture (NestJS)** kết hợp **Clean Architecture** (`Controller -> Service -> Repository`), tích hợp **Firebase Firestore** làm Database và **Cloudflare R2** làm File Storage (Audio/Image).

```text
apps/api/
├── src/
│   ├── common/                     # Tiện ích, middleware, guard dùng chung toàn app
│   │   ├── constants/              # Các hằng số (regex, error codes, pagination defaults)
│   │   ├── decorators/             # Custom decorators (@CurrentUser, @Roles, @Public)
│   │   ├── filters/                # Exception filters xử lý lỗi tập trung
│   │   │   ├── all-exceptions.filter.ts
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/                 # Bảo vệ route (FirebaseAuthGuard, RolesGuard)
│   │   ├── interceptors/           # Transform response, logging, metrics
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform-response.interceptor.ts
│   │   ├── pipes/                  # Custom pipes (ZodValidationPipe / CustomParseIntPipe)
│   │   └── utils/                  # Helper functions thuần túy
│   │
│   ├── config/                     # Cấu hình môi trường (.env) và tích hợp 3rd-party
│   │   ├── env.validation.ts       # Validate biến môi trường bằng Joi/Zod
│   │   ├── firebase.config.ts      # Config Firebase Admin credentials
│   │   └── r2.config.ts            # Config Cloudflare R2 S3 Client
│   │
│   ├── providers/                  # Module tích hợp dịch vụ hạ tầng (Infrastructure)
│   │   ├── firebase/               # Firebase Admin SDK & Firestore Connection
│   │   │   ├── firebase.module.ts
│   │   │   └── firestore.service.ts
│   │   └── storage/                # Cloudflare R2 Client (AWS S3 SDK)
│   │       ├── storage.module.ts
│   │       └── r2-storage.service.ts
│   │
│   ├── modules/                    # Module hóa theo từng nghiệp vụ (Domain-driven)
│   │   ├── auth/                   # Xác thực người dùng (verify Firebase ID Token)
│   │   │   ├── dto/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── users/                  # Quản lý hồ sơ học viên, cài đặt tài khoản
│   │   │   ├── dto/                # UpdateUserDto, UserResponseDto
│   │   │   ├── entities/           # User document schema trên Firestore
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts # Thao tác CRUD trực tiếp với collection 'users'
│   │   │   └── users.module.ts
│   │   │
│   │   ├── vocabularies/           # Nghiệp vụ từ vựng, flashcard, phát âm (Audio/IPA)
│   │   │   ├── dto/                # CreateWordDto, FilterWordDto
│   │   │   ├── entities/           # Vocabulary document schema
│   │   │   ├── vocabularies.controller.ts
│   │   │   ├── vocabularies.service.ts
│   │   │   ├── vocabularies.repository.ts
│   │   │   └── vocabularies.module.ts
│   │   │
│   │   ├── courses/                # Khóa học, bài học (Lessons), chủ đề (Topics)
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── courses.controller.ts
│   │   │   ├── courses.service.ts
│   │   │   ├── courses.repository.ts
│   │   │   └── courses.module.ts
│   │   │
│   │   ├── media/                  # Xử lý upload ảnh và file audio lên Cloudflare R2
│   │   │   ├── dto/                # GetPresignedUrlDto, UploadResponseDto
│   │   │   ├── media.controller.ts # Cấp Presigned URL hoặc nhận multipart/form-data
│   │   │   ├── media.service.ts    # Tương tác với R2StorageService
│   │   │   └── media.module.ts
│   │   │
│   │   └── study-progress/         # Tiến độ học tập, lịch sử luyện thi, thuật toán SRS
│   │       ├── dto/
│   │       ├── entities/
│   │       ├── study-progress.controller.ts
│   │       ├── study-progress.service.ts
│   │       ├── study-progress.repository.ts
│   │       └── study-progress.module.ts
│   │
│   ├── app.module.ts               # Root module kết nối Config, Providers và Modules
│   └── main.ts                     # Entrypoint (Setup CORS, Global Filters/Pipes, Swagger)
│
├── test/                           # E2E & Integration tests
│   ├── app.e2e-spec.ts
│   └── vitest.config.e2e.ts
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

---

## 3 Nguyên tắc kiến trúc quan trọng

1. **Phân tầng rõ ràng (`Controller -> Service -> Repository`)**:
   * **Controller**: Tiếp nhận request, routing, gắn Decorator phân quyền.
   * **Service**: Xử lý logic nghiệp vụ (business logic), validate logic tính điểm/học tập.
   * **Repository**: Đóng gói các câu truy vấn tới Firestore (`collection('...').where(...).get()`). Không để Service gọi trực tiếp Firebase SDK để dễ dàng mock test hoặc đổi DB sau này.

2. **Quản lý Media (Cloudflare R2)**:
   * **Module `media`** cung cấp endpoint cấp **Presigned URL**.
   * Client (Web Next.js) có thể upload file audio/ảnh trực tiếp từ trình duyệt lên Cloudflare R2 mà không cần đẩy file nặng qua server NestJS, giúp tiết kiệm RAM và băng thông cho backend.

3. **Bảo mật và Xác thực (Firebase Auth)**:
   * Client đăng nhập qua Firebase SDK ở Next.js và gửi `Bearer <idToken>` lên NestJS.
   * `FirebaseAuthGuard` tại NestJS verify token bằng `firebase-admin` và gắn user context vào `@CurrentUser()`.
