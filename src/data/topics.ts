export type Answer = { id: number; text: string };
export type Topic = { topic: string; answers: Answer[]; imageUrl?: string };

// Generate 100 dummy topics, each with 20 answers. Keep one sample image on the first topic.
export const topics: Topic[] = Array.from({ length: 100 }, (_, i) => {
  const idx = i + 1;
  return {
    topic: `お題 ${idx} - ダミーの質問`,
    ...(i === 0
      ? { imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEieks99OzkiAothfzTz7FbtakQMfXVPQDL6eUDMJfv_2ghB5xB0gUYsA5n-2YUHe5Adevn9YrfUjswiDQneXg1Q0uzEjIu3R9G-DJ7xvxi6nbj-XiNWool1RV3lRjy3-zKFGPySzfgQxHGw/s650/animal_black_sheep_hitsuji.png' }
      : {}),
    answers: Array.from({ length: 20 }, (_, a) => ({
      id: a + 1,
      text: `回答 ${a + 1}（お題 ${idx}）`,
    })),
  };
});
