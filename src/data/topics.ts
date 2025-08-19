export type Answer = { id: number; text: string };
export type Topic = { topic: string; answers: Answer[]; imageUrl?: string };

// Generate 100 dummy topics, each with 20 answers. Keep one sample image on the first topic.
export const topics: Topic[] = Array.from({ length: 100 }, (_, i) => {
  const idx = i + 1;
  return {
    topic: `お題 ${idx} - ダミーの質問`,
    ...(i === 0
      ? { imageUrl: 'https://drive.google.com/uc?export=view&id=1QM5tYApmGXt3qZdvsI2-dwS2gmgbINK2' }
      : {}),
    answers: Array.from({ length: 20 }, (_, a) => ({
      id: a + 1,
      text: `回答 ${a + 1}（お題 ${idx}）`,
    })),
  };
});
