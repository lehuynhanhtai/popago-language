"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type DialogKind = "dialog" | "alertdialog";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Tên đọc được của dialog — dùng cho aria-label, phải trùng tiêu đề nhìn thấy. */
  title: string;
  /** id của đoạn mô tả cảnh báo/nội dung phụ (tuỳ chọn). */
  descriptionId?: string;
  /** "alertdialog" cho hành động phá huỷ (xoá). */
  kind?: DialogKind;
  /** Class áp lên chính thẻ <dialog>, ghi đè mặc định. */
  panelClassName?: string;
  closeOnBackdrop?: boolean;
  children: ReactNode;
}

/**
 * Dialog dùng thẻ <dialog> native + showModal():
 * trình duyệt lo top-layer, inert nền, focus trap, Escape và trả focus về nơi mở.
 * Không cần thư viện ngoài, không tự viết focus trap.
 */
export function Dialog({
  open,
  onClose,
  title,
  descriptionId,
  kind = "dialog",
  panelClassName,
  closeOnBackdrop = true,
  children,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  // Khoá scroll nền khi dialog mở (native dialog không tự khoá).
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      aria-describedby={descriptionId}
      role={kind}
      data-kind={kind}
      className={cn(
        "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto",
        "rounded-3xl border border-surface-container-high/80 bg-surface-container-lowest p-6",
        "text-on-surface shadow-2xl",
        panelClassName,
      )}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (!closeOnBackdrop) return;
        // Chỉ đóng khi click ra ngoài khung (::backdrop). Click vào phần padding
        // của panel vẫn nằm trong rect nên không đóng oan.
        const rect = event.currentTarget.getBoundingClientRect();
        const { clientX: x, clientY: y } = event;
        if (
          x < rect.left ||
          x > rect.right ||
          y < rect.top ||
          y > rect.bottom
        ) {
          onClose();
        }
      }}
    >
      {children}
    </dialog>
  );
}
