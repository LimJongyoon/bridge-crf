'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Logged in as ${form.username}`);
    router.push('/new');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-md w-full max-w-md text-gray-900"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="text-4xl font-bold text-[#2b362c] mb-1">BRIDGE</div>
          <div className="text-xs text-gray-500 text-center leading-snug">
            <span className="font-bold">B</span>reast <span className="font-bold">R</span>econstruction <span className="font-bold">I</span>nformation <span className="font-bold">D</span>atabase
            <span className="font-bold">G</span>uided <span className="font-bold">E</span>ntries
          </div>
        </div>


        <input
          name="username"
          type="text"
          placeholder="Username"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-800"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-800"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
