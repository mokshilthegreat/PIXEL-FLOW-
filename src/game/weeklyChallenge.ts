import { Level, Difficulty } from './types';
import { ALL_LEVELS } from './levels';

export interface WeeklyChallengeState {
  year: number;
  weekNumber: number;
  completedIndices: number[]; // 0..4
  rewardClaimed: boolean;
}

export function getCurrentWeekNumber(): { year: number; weekNumber: number } {
  const now = new Date();
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year: date.getUTCFullYear(), weekNumber: weekNo };
}

/**
 * Returns 5 deterministic puzzles for the given week number.
 */
export function getWeeklyLevels(weekNumber: number): Level[] {
  // Select 5 varied levels from the 100-level catalog deterministically
  const seed = weekNumber * 17;
  const offsets = [5, 23, 47, 68, 89]; // Across varied difficulty tiers

  return offsets.map((baseOffset, index) => {
    const rawLevelIdx = (seed + baseOffset) % ALL_LEVELS.length;
    const source = ALL_LEVELS[rawLevelIdx];

    const difficultyNames: Difficulty[] = ['EASY', 'MEDIUM', 'HARD', 'VERY_HARD', 'EXPERT'];

    return {
      ...source,
      id: 1000 + index + 1, // Special Weekly IDs: 1001..1005
      difficulty: difficultyNames[index],
      moveLimit: source.moveLimit || source.pairs.length * 2 + 4,
      targetMoves: source.targetMoves || source.pairs.length,
    };
  });
}
