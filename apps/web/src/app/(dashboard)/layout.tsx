"use client";

import { ReactNode, useState } from "react";
import { DashboardSidebar } from "@/features/dashboard/components/layouts/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/components/layouts/dashboard-topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row antialiased">
      {/* Desktop Sidebar (cố định bên trái) */}
      <div className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        <DashboardSidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10 animate-in slide-in-from-left duration-200">
            <DashboardSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
