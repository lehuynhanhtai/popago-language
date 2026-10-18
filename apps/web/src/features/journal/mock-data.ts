import type { MockJournalEntry } from "./types";

export const MOCK_JOURNAL_ENTRIES: MockJournalEntry[] = [
  {
    id: "entry-1",
    title: "A peaceful morning at the coffee shop",
    writtenDate: "2026-10-17",
    mood: "peaceful",
    weather: "sunny",
    isFavorite: true,
    tags: ["daily", "coffee", "weekend"],
    wordCount: 88,
    content:
      "Today was such a refreshing Saturday morning. I woke up around 7:30 AM and decided to visit my favorite small coffee shop down the street. The weather was breezy and sunny. I ordered an iced latte and sat near the wooden window. I spent almost two hours reading an English novel and watching people walk by. Moments like this give me so much calm energy to recharge before a busy working week starts.",
    aiAnalysis: {
      overallScore: 92,
      cefrEstimate: "B2",
      encouragement:
        "Bài viết rất giàu hình ảnh và ngữ điệu tự nhiên! Bạn sử dụng từ vựng miêu tả không gian rất tinh tế.",
      strengths: [
        "Cách dùng tính từ cảm xúc (refreshing, breezy, calm energy) rất tự nhiên.",
        "Cấu trúc câu phức và mệnh đề quan hệ kết hợp nhịp nhàng.",
      ],
      feedbackList: [
        {
          id: "fb-1",
          originalText: "give me so much calm energy",
          suggestedText: "bring me a profound sense of tranquility",
          explanation:
            "Cụm 'calm energy' hoàn toàn đúng nghĩa đời thường, bạn có thể thử 'sense of tranquility' để câu văn mang chất tự sự văn học hơn.",
          type: "vocabulary",
        },
      ],
    },
  },
  {
    id: "entry-2",
    title: "First time speaking English in team meeting",
    writtenDate: "2026-10-15",
    mood: "energetic",
    weather: "cloudy",
    isFavorite: false,
    tags: ["work", "speaking", "challenge"],
    wordCount: 74,
    content:
      "This afternoon I had a presentation in front of our foreign partners. At first, my heart was beat very fast and I felt nervous. But after the first two slides, I remembered to breathe slowly. Everyone listened attentive and gave positive feedback on my product demo. I realized that making small mistakes is totally okay as long as people understand my message.",
    aiAnalysis: {
      overallScore: 84,
      cefrEstimate: "B1",
      encouragement:
        "Chúc mừng bạn đã vượt qua nỗi sợ thuyết trình! Ý tứ rõ ràng và mạch lạc.",
      strengths: [
        "Sử dụng liên từ nối rất tốt (At first, But after, As long as).",
        "Thông điệp tích cực và tự tin.",
      ],
      feedbackList: [
        {
          id: "fb-2",
          originalText: "my heart was beat very fast",
          suggestedText: "my heart was beating very fast",
          explanation:
            "Quá khứ tiếp diễn của 'beat' cần thêm đuôi -ing: 'was beating'.",
          type: "grammar",
        },
        {
          id: "fb-3",
          originalText: "listened attentive",
          suggestedText: "listened attentively",
          explanation:
            "Cần dùng trạng từ (adverb) 'attentively' để bổ nghĩa cho động từ 'listened'.",
          type: "grammar",
        },
      ],
    },
  },
  {
    id: "entry-3",
    title: "Cooking dinner with my younger sister",
    writtenDate: "2026-10-12",
    mood: "happy",
    weather: "rainy",
    isFavorite: true,
    tags: ["family", "cooking"],
    wordCount: 65,
    content:
      "It was raining heavily outside so we decided to cook homemade pasta together. The kitchen was quite messy with flour everywhere, but the pasta tasted surprisingly delicious. Cooking with family always reminds me of simple happiness. We talked about her school projects and laughed a lot.",
    aiAnalysis: {
      overallScore: 95,
      cefrEstimate: "B2",
      encouragement:
        "Một đoạn văn ấm áp, câu văn gãy gọn và gần như không có lỗi sai nào!",
      strengths: ["Ngữ pháp chuẩn xác 100%.", "Dùng từ 'surprisingly delicious' và 'reminds me of' rất tự nhiên."],
      feedbackList: [],
    },
  },
];
