// src/app/(main)/MobileHeader.tsx
"use client";

import { useState } from "react";

export default function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* 모바일 상단 바 */}
      <div className="md:hidden bg-[#2b362c] text-white flex justify-between items-center px-4 py-3 shadow z-20">
        <h1 className="text-lg font-bold">BRIDGE</h1>
        <button
          className="text-white focus:outline-none"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          ☰
        </button>
      </div>

      {/* 햄버거 메뉴 */}
      {menuOpen && (
        <div className="md:hidden absolute top-12 left-0 w-full bg-[#2b362c] text-white p-4 z-10">
          <nav className="flex flex-col gap-3">
            <a href="/new" className="hover:underline" onClick={() => setMenuOpen(false)}>New Patient</a>
            <a href="/follow-up" className="hover:underline" onClick={() => setMenuOpen(false)}>Follow-up</a>
            <a href="/db" className="hover:underline" onClick={() => setMenuOpen(false)}>Database</a>
          </nav>
        </div>
      )}
    </>
  );
}
