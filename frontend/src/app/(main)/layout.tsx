// src/app/layout.tsx

import "../globals.css";
import type { Metadata } from "next";
import MobileHeader from "./MobileHeader";

export const metadata: Metadata = {
  title: "BRIDGE CRF System",
  description: "PC optimized hospital input system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden">
      {/* Mobile Header */}
      <MobileHeader />
      {/* Sidebar */}
      <aside className="hidden md:flex w-[240px] bg-[#2b362c] text-white p-6 flex-col gap-4">
        <h1 className="text-xl font-bold mb-8">BRIDGE</h1>
        <nav className="flex flex-col gap-4">
          <a href="/new" className="hover:underline">New Patient</a>
          <a href="/follow-up" className="hover:underline">Follow-up</a>
          <a href="/db" className="hover:underline">Database</a>
          <a href="/clinical-photo" className="hover:underline">Clinical Photo</a>
        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#f5f5f5] p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
