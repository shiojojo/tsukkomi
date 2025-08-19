'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { topics } from '../data/topics';

const PAGE_SIZE = 12; // 推奨値

const parseCreatedAt = (s: string) => {
  // s: YYYY/MM/DD HH:mm:ss
  const [datePart, timePart] = s.split(' ');
  const [Y, M, D] = datePart.split('/').map(Number);
  const [h, m, sec] = timePart.split(':').map(Number);
  return new Date(Y, M - 1, D, h, m, sec);
};

export default function HomePage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'new' | 'old'>('new');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // map topics to preserve original index
  const mapped = useMemo(() => topics.map((t, i) => ({ t, i })), []);

  // Filtering
  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    return mapped.filter(({ t }) => {
      // date range filter
      if (fromDate) {
        const from = new Date(fromDate + 'T00:00:00');
        if (parseCreatedAt(t.createdAt) < from) return false;
      }
      if (toDate) {
        const to = new Date(toDate + 'T23:59:59');
        if (parseCreatedAt(t.createdAt) > to) return false;
      }

      if (!q) return true;
      const inTitle = t.topic.toLowerCase().includes(q);
      const inAnswers = t.answers.some(a => a.text.toLowerCase().includes(q));
      return inTitle || inAnswers;
    });
  }, [mapped, q, fromDate, toDate]);

  // Sorting by createdAt
  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const da = parseCreatedAt(a.t.createdAt).getTime();
      const db = parseCreatedAt(b.t.createdAt).getTime();
      return sortOrder === 'new' ? db - da : da - db;
    });
    return copy;
  }, [filtered, sortOrder]);

  useEffect(() => setVisibleCount(PAGE_SIZE), [q, fromDate, toDate, sortOrder]);

  const visibleItems = sorted.slice(0, visibleCount);

  const saveSearchContext = (indices: number[], currentId: number) => {
    try {
      sessionStorage.setItem(
        'search_context',
        JSON.stringify({ indices, currentId })
      );
    } catch {
      // ignore
    }
  };

  const loadMore = () =>
    setVisibleCount(c => Math.min(sorted.length, c + PAGE_SIZE));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 sm:px-6 py-6 text-gray-900">
      <h1 className="text-2xl font-bold mb-4">大喜利のお題一覧</h1>

      <div className="w-full max-w-2xl mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="お題や回答で検索"
          className="col-span-1 sm:col-span-2 w-full px-3 py-2 rounded-lg border border-gray-200"
        />
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value as 'new' | 'old')}
          className="w-full px-3 py-2 rounded-lg border border-gray-200"
        >
          <option value="new">新着順</option>
          <option value="old">古い順</option>
        </select>
      </div>

      <div className="w-full max-w-2xl mb-4 flex items-center gap-2">
        <label className="text-sm text-gray-600">From:</label>
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          className="px-2 py-1 rounded border"
        />
        <label className="text-sm text-gray-600">To:</label>
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          className="px-2 py-1 rounded border"
        />
        <button
          onClick={() => {
            setFromDate('');
            setToDate('');
          }}
          className="ml-2 text-sm text-gray-500"
        >
          クリア
        </button>
      </div>

      <div className="w-full max-w-2xl text-sm text-gray-600 mb-3">
        表示: {Math.min(visibleCount, sorted.length)} / {sorted.length} 件
      </div>

      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visibleItems.map(({ t, i }) => {
          const thumb = t.imageUrl;
          return (
            <Link
              key={i}
              href={`/topic/${i}`}
              onClick={() =>
                saveSearchContext(
                  sorted.map(s => s.i),
                  i
                )
              }
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
                <p className="mt-1 text-xs text-gray-500">{t.createdAt}</p>
                <p className="mt-2 text-sm text-gray-500">
                  回答数: {t.answers.length}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="w-full max-w-2xl mt-6 flex justify-center">
        {sorted.length === 0 ? (
          <div className="text-sm text-gray-500">
            該当するお題が見つかりません
          </div>
        ) : visibleCount < sorted.length ? (
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
