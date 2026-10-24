import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type { VocabularyEntity } from '../src/modules/vocabularies/entities/vocabulary.entity.js';
import type { PartOfSpeech } from '@repo/shared';

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

interface SampleVocabularyItem {
  deckKey: string;
  word: string;
  phonetic: string;
  partOfSpeech: PartOfSpeech;
  meaningVi: string;
  definitionEn: string;
  isLearned: boolean;
  examples: Array<{ sentence: string; translationVi: string }>;
}

export const SAMPLE_VOCABULARIES: SampleVocabularyItem[] = [
  // 1. IELTS Speaking C1
  {
    deckKey: 'ielts-speaking-c1',
    word: 'profound',
    phonetic: '/prəˈfaʊnd/',
    partOfSpeech: 'adjective',
    meaningVi: 'sâu sắc, uyên thâm, có ý nghĩa lớn',
    definitionEn: 'Very great or intense; having or showing great knowledge or insight.',
    isLearned: true,
    examples: [
      {
        sentence: 'Her books had a profound influence on modern educational philosophy.',
        translationVi: 'Những cuốn sách của cô ấy đã có tầm ảnh hưởng sâu sắc đến triết lý giáo dục hiện đại.',
      },
      {
        sentence: 'He experienced a profound sense of relief after passing the exam.',
        translationVi: 'Anh ấy cảm thấy nhẹ nhõm vô cùng sau khi vượt qua kỳ thi.',
      },
    ],
  },
  {
    deckKey: 'ielts-speaking-c1',
    word: 'resilience',
    phonetic: '/rɪˈzɪl.jəns/',
    partOfSpeech: 'noun',
    meaningVi: 'khả năng phục hồi, sự kiên cường',
    definitionEn: 'The capacity to recover quickly from difficulties; toughness.',
    isLearned: false,
    examples: [
      {
        sentence: 'The human capacity for resilience in traumatic circumstances is remarkable.',
        translationVi: 'Khả năng phục hồi của con người trong những nghịch cảnh đau buồn thật đáng kinh ngạc.',
      },
    ],
  },
  {
    deckKey: 'ielts-speaking-c1',
    word: 'articulate',
    phonetic: '/ɑːˈtɪk.jə.lət/',
    partOfSpeech: 'adjective',
    meaningVi: 'nói năng lưu loát, diễn đạt mạch lạc',
    definitionEn: 'Having or showing the ability to speak fluently and coherently.',
    isLearned: false,
    examples: [
      {
        sentence: 'She gave an articulate and persuasive presentation on climate change.',
        translationVi: 'Cô ấy đã trình bày một bài thuyết trình lưu loát và đầy sức thuyết phục về biến đổi khí hậu.',
      },
    ],
  },

  // 2. Tech & Workplace English
  {
    deckKey: 'tech-office',
    word: 'bottleneck',
    phonetic: '/ˈbɒt.əl.nek/',
    partOfSpeech: 'noun',
    meaningVi: 'điểm nghẽn, nút thắt cổ chai làm chậm tiến độ',
    definitionEn: 'A point of congestion in a system that occurs when workloads arrive too quickly.',
    isLearned: true,
    examples: [
      {
        sentence: 'Database query latency was the main bottleneck causing API slowdowns.',
        translationVi: 'Độ trễ truy vấn cơ sở dữ liệu chính là điểm nghẽn chính làm chậm hệ thống API.',
      },
    ],
  },
  {
    deckKey: 'tech-office',
    word: 'streamline',
    phonetic: '/ˈstriːm.laɪn/',
    partOfSpeech: 'verb',
    meaningVi: 'tinh gọn hóa, tối ưu hóa quy trình',
    definitionEn: 'To make an organization or system more efficient by employing faster or simpler working methods.',
    isLearned: false,
    examples: [
      {
        sentence: 'We implemented CI/CD pipelines to streamline our release workflow.',
        translationVi: 'Chúng tôi triển khai các pipeline CI/CD nhằm tinh gọn quy trình phát hành sản phẩm.',
      },
    ],
  },
  {
    deckKey: 'tech-office',
    word: 'standup',
    phonetic: '/ˈstænd.ʌp/',
    partOfSpeech: 'noun',
    meaningVi: 'cuộc họp ngắn đầu ngày trong mô hình Agile Scrum',
    definitionEn: 'A short daily meeting in which team members quickly share updates on their tasks and blockers.',
    isLearned: true,
    examples: [
      {
        sentence: 'Let us discuss this architectural blocker during the morning standup.',
        translationVi: 'Hãy cùng thảo luận vấn đề kiến trúc này trong buổi họp standup sáng nay.',
      },
    ],
  },

  // 3. Daily Conversational & Slang
  {
    deckKey: 'daily-slang',
    word: 'chill out',
    phonetic: '/tʃɪl aʊt/',
    partOfSpeech: 'phrase',
    meaningVi: 'thư giãn, bình tĩnh lại, xả stress',
    definitionEn: 'To relax completely or not allow things to upset you.',
    isLearned: false,
    examples: [
      {
        sentence: 'We decided to chill out by the lake after a demanding work week.',
        translationVi: 'Chúng tôi quyết định thư giãn bên bờ hồ sau một tuần làm việc căng thẳng.',
      },
    ],
  },
  {
    deckKey: 'daily-slang',
    word: 'under the weather',
    phonetic: '/ˈʌn.dər ðə ˈweð.ər/',
    partOfSpeech: 'idiom',
    meaningVi: 'hơi mệt mỏi, không được khỏe trong người',
    definitionEn: 'Slightly unwell or in low spirits.',
    isLearned: true,
    examples: [
      {
        sentence: 'I was feeling a bit under the weather yesterday, so I took a short nap.',
        translationVi: 'Hôm qua tôi cảm thấy hơi mệt trong người nên đã chợp mắt một lát.',
      },
    ],
  },
];

async function runSeed() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Sử dụng:
  pnpm --filter @repo/api seed:vocabularies [targetEmailOrUid]

Lưu ý:
  Nên chạy 'pnpm --filter @repo/api seed:decks' trước để tạo sẵn các bộ từ (decks) cần thiết.

Ví dụ:
  pnpm --filter @repo/api seed:vocabularies
  pnpm --filter @repo/api seed:vocabularies admin@popago.com
  pnpm --filter @repo/api seed:vocabularies <firebase-user-uid>
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

  console.log(`--- SEED DỮ LIỆU MẪU VOCABULARIES CHO USER: ${targetUid} ---`);

  // Lấy các decks hiện có của user
  const decksSnap = await firestore
    .collection('decks')
    .where('userId', '==', targetUid)
    .get();

  if (decksSnap.empty) {
    console.warn(`[Cảnh báo] User ${targetUid} chưa có bộ từ nào. Đang tạo deck mặc định trước...`);
  }

  // Map deckKey sang document ID
  const deckMap = new Map<string, string>();
  for (const doc of decksSnap.docs) {
    const data = doc.data();
    // Match theo pattern doc id sample-deck-<key>-... hoặc name
    for (const key of ['ielts-speaking-c1', 'tech-office', 'daily-slang']) {
      if (doc.id.includes(key) || data.name?.toLowerCase().includes(key.split('-')[0])) {
        deckMap.set(key, doc.id);
      }
    }
  }

  const vocabCollection = firestore.collection('vocabularies');
  const deckStats = new Map<string, { total: number; learned: number }>();

  for (const item of SAMPLE_VOCABULARIES) {
    let deckId = deckMap.get(item.deckKey);

    // Nếu chưa có deck tương ứng, gán vào deckId fallback
    if (!deckId) {
      deckId = `sample-deck-${item.deckKey}-${targetUid.slice(0, 5)}`;
      deckMap.set(item.deckKey, deckId);
    }

    const docId = `sample-vocab-${item.word.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${targetUid.slice(0, 5)}`;
    const now = new Date();

    const vocabData: Omit<VocabularyEntity, 'id'> = {
      deckId,
      userId: targetUid,
      word: item.word,
      phonetic: item.phonetic,
      partOfSpeech: item.partOfSpeech,
      meaningVi: item.meaningVi,
      definitionEn: item.definitionEn,
      examples: item.examples,
      isLearned: item.isLearned,
      createdAt: now as any,
      updatedAt: now as any,
    };

    await vocabCollection.doc(docId).set(
      {
        ...vocabData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    // Tính toán lại stats cho deck
    const current = deckStats.get(deckId) || { total: 0, learned: 0 };
    current.total += 1;
    if (item.isLearned) current.learned += 1;
    deckStats.set(deckId, current);

    console.log(`✓ Đã tạo từ vựng [${docId}]: "${item.word}" (${item.partOfSpeech}) -> deck: ${deckId}`);
  }

  // Cập nhật lại totalWords & learnedWords cho từng deck
  for (const [deckId, stats] of deckStats.entries()) {
    try {
      await firestore.collection('decks').doc(deckId).set(
        {
          totalWords: stats.total,
          learnedWords: stats.learned,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      console.log(`⚡ Cập nhật thống kê bộ từ [${deckId}]: ${stats.total} từ (${stats.learned} đã thuộc)`);
    } catch {
      // Bỏ qua nếu deck chưa tồn tại
    }
  }

  console.log('----------------------------------------------------');
  console.log(`Hoàn thành seed ${SAMPLE_VOCABULARIES.length} thẻ từ vựng mẫu cho user: ${targetUid}`);
  console.log('Bạn có thể gọi API: GET /decks/:deckId/vocabularies để xem danh sách.');
  console.log('----------------------------------------------------');
}

runSeed().catch((err) => {
  console.error('Lỗi khi seed vocabularies:', err);
  process.exit(1);
});
