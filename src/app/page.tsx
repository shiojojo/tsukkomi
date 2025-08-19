'use client';
import Link from 'next/link';
import { topics } from '../data/topics';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 sm:px-6 py-6 text-gray-900">
      <h1 className="text-2xl font-bold mb-4">大喜利のお題一覧</h1>

      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
        {topics.map((t, i) => (
          <Link
            key={i}
            href={`/topic/${i}`}
            className="block bg-white rounded-2xl shadow p-4 hover:shadow-md transition"
          >
            <h2 className="text-base font-semibold text-gray-800">{t.topic}</h2>
            <p className="mt-2 text-sm text-gray-500">
              回答数: {t.answers.length}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
