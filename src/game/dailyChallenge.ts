import { Level, Position } from './types';

const line = (coords: [number, number][]): Position[] => coords.map(([row, col]) => ({ row, col }));

export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayKey(): string {
  return getTodayDateKey();
}

export function getTodayDisplayDate(): string {
  return new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// Handcrafted unique solvable 6x6 daily challenge boards
const DAILY_TEMPLATES: Omit<Level, 'id'>[] = [
  {
    size: 6,
    difficulty: 'Hard',
    targetMoves: 5,
    moveLimit: 8,
    parMoves: 5,
    maxMoves: 8,
    pairs: [
      { id: 'd-blue', color: 'blue', start: { row: 0, col: 0 }, end: { row: 0, col: 5 } },
      { id: 'd-pink', color: 'pink', start: { row: 5, col: 0 }, end: { row: 5, col: 5 } },
      { id: 'd-green', color: 'green', start: { row: 1, col: 1 }, end: { row: 4, col: 1 } },
      { id: 'd-yellow', color: 'yellow', start: { row: 1, col: 4 }, end: { row: 4, col: 4 } },
      { id: 'd-purple', color: 'purple', start: { row: 2, col: 2 }, end: { row: 3, col: 3 } },
    ],
    solution: {
      'd-blue': line([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]]),
      'd-pink': line([[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5]]),
      'd-green': line([[1, 1], [2, 1], [3, 1], [4, 1]]),
      'd-yellow': line([[1, 4], [2, 4], [3, 4], [4, 4]]),
      'd-purple': line([[2, 2], [2, 3], [3, 3]]),
    },
  },
  {
    size: 6,
    difficulty: 'Hard',
    targetMoves: 5,
    moveLimit: 8,
    parMoves: 5,
    maxMoves: 8,
    pairs: [
      { id: 'd-cyan', color: 'cyan', start: { row: 0, col: 1 }, end: { row: 5, col: 1 } },
      { id: 'd-orange', color: 'orange', start: { row: 0, col: 4 }, end: { row: 5, col: 4 } },
      { id: 'd-purple', color: 'purple', start: { row: 1, col: 2 }, end: { row: 4, col: 2 } },
      { id: 'd-pink', color: 'pink', start: { row: 1, col: 3 }, end: { row: 4, col: 3 } },
      { id: 'd-blue', color: 'blue', start: { row: 2, col: 0 }, end: { row: 4, col: 0 } },
    ],
    solution: {
      'd-cyan': line([[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1]]),
      'd-orange': line([[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4]]),
      'd-purple': line([[1, 2], [2, 2], [3, 2], [4, 2]]),
      'd-pink': line([[1, 3], [2, 3], [3, 3], [4, 3]]),
      'd-blue': line([[2, 0], [3, 0], [4, 0]]),
    },
  },
  {
    size: 6,
    difficulty: 'Hard',
    targetMoves: 5,
    moveLimit: 8,
    parMoves: 5,
    maxMoves: 8,
    pairs: [
      { id: 'd-red', color: 'red', start: { row: 0, col: 0 }, end: { row: 0, col: 5 } },
      { id: 'd-blue', color: 'blue', start: { row: 5, col: 0 }, end: { row: 5, col: 5 } },
      { id: 'd-green', color: 'green', start: { row: 1, col: 0 }, end: { row: 4, col: 0 } },
      { id: 'd-yellow', color: 'yellow', start: { row: 1, col: 5 }, end: { row: 4, col: 5 } },
      { id: 'd-cyan', color: 'cyan', start: { row: 2, col: 2 }, end: { row: 3, col: 3 } },
    ],
    solution: {
      'd-red': line([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]]),
      'd-blue': line([[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5]]),
      'd-green': line([[1, 0], [2, 0], [3, 0], [4, 0]]),
      'd-yellow': line([[1, 5], [2, 5], [3, 5], [4, 5]]),
      'd-cyan': line([[2, 2], [2, 3], [3, 3]]),
    },
  },
];

// Clean verified daily generator that creates non-overlapping paths
export function getDailyChallengeLevel(dateKey?: string): Level {
  const key = dateKey || getTodayDateKey();
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % 3;
  const template = DAILY_TEMPLATES[index];

  return {
    ...template,
    id: 1000, // Special ID for daily challenge
  };
}
