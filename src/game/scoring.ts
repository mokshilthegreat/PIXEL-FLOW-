import { Level } from './types';

export function calculateScoreAndStars(
  level: Level,
  moves: number,
  hintsUsedCount: number
): { score: number; stars: number; baseScore: number; efficiencyBonus: number; noHintBonus: number } {
  // Base score according to board dimension
  let baseScore = 500;
  if (level.size === 6) baseScore = 750;
  if (level.size >= 7) baseScore = 1000;

  // Efficiency Bonus: reward completing close to or at targetMoves
  const targetMoves = level.targetMoves ?? level.parMoves ?? level.pairs.length;
  const extraMoves = Math.max(0, moves - targetMoves);
  const efficiencyBonus = Math.max(0, 300 - extraMoves * 50);

  // No-Hint bonus
  const noHintBonus = hintsUsedCount === 0 ? 200 : 0;

  const totalScore = baseScore + efficiencyBonus + noHintBonus;

  // Stars calculation:
  // 3 stars: exact par/target moves and 0 hints
  // 2 stars: within targetMoves + 2 or 1 hint
  // 1 star: finished within move limit
  let stars = 1;
  if (moves <= targetMoves && hintsUsedCount === 0) {
    stars = 3;
  } else if (moves <= targetMoves + 2 && hintsUsedCount <= 1) {
    stars = 2;
  }

  return {
    score: totalScore,
    stars,
    baseScore,
    efficiencyBonus,
    noHintBonus,
  };
}
