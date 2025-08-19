'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSwipeable } from 'react-swipeable';
import { topics, Topic } from '../../../data/topics';

type Props = { params: { id: string } };

export default function TopicPage({ params }: Props) {
  const router = useRouter();
  const idx = parseInt(params.id, 10);
  const topic: Topic | undefined = topics[idx];
  const [ratings, setRatings] = useState<{ [answerId: number]: number }>({});

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

  const goPrev = () => router.push(`/topic/${Math.max(0, idx - 1)}`);
  const goNext = () =>
    router.push(`/topic/${Math.min(topics.length - 1, idx + 1)}`);
  const goRandom = () => {
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
        <h1 className="text-lg sm:text-xl font-bold text-center break-words text-gray-800">
          {topic.topic}
        </h1>

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
