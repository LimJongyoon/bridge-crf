// src/app/layout.tsx 또는 layout.ts

"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/";

  return (
    <html lang="en">
      <body>
        {isLoginPage ? (
          // 로그인 페이지는 사이드바 없이 전체 children만 렌더
          <>{children}</>
        ) : (
          // 로그인 외 페이지는 사이드바 포함
          <div className="flex h-screen w-screen overflow-hidden">
            <aside className="w-[240px] bg-[#2b362c] text-white p-6 flex flex-col gap-4">
              <h1 className="text-xl font-bold mb-8">BRIDGE</h1>
              <nav className="flex flex-col gap-4">
                <a href="/new" className="hover:underline">New Patient</a>
                <a href="/follow-up" className="hover:underline">Follow-up</a>
                <a href="/db" className="hover:underline">Database</a>
              </nav>
            </aside>
            <main className="flex-1 bg-[#f5f5f5] p-8 overflow-auto">{children}</main>
          </div>
        )}
      </body>
    </html>
  );
}
