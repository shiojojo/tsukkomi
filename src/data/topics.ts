export type Answer = { id: number; text: string };
export type Topic = { topic: string; answers: Answer[]; imageUrl?: string; createdAt: string };

// Helper: format Date to `YYYY/MM/DD HH:mm:ss`
const formatDate = (d: Date) => {
  const z = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${z(d.getMonth() + 1)}/${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`;
};

// Date range for generated topics (evenly distributed)
const startDate = new Date('2024-01-01T00:00:00');
const endDate = new Date('2025-08-19T15:12:53');

// Generate 100 dummy topics, each with 20 answers. Keep one sample image on the first topic.
export const topics: Topic[] = Array.from({ length: 100 }, (_, i) => {
  const idx = i + 1;
  const t = (() => {
    const total = 100 - 1;
    const ratio = total > 0 ? i / total : 0;
    const ts = Math.round(startDate.getTime() + ratio * (endDate.getTime() - startDate.getTime()));
    return new Date(ts);
  })();
  return {
    topic: `お題 ${idx} - ダミーの質問`,
    createdAt: formatDate(t),
    ...(i === 0
      ? { imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEieks99OzkiAothfzTz7FbtakQMfXVPQDL6eUDMJfv_2ghB5xB0gUYsA5n-2YUHe5Adevn9YrfUjswiDQneXg1Q0uzEjIu3R9G-DJ7xvxi6nbj-XiNWool1RV3lRjy3-zKFGPySzfgQxHGw/s650/animal_black_sheep_hitsuji.png' }
      : {}),
    answers: Array.from({ length: 20 }, (_, a) => ({
      id: a + 1,
      text: `回答 ${a + 1}（お題 ${idx}）`,
    })),
  };
});
