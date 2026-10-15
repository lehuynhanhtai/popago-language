"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX, FiGift, FiAward } from "react-icons/fi";

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/85 backdrop-blur-xl border-b border-surface-container-high/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Free Community Badge */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-on-primary font-headline font-black text-xl shadow-md group-hover:scale-105 group-hover:rotate-3 transition-transform">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-extrabold text-2xl tracking-tight text-primary">
                PoPaGo
              </span>
              <span className="text-[10px] font-headline font-bold text-secondary uppercase tracking-widest -mt-1">
                English Playground
              </span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container ml-2 animate-pulse">
              <FiGift className="text-xs" />
              100% Free
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#zones"
              className="font-headline font-bold text-sm tracking-tight text-on-surface-variant hover:text-primary transition-colors"
            >
              Khu vui chơi
            </Link>
            <Link
              href="#mission"
              className="font-headline font-bold text-sm tracking-tight text-on-surface-variant hover:text-primary transition-colors"
            >
              Sứ mệnh cộng đồng
            </Link>
            <Link
              href="#gamified"
              className="font-headline font-bold text-sm tracking-tight text-on-surface-variant hover:text-primary transition-colors"
            >
              Cách học như chơi
            </Link>
            <Link
              href="#testimonials"
              className="font-headline font-bold text-sm tracking-tight text-on-surface-variant hover:text-primary transition-colors"
            >
              Cộng đồng
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="font-headline font-bold text-sm tracking-tight text-on-surface hover:text-primary px-4 py-2.5 rounded-full hover:bg-surface-container transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-sm tracking-tight px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <FiAward className="text-base" />
              Bắt đầu miễn phí
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-container-high bg-surface-container-lowest/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <Link
            href="#zones"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-headline font-bold text-sm text-on-surface hover:text-primary"
          >
            Khu vui chơi
          </Link>
          <Link
            href="#mission"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-headline font-bold text-sm text-on-surface hover:text-primary"
          >
            Sứ mệnh cộng đồng
          </Link>
          <Link
            href="#gamified"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-headline font-bold text-sm text-on-surface hover:text-primary"
          >
            Cách học như chơi
          </Link>
          <Link
            href="#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-headline font-bold text-sm text-on-surface hover:text-primary"
          >
            Cộng đồng
          </Link>
          <div className="pt-3 border-t border-surface-container flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 font-headline font-bold text-sm rounded-full bg-surface-container text-on-surface"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 font-headline font-bold text-sm rounded-full bg-primary text-on-primary shadow-md"
            >
              Bắt đầu miễn phí
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
