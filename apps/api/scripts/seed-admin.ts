import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env if present
const envPath = resolve(__dirname, '../.env');
if (existsSync(envPath) && typeof process.loadEnvFile === 'function') {
  process.loadEnvFile(envPath);
}

function initFirebase() {
  if (getApps().length > 0) {
    return getApp();
  }

  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    resolve(__dirname, '../service-account.json');

  if (existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    return initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
    });
  }

  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }

  throw new Error(
    'Không tìm thấy thông tin xác thực Firebase (service-account.json hoặc biến môi trường).',
  );
}

async function runSeed() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Sử dụng:
  pnpm --filter @repo/api seed:admin [email] [password] [displayName]

Ví dụ:
  pnpm --filter @repo/api seed:admin
  pnpm --filter @repo/api seed:admin admin@popago.com "123456" "System Admin"
`);
    return;
  }

  const email = (args[0] || process.env.ADMIN_EMAIL || 'admin@popago.com').toLowerCase().trim();
  const password = args[1] || process.env.ADMIN_PASSWORD || '123456';
  const displayName = args[2] || process.env.ADMIN_NAME || 'System Admin';

  console.log('--- KHỞI TẠO TÀI KHOẢN ADMIN ---');
  console.log(`Email       : ${email}`);
  console.log(`Tên hiển thị: ${displayName}`);

  const app = initFirebase();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  let uid: string;

  try {
    const existingAuthUser = await auth.getUserByEmail(email);
    uid = existingAuthUser.uid;
    console.log(`[Firebase Auth] Tài khoản đã tồn tại với UID: ${uid}`);
    if (args[1]) {
      await auth.updateUser(uid, { password, displayName });
      console.log('[Firebase Auth] Đã cập nhật mật khẩu và tên hiển thị.');
    }
  } catch (error: any) {
    if (error?.code === 'auth/user-not-found') {
      const newUser = await auth.createUser({
        email,
        password,
        displayName,
      });
      uid = newUser.uid;
      console.log(`[Firebase Auth] Đã tạo tài khoản mới với UID: ${uid}`);
    } else {
      console.error('[Firebase Auth] Lỗi kiểm tra tài khoản:', error.message || error);
      process.exit(1);
    }
  }

  // Cập nhật Firestore document users/{uid}
  const userDocRef = firestore.collection('users').doc(uid);
  const userDoc = await userDocRef.get();

  const now = new Date();
  const adminData = {
    email,
    displayName,
    avatarUrl: null,
    role: 'admin',
    status: 'active',
    preferences: {
      targetLevel: 'advanced',
      dailyGoalMinutes: 30,
      reminderEnabled: false,
    },
    stats: {
      streakDays: 0,
      lastActiveDate: null,
      totalXp: 0,
      wordsLearnedCount: 0,
      lessonsCompletedCount: 0,
    },
    updatedAt: now,
    ...(userDoc.exists ? {} : { createdAt: now }),
  };

  await userDocRef.set(adminData, { merge: true });
  console.log(`[Firestore] Đã gán role="admin" cho document users/${uid}`);
  console.log('----------------------------------------------------');
  console.log('Hoàn thành! Bạn có thể đăng nhập bằng thông tin:');
  console.log(`- Email   : ${email}`);
  console.log(`- Password: ${password}`);
  console.log('----------------------------------------------------');
}

runSeed().catch((err) => {
  console.error('Lỗi khi seed admin:', err);
  process.exit(1);
});
