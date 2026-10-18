import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type { JournalEntity } from '../src/modules/journals/entities/journal.entity.js';

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

const SAMPLE_JOURNALS = [
  {
    title: 'A peaceful morning at the coffee shop',
    writtenDate: '2026-10-17',
    mood: 'peaceful' as const,
    weather: 'sunny' as const,
    isFavorite: true,
    tags: ['daily', 'coffee', 'weekend'],
    wordCount: 88,
    content:
      'Today was such a refreshing Saturday morning. I woke up around 7:30 AM and decided to visit my favorite small coffee shop down the street. The weather was breezy and sunny. I ordered an iced latte and sat near the wooden window. I spent almost two hours reading an English novel and watching people walk by. Moments like this give me so much calm energy to recharge before a busy working week starts.',
    aiAnalysis: {
      overallScore: 92,
      cefrEstimate: 'B2' as const,
      encouragement:
        'Bài viết rất giàu hình ảnh và ngữ điệu tự nhiên! Bạn sử dụng từ vựng miêu tả không gian rất tinh tế.',
      strengths: [
        'Cách dùng tính từ cảm xúc (refreshing, breezy, calm energy) rất tự nhiên.',
        'Cấu trúc câu phức và mệnh đề quan hệ kết hợp nhịp nhàng.',
      ],
      feedbackList: [
        {
          id: 'fb-1',
          originalText: 'give me so much calm energy',
          suggestedText: 'bring me a profound sense of tranquility',
          explanation:
            "Cụm 'calm energy' hoàn toàn đúng nghĩa đời thường, bạn có thể thử 'sense of tranquility' để câu văn mang chất tự sự văn học hơn.",
          type: 'vocabulary' as const,
        },
      ],
      analyzedAt: new Date('2026-10-17T08:30:00Z'),
    },
  },
  {
    title: 'First time speaking English in team meeting',
    writtenDate: '2026-10-15',
    mood: 'energetic' as const,
    weather: 'cloudy' as const,
    isFavorite: false,
    tags: ['work', 'speaking', 'challenge'],
    wordCount: 74,
    content:
      'This afternoon I had a presentation in front of our foreign partners. At first, my heart was beat very fast and I felt nervous. But after the first two slides, I remembered to breathe slowly. Everyone listened attentive and gave positive feedback on my product demo. I realized that making small mistakes is totally okay as long as people understand my message.',
    aiAnalysis: {
      overallScore: 84,
      cefrEstimate: 'B1' as const,
      encouragement:
        'Chúc mừng bạn đã vượt qua nỗi sợ thuyết trình! Ý tứ rõ ràng và mạch lạc.',
      strengths: [
        'Sử dụng liên từ nối rất tốt (At first, But after, As long as).',
        'Thông điệp tích cực và tự tin.',
      ],
      feedbackList: [
        {
          id: 'fb-2',
          originalText: 'my heart was beat very fast',
          suggestedText: 'my heart was beating very fast',
          explanation:
            "Quá khứ tiếp diễn của 'beat' cần thêm đuôi -ing: 'was beating'.",
          type: 'grammar' as const,
        },
        {
          id: 'fb-3',
          originalText: 'listened attentive',
          suggestedText: 'listened attentively',
          explanation:
            "Cần dùng trạng từ (adverb) 'attentively' để bổ nghĩa cho động từ 'listened'.",
          type: 'grammar' as const,
        },
      ],
      analyzedAt: new Date('2026-10-15T15:45:00Z'),
    },
  },
  {
    title: 'Cooking dinner with my younger sister',
    writtenDate: '2026-10-12',
    mood: 'happy' as const,
    weather: 'rainy' as const,
    isFavorite: true,
    tags: ['family', 'cooking'],
    wordCount: 65,
    content:
      'It was raining heavily outside so we decided to cook homemade pasta together. The kitchen was quite messy with flour everywhere, but the pasta tasted surprisingly delicious. Cooking with family always reminds me of simple happiness. We talked about her school projects and laughed a lot.',
    aiAnalysis: {
      overallScore: 95,
      cefrEstimate: 'B2' as const,
      encouragement:
        'Một đoạn văn ấm áp, câu văn gãy gọn và gần như không có lỗi sai nào!',
      strengths: [
        'Ngữ pháp chuẩn xác 100%.',
        "Dùng từ 'surprisingly delicious' và 'reminds me of' rất tự nhiên.",
      ],
      feedbackList: [],
      analyzedAt: new Date('2026-10-12T19:20:00Z'),
    },
  },
];

async function runSeed() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Sử dụng:
  pnpm --filter @repo/api seed:journal [targetEmailOrUid]

Ví dụ:
  pnpm --filter @repo/api seed:journal
  pnpm --filter @repo/api seed:journal admin@popago.com
  pnpm --filter @repo/api seed:journal <firebase-user-uid>
`);
    return;
  }

  const app = initFirebase();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  let targetUid = args[0] || process.env.ADMIN_EMAIL || 'admin@popago.com';

  // Nếu tham số truyền vào là email, tìm uid từ email đó
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
        console.error(`Không tìm thấy user với email: ${targetUid}. Hãy chạy seed:admin trước hoặc truyền đúng email/UID.`);
        process.exit(1);
      }
    }
  }

  console.log(`--- SEED DỮ LIỆU MẪU NHẬT KÝ CHO USER: ${targetUid} ---`);

  const journalsCollection = firestore.collection('journals');

  for (const [index, sample] of SAMPLE_JOURNALS.entries()) {
    const docId = `sample-journal-${targetUid.slice(0, 5)}-${index + 1}`;
    const now = new Date();

    const entryData: Omit<JournalEntity, 'id'> = {
      userId: targetUid,
      title: sample.title,
      content: sample.content,
      wordCount: sample.wordCount,
      mood: sample.mood,
      weather: sample.weather,
      writtenDate: sample.writtenDate,
      isFavorite: sample.isFavorite,
      tags: sample.tags,
      aiAnalysis: sample.aiAnalysis,
      createdAt: now as any,
      updatedAt: now as any,
    };

    await journalsCollection.doc(docId).set({
      ...entryData,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log(`✓ Đã tạo bài nhật ký [${docId}]: "${sample.title}" (${sample.writtenDate})`);
  }

  console.log('----------------------------------------------------');
  console.log(`Hoàn thành seed 3 bài nhật ký mẫu cho user: ${targetUid}`);
  console.log('Bạn có thể gọi API: GET /journals với Bearer token của user này để xem kết quả.');
  console.log('----------------------------------------------------');
}

runSeed().catch((err) => {
  console.error('Lỗi khi seed journal:', err);
  process.exit(1);
});
