'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { topics } from '../data/topics';

const PAGE_SIZE = 12; // 推奨値

export default function HomePage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleTopics = topics.slice(0, visibleCount);

  const loadMore = () =>
    setVisibleCount(c => Math.min(topics.length, c + PAGE_SIZE));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 sm:px-6 py-6 text-gray-900">
      <h1 className="text-2xl font-bold mb-4">大喜利のお題一覧</h1>

      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visibleTopics.map((t, i) => {
          const index = i; // visible index
          const thumb = t.imageUrl;
          return (
            <Link
              key={index}
              href={`/topic/${index}`}
              className="bg-white rounded-2xl shadow p-4 hover:shadow-md transition flex items-start space-x-3"
            >
              {thumb ? (
                <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={thumb}
                    alt="thumbnail"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div>
                <h2 className="text-base font-semibold text-gray-800">
                  {t.topic}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  回答数: {t.answers.length}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="w-full max-w-2xl mt-6 flex justify-center">
        {visibleCount < topics.length ? (
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            aria-label="もっと表示"
          >
            もっと見る
          </button>
        ) : (
          <div className="text-sm text-gray-500">すべて表示しました</div>
        )}
      </div>
    </div>
  );
}
