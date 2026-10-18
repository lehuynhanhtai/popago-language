import { JournalNotebook } from "@/features/journal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nhật ký Tiếng Anh | Popago Language",
  description: "Luyện viết nhật ký tiếng Anh mỗi ngày và nhận phản hồi tức thì từ AI",
};

export default function JournalPage() {
  return <JournalNotebook />;
}
