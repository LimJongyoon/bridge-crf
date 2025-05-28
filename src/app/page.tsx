'use client';

import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:4000/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, birth }),
    });

    const data = await res.json();
    setMessage(data.message || '등록 완료');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">환자 등록</h1>
      <input
        type="text"
        placeholder="이름"
        className="border p-2 mb-2 w-full max-w-sm"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="생년월일 (예: 19900101)"
        className="border p-2 mb-4 w-full max-w-sm"
        value={birth}
        onChange={(e) => setBirth(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        등록하기
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </main>
  );
}
