'use client';
import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

export default function OgiriPage() {
  // 複数お題データ
  const topics = [
    {
      topic: 'このアプリに最初につけるボケてみたい名前は？',
      answers: [
        { id: 1, text: 'ボケクラウド' },
        { id: 2, text: '突っ込み待ち.com' },
        { id: 3, text: '大喜利ンピック' },
        { id: 4, text: 'ツッコミバース' },
        { id: 5, text: 'ギャグノート' },
      ],
    },
    {
      topic: '「冷蔵庫にWi-Fiがついてる！」に一言',
      answers: [
        { id: 1, text: '冷蔵庫でZoom会議できるね' },
        { id: 2, text: '冷やし中のネットサーフィン' },
        { id: 3, text: '冷蔵庫の中からSNS投稿' },
        { id: 4, text: '冷蔵庫がバズる時代' },
        { id: 5, text: '冷蔵庫でYouTube見放題' },
      ],
    },
    {
      topic: '「自販機でカレーが売ってる！」に一言',
      answers: [
        { id: 1, text: '温めますか？' },
        { id: 2, text: 'ルーだけ出てきた' },
        { id: 3, text: 'ご飯は別売り' },
        { id: 4, text: '自販機の中がカレー臭' },
        { id: 5, text: 'カレーの自販機限定味' },
      ],
    },
    // 追加でさらにお題を増やせます
  ];

  const [currentTopicIdx, setCurrentTopicIdx] = useState(0);
  // 各お題ごとにratingsを持つ
  const [ratings, setRatings] = useState<{
    [topicIdx: number]: { [answerId: number]: number };
  }>({});

  const handleRate = (answerId: number, stars: number) => {
    setRatings(prev => ({
      ...prev,
      [currentTopicIdx]: {
        ...(prev[currentTopicIdx] || {}),
        [answerId]: stars,
      },
    }));
  };

  // スワイプハンドラ
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentTopicIdx < topics.length - 1) setCurrentTopicIdx(i => i + 1);
    },
    onSwipedRight: () => {
      if (currentTopicIdx > 0) setCurrentTopicIdx(i => i - 1);
    },
    trackMouse: true, // PCでも動作
  });

  // ボタンによる切替（PCユーザーやスワイプに慣れてない人向け）
  const goPrev = () => setCurrentTopicIdx(i => Math.max(0, i - 1));
  const goNext = () =>
    setCurrentTopicIdx(i => Math.min(topics.length - 1, i + 1));
  const goRandom = () =>
    setCurrentTopicIdx(prev => {
      if (topics.length <= 1) return 0;
      let idx = prev;
      while (idx === prev) {
        idx = Math.floor(Math.random() * topics.length);
      }
      return idx;
    });

  const current = topics[currentTopicIdx];
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-2 sm:px-6 pb-4 text-gray-900">
      {/* お題（スワイプ切り替え） */}
      <div
        {...swipeHandlers}
        className="bg-white shadow-lg rounded-2xl p-3 sm:p-4 mb-4 w-full max-w-md sticky top-0 z-10 select-none cursor-pointer transition-transform duration-200"
        style={{ touchAction: 'pan-y' }}
      >
        <h1 className="text-lg sm:text-xl font-bold text-center break-words text-gray-800">
          {current.topic}
        </h1>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{currentTopicIdx > 0 ? '← スワイプ' : ''}</span>
          <span>{currentTopicIdx < topics.length - 1 ? 'スワイプ →' : ''}</span>
        </div>
        {/* PC向けの矢印ボタンとランダムボタン */}
        <div className="mt-3 flex items-center justify-center space-x-2">
          <button
            onClick={goPrev}
            disabled={currentTopicIdx === 0}
            className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-40"
            aria-label="前のお題"
          >
            ◀ 前のお題
          </button>

          <button
            onClick={goRandom}
            className="px-3 py-1 rounded-full bg-yellow-100 hover:bg-yellow-200 text-sm"
            aria-label="ランダムで出題"
          >
            🎲 ランダムで出題
          </button>

          <button
            onClick={goNext}
            disabled={currentTopicIdx === topics.length - 1}
            className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-40"
            aria-label="次のお題"
          >
            次のお題 ▶
          </button>
        </div>
      </div>

      {/* 回答リスト */}
      <div className="w-full max-w-md space-y-3">
        {current.answers.map(answer => (
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
                    ((ratings[currentTopicIdx]?.[answer.id] || 0) >= star
                      ? ''
                      : ' opacity-60')
                  }
                  style={{ touchAction: 'manipulation' }}
                  aria-label={`星${star}つ`}
                >
                  {(ratings[currentTopicIdx]?.[answer.id] || 0) >= star
                    ? '★'
                    : '☆'}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
