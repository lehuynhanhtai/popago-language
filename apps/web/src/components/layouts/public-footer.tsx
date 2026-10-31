import Link from "next/link";
import { FiHeart, FiGithub, FiGlobe, FiSmile } from "react-icons/fi";

export function PublicFooter() {
  return (
    <footer className="bg-surface-container-low w-full rounded-t-[3rem] mt-24 border-t border-surface-container-high/50">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand & Sứ mệnh */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary font-headline font-black text-lg">
              P
            </div>
            <span className="text-2xl font-black text-primary font-headline tracking-tight">
              PoPaGo
            </span>
          </div>
          <p className="text-on-surface-variant text-sm max-w-md leading-relaxed">
            Dự án giáo dục phi lợi nhuận với mục tiêu xoá bỏ rào cản chi phí học tiếng Anh. 
            Mọi bài học, thử thách và tính năng đều miễn phí 100% trọn đời dành cho tất cả mọi người.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary mt-2">
            <FiHeart className="text-error" /> Được xây dựng với tình yêu dành cho cộng đồng học tiếng Anh
          </div>
        </div>

        {/* Khu vui chơi */}
        <div>
          <h4 className="font-headline font-bold text-xs uppercase tracking-widest text-primary mb-4">
            Khu Vui Chơi
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm text-on-surface-variant">
            <li>
              <Link href="#zones" className="hover:text-primary transition-colors">
                Đấu trường phát âm
              </Link>
            </li>
            <li>
              <Link href="#zones" className="hover:text-primary transition-colors">
                Vũ trụ từ vựng 3D
              </Link>
            </li>
            <li>
              <Link href="#zones" className="hover:text-primary transition-colors">
                Chinh phục ngữ pháp
              </Link>
            </li>
            <li>
              <Link href="#zones" className="hover:text-primary transition-colors">
                Luyện nghe phản xạ
              </Link>
            </li>
          </ul>
        </div>

        {/* Nền tảng */}
        <div>
          <h4 className="font-headline font-bold text-xs uppercase tracking-widest text-primary mb-4">
            Cộng Đồng & Sứ Mệnh
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm text-on-surface-variant">
            <li>
              <Link href="#mission" className="hover:text-primary transition-colors">
                Vì sao chúng tôi miễn phí?
              </Link>
            </li>
            <li>
              <Link href="#gamified" className="hover:text-primary transition-colors">
                Phương pháp game hóa
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-primary transition-colors">
                Tạo tài khoản học viên
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-primary transition-colors">
                Đăng nhập học tiếp
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-surface-container-high/60 max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-on-surface-variant gap-4">
        <div>
          © {new Date().getFullYear()} PoPaGo Language. Nền tảng học tiếng Anh miễn phí vì cộng đồng.
        </div>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1 text-secondary">
            <FiSmile /> Học vui • Nhớ lâu • Không tốn phí
          </span>
        </div>
      </div>
    </footer>
  );
}
