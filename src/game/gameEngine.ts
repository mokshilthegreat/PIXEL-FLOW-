import { Level, Pair, Position, CompletedPaths, ActivePath } from './types';

export function isSamePos(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

export function isAdjacent(a: Position, b: Position): boolean {
  const dRow = Math.abs(a.row - b.row);
  const dCol = Math.abs(a.col - b.col);
  return (dRow === 1 && dCol === 0) || (dRow === 0 && dCol === 1);
}

export function isWithinBoard(pos: Position, size: number): boolean {
  return pos.row >= 0 && pos.row < size && pos.col >= 0 && pos.col < size;
}

export function findEndpointAt(pos: Position, pairs: Pair[]): { pair: Pair; isStart: boolean } | null {
  for (const pair of pairs) {
    if (isSamePos(pair.start, pos)) return { pair, isStart: true };
    if (isSamePos(pair.end, pos)) return { pair, isStart: false };
  }
  return null;
}

export function getCompletedPathCellOwner(pos: Position, completedPaths: CompletedPaths): string | null {
  for (const [pairId, path] of Object.entries(completedPaths)) {
    if (path.some((p) => isSamePos(p, pos))) {
      return pairId;
    }
  }
  return null;
}

export function canStepTo(
  nextPos: Position,
  activePath: ActivePath,
  level: Level,
  completedPaths: CompletedPaths
): { canMove: boolean; isCompletion: boolean; isBacktrack: boolean } {
  // 1. Must be within board bounds
  if (!isWithinBoard(nextPos, level.size)) {
    return { canMove: false, isCompletion: false, isBacktrack: false };
  }

  const currentPos = activePath.points[activePath.points.length - 1];

  // 2. Must be strictly orthogonal (UP, DOWN, LEFT, RIGHT)
  if (!isAdjacent(currentPos, nextPos)) {
    return { canMove: false, isCompletion: false, isBacktrack: false };
  }

  // 3. Check for Backtracking: if nextPos is the immediate previous point
  if (activePath.points.length >= 2) {
    const prevPos = activePath.points[activePath.points.length - 2];
    if (isSamePos(prevPos, nextPos)) {
      return { canMove: true, isCompletion: false, isBacktrack: true };
    }
  }

  // 4. Check if looping into an earlier point on the active path (allow truncation/backtrack)
  const existingIndex = activePath.points.findIndex((p) => isSamePos(p, nextPos));
  if (existingIndex !== -1) {
    return { canMove: true, isCompletion: false, isBacktrack: true };
  }

  // 5. Cannot pass through another color's endpoint
  const ep = findEndpointAt(nextPos, level.pairs);
  if (ep) {
    if (ep.pair.id !== activePath.pairId) {
      // It belongs to a different pair!
      return { canMove: false, isCompletion: false, isBacktrack: false };
    } else {
      // It's this pair's endpoint. Check if it's the other end (completion!)
      const firstPos = activePath.points[0];
      if (!isSamePos(firstPos, nextPos)) {
        return { canMove: true, isCompletion: true, isBacktrack: false };
      } else {
        // Can't step back onto the starting endpoint unless backtracking
        return { canMove: false, isCompletion: false, isBacktrack: false };
      }
    }
  }

  // 6. Cannot step on another completed path
  const owner = getCompletedPathCellOwner(nextPos, completedPaths);
  if (owner && owner !== activePath.pairId) {
    return { canMove: false, isCompletion: false, isBacktrack: false };
  }

  // Valid regular empty cell step
  return { canMove: true, isCompletion: false, isBacktrack: false };
}

export function isLevelCompleted(level: Level, completedPaths: CompletedPaths): boolean {
  if (Object.keys(completedPaths).length !== level.pairs.length) {
    return false;
  }

  for (const pair of level.pairs) {
    const path = completedPaths[pair.id];
    if (!path || path.length < 2) return false;
    const start = path[0];
    const end = path[path.length - 1];

    const validConnection =
      (isSamePos(start, pair.start) && isSamePos(end, pair.end)) ||
      (isSamePos(start, pair.end) && isSamePos(end, pair.start));

    if (!validConnection) return false;
  }

  return true;
}
