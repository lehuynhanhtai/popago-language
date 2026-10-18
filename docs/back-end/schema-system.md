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
}
```
