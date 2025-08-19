'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSwipeable } from 'react-swipeable';
import { topics, Topic } from '../../../data/topics';
import Image from 'next/image';

export default function TopicPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id;
  const idStr = Array.isArray(rawId) ? rawId[0] : rawId;
  const idx = idStr ? parseInt(idStr, 10) : NaN;
  const topic: Topic | undefined = topics[idx];
  const [ratings, setRatings] = useState<{ [answerId: number]: number }>({});
  const [contextIndices, setContextIndices] = useState<number[] | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('search_context');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.indices))
          setContextIndices(parsed.indices as number[]);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(`ratings_topic_${idx}`);
    if (raw) setRatings(JSON.parse(raw));
  }, [idx]);

  useEffect(() => {
    localStorage.setItem(`ratings_topic_${idx}`, JSON.stringify(ratings));
  }, [idx, ratings]);

  const handleRate = (answerId: number, stars: number) => {
    setRatings(prev => ({ ...prev, [answerId]: stars }));
  };

  const currentPos = contextIndices ? contextIndices.indexOf(idx) : -1;

  const goPrev = () => {
    if (contextIndices && currentPos > 0)
      return router.push(`/topic/${contextIndices[currentPos - 1]}`);
    return router.push(`/topic/${Math.max(0, idx - 1)}`);
  };

  const goNext = () => {
    if (
      contextIndices &&
      currentPos >= 0 &&
      currentPos < contextIndices.length - 1
    )
      return router.push(`/topic/${contextIndices[currentPos + 1]}`);
    return router.push(`/topic/${Math.min(topics.length - 1, idx + 1)}`);
  };

  const goRandom = () => {
    if (contextIndices && contextIndices.length > 0) {
      if (contextIndices.length === 1)
        return router.push(`/topic/${contextIndices[0]}`);
      let nIdx = idx;
      while (nIdx === idx) {
        const pick = Math.floor(Math.random() * contextIndices.length);
        nIdx = contextIndices[pick];
      }
      return router.push(`/topic/${nIdx}`);
    }

    if (topics.length <= 1) return router.push(`/topic/0`);
    let n = idx;
    while (n === idx) n = Math.floor(Math.random() * topics.length);
    router.push(`/topic/${n}`);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (idx < topics.length - 1) goNext();
    },
    onSwipedRight: () => {
      if (idx > 0) goPrev();
    },
    trackMouse: true,
  });

  if (!topic) return <div className="p-6">お題が見つかりません。</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-2 sm:px-6 pb-6 text-gray-900">
      <div
        {...swipeHandlers}
        className="bg-white shadow-lg rounded-2xl p-3 sm:p-4 mb-4 w-full max-w-md sticky top-0 z-10 select-none transition-transform duration-200"
        style={{ touchAction: 'pan-y' }}
      >
        {topic.imageUrl ? (
          <div className="mb-2 flex justify-center w-full">
            <div className="w-full max-w-md rounded-xl overflow-hidden border border-gray-200 relative">
              <div className="relative w-full" style={{ paddingBottom: '56%' }}>
                <Image
                  src={topic.imageUrl}
                  alt="写真"
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 640px) 100vw, 400px"
                />
              </div>
            </div>
          </div>
        ) : (
          <h1 className="text-lg sm:text-xl font-bold text-center break-words text-gray-800">
            {topic.topic}
          </h1>
        )}

        <div className="mt-2 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-500 hover:underline"
            aria-label="お題一覧に戻る"
          >
            ← 一覧に戻る
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center space-x-2">
          <button
            onClick={goPrev}
            disabled={idx === 0}
            className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-40"
          >
            ◀ 前のお題
          </button>

          <button
            onClick={goRandom}
            className="px-3 py-1 rounded-full bg-yellow-100 hover:bg-yellow-200 text-sm"
          >
            🎲 ランダムで出題
          </button>

          <button
            onClick={goNext}
            disabled={idx === topics.length - 1}
            className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-40"
          >
            次のお題 ▶
          </button>
        </div>
      </div>

      <div className="w-full max-w-md space-y-3">
        {topic.answers.map(answer => (
          <div
            key={answer.id}
            className="bg-white rounded-2xl shadow p-3 sm:p-4 flex flex-col"
          >
            <p className="mb-2 text-base sm:text-lg break-words text-gray-900">
              {answer.text}
            </p>
            <div className="flex space-x-1">
              {[1, 2, 3].map(star => (
                <button
                  key={star}
                  onClick={() => handleRate(answer.id, star)}
                  className={
                    'text-yellow-400 text-xl sm:text-2xl focus:outline-none active:scale-90 transition-transform' +
                    ((ratings[answer.id] || 0) >= star ? '' : ' opacity-60')
                  }
                  style={{ touchAction: 'manipulation' }}
                  aria-label={`星${star}つ`}
                >
                  {(ratings[answer.id] || 0) >= star ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
