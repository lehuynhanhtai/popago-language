# Database Schema (Hiện tại)

Hệ thống hiện tại sử dụng **Firestore** và có bảng (collection) sau đang hoạt động trong mã nguồn:

```prisma
datasource db {
  provider = "firestore"
}

enum UserRole {
  student
  teacher
  admin
}

enum EnglishLevel {
  beginner
  intermediate
  advanced
}

enum AccountStatus {
  active
  suspended
  deleted
}

<!-- dùng để lưu các cài đặt của user -->
type LearningPreferences {
  targetLevel      EnglishLevel  @default(beginner)
  dailyGoalMinutes Int           @default(15)
  reminderEnabled  Boolean       @default(false)
  reminderTime     String?
}

<!-- dùng để lưu các thống kê của user -->
type UserStats {
  streakDays            Int     @default(0)
  lastActiveDate        String? // Định dạng YYYY-MM-DD
  totalXp               Int     @default(0)
  wordsLearnedCount     Int     @default(0)
  lessonsCompletedCount Int     @default(0)
}


<!-- dùng để test kết nối đến db -->
model HealthCheck {
  id        String   @id // Document ID: "connection-test"
  timestamp DateTime
  status    String

  @@map("_healthcheck")
}

<!-- bảng user chính -->
model User {
  id          String              @id // Khớp với Firebase Auth UID
  email       String              @unique
  displayName String
  avatarUrl   String?
  role        UserRole            @default(student)
  status      AccountStatus       @default(active)
  preferences LearningPreferences
  stats       UserStats
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt

  @@map("users")
  @@index([role, createdAt(sort: Desc)])
  @@index([status, createdAt(sort: Desc)])
  @@index([role, status, createdAt(sort: Desc)])
  @@index([role, stats.totalXp(sort: Desc)])
  @@index([role, stats.streakDays(sort: Desc)])
}

<!-- ============================================ -->
<!-- BẮT ĐẦU: SCHEMA CHO TÍNH NĂNG NHẬT KÝ TIẾNG ANH -->
<!-- ============================================ -->

enum JournalMood {
  happy
  peaceful
  grateful
  thoughtful
  energetic
  tired
  sad
}

enum JournalWeather {
  sunny
  cloudy
  rainy
  windy
  snowy
}

enum FeedbackType {
  grammar
  vocabulary
  natural_expression
}

enum CefrLevel {
  A1
  A2
  B1
  B2
  C1
}

<!-- một mục sửa lỗi trong bút phê AI -->
type AiFeedbackItem {
  id            String
  originalText  String
  suggestedText String
  explanation   String
  type          FeedbackType
}

<!-- kết quả phân tích AI cho từng bài nhật ký -->
type JournalAiAnalysis {
  overallScore  Int              // 0 - 100 điểm
  cefrEstimate  CefrLevel        // A1, A2, B1, B2, C1
  encouragement String           // Lời khích lệ từ AI
  strengths     String[]         // Danh sách điểm mạnh
  feedbackList  AiFeedbackItem[] // Danh sách sửa lỗi câu
  analyzedAt    DateTime         @default(now())
}

<!-- bảng nhật ký học viên -->
model Journal {
  id          String             @id
  userId      String             // Khớp với User.id (Firebase Auth UID)
  title       String
  content     String
  wordCount   Int
  mood        JournalMood        @default(happy)
  weather     JournalWeather     @default(sunny)
  writtenDate String             // Định dạng YYYY-MM-DD
  isFavorite  Boolean            @default(false)
  tags        String[]           @default([])
  aiAnalysis  JournalAiAnalysis?
  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt

  @@map("journals")
  @@index([userId, writtenDate(sort: Desc)])
  @@index([userId, createdAt(sort: Desc)])
  @@index([userId, writtenDate(sort: Desc), createdAt(sort: Desc)])
  @@index([userId, isFavorite, writtenDate(sort: Desc), createdAt(sort: Desc)])
  @@index([userId, mood, writtenDate(sort: Desc), createdAt(sort: Desc)])
  @@index([userId, weather, writtenDate(sort: Desc), createdAt(sort: Desc)])
  @@index([userId, isFavorite, mood, writtenDate(sort: Desc), createdAt(sort: Desc)])
  @@index([userId, tags, writtenDate(sort: Desc), createdAt(sort: Desc)])
}
```
