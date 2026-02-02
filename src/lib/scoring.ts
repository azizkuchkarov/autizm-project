import { BLOCKS, getQuestionsFor } from "@/data/questions";
import type { AnswerMap } from "@/lib/storage";

export function computeScores(ageMonths: number, answers: AnswerMap) {
  const byBlock: Record<string, { total: number; max: number }> = {};
  for (const b of BLOCKS) {
    const qs = getQuestionsFor(b.id, ageMonths);
    let total = 0;
    let max = 0;
    for (const q of qs) {
      const chosen = answers[q.id];
      const opt = q.options.find((o) => o.id === chosen);
      if (opt) total += opt.score;
      max += Math.max(...q.options.map((o) => o.score));
    }
    byBlock[b.id] = { total, max: Math.max(max, 1) };
  }

  const all = Object.values(byBlock).reduce(
    (acc, v) => ({ total: acc.total + v.total, max: acc.max + v.max }),
    { total: 0, max: 0 }
  );

  const ratio = all.max ? all.total / all.max : 0;

  const risk =
    ratio < 0.25 ? "Past" : ratio < 0.55 ? "O‘rta" : "Yuqori";

  return { byBlock, all, ratio, risk };
}
