import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type { DeckEntity } from '../src/modules/decks/entities/deck.entity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
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

export const SAMPLE_DECKS = [
  {
    key: 'ielts-speaking-c1',
    name: 'IELTS Speaking C1 - Collocations & Idioms',
    description: 'Tổng hợp các cụm từ đắt giá giúp nâng band Lexical Resource cho bài nói IELTS.',
    themeColor: '#10b981',
    icon: '🎙️',
    tags: ['ielts', 'speaking', 'advanced', 'collocations'],
    totalWords: 0,
    learnedWords: 0,
  },
  {
    key: 'tech-office',
    name: 'Tech & Workplace English',
    description: 'Từ vựng tiếng Anh hàng ngày trong môi trường làm việc công nghệ thông tin và Agile Scrum.',
    themeColor: '#3b82f6',
    icon: '💻',
    tags: ['work', 'technology', 'communication'],
    totalWords: 0,
    learnedWords: 0,
  },
  {
    key: 'daily-slang',
    name: 'Daily Conversational & Slang',
    description: 'Các từ lóng, cụm từ giao tiếp đời thường phổ biến của người bản xứ Anh - Mỹ.',
    themeColor: '#f59e0b',
    icon: '☕',
    tags: ['daily', 'slang', 'conversational'],
    totalWords: 0,
    learnedWords: 0,
  },
];

async function runSeed() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Sử dụng:
  pnpm --filter @repo/api seed:decks [targetEmailOrUid]

Ví dụ:
  pnpm --filter @repo/api seed:decks
  pnpm --filter @repo/api seed:decks admin@popago.com
  pnpm --filter @repo/api seed:decks <firebase-user-uid>
`);
    return;
  }

  const app = initFirebase();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  let targetUid = args[0] || process.env.ADMIN_EMAIL || 'admin@popago.com';

  if (targetUid.includes('@')) {
    try {
      const userRecord = await auth.getUserByEmail(targetUid);
      targetUid = userRecord.uid;
      console.log(`[Firebase Auth] Tìm thấy user '${args[0] || 'admin@popago.com'}' có UID: ${targetUid}`);
    } catch {
      console.log(`[Firebase Auth] Chưa tìm thấy tài khoản '${targetUid}'. Đang kiểm tra collection users...`);
      const userSnap = await firestore
        .collection('users')
        .where('email', '==', targetUid.toLowerCase().trim())
        .limit(1)
        .get();

      if (!userSnap.empty && userSnap.docs[0]) {
        targetUid = userSnap.docs[0].id;
        console.log(`[Firestore] Tìm thấy user UID trong collection users: ${targetUid}`);
      } else {
        console.error(`Không tìm thấy user với email: ${targetUid}. Hãy tạo user trước hoặc truyền đúng email/UID.`);
        process.exit(1);
      }
    }
  }

  console.log(`--- SEED DỮ LIỆU MẪU DECKS CHO USER: ${targetUid} ---`);

  const decksCollection = firestore.collection('decks');

  for (const sample of SAMPLE_DECKS) {
    const docId = `sample-deck-${sample.key}-${targetUid.slice(0, 5)}`;
    const now = new Date();

    const deckData: Omit<DeckEntity, 'id'> = {
      userId: targetUid,
      name: sample.name,
      description: sample.description,
      themeColor: sample.themeColor,
      icon: sample.icon,
      tags: sample.tags,
      totalWords: sample.totalWords,
      learnedWords: sample.learnedWords,
      createdAt: now as any,
      updatedAt: now as any,
    };

    await decksCollection.doc(docId).set(
      {
        ...deckData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    console.log(`✓ Đã tạo bộ từ [${docId}]: ${sample.icon} ${sample.name}`);
  }

  console.log('----------------------------------------------------');
  console.log(`Hoàn thành seed ${SAMPLE_DECKS.length} bộ từ vựng mẫu cho user: ${targetUid}`);
  console.log('Bạn có thể gọi API: GET /decks để xem danh sách.');
  console.log('----------------------------------------------------');
}

runSeed().catch((err) => {
  console.error('Lỗi khi seed decks:', err);
  process.exit(1);
});
