/* =========================================================
   PIXEL FLOW! — GAME TYPES
   Supports:
   - 100 levels
   - Persistent progression
   - Move limits
   - Best moves / best scores
   - Retry / restart
   - Hints
   - Daily challenges
   - Streaks
   - Milestones
   - Accessibility
========================================================= */

/* =========================================================
   GLOBAL GAME CONSTANTS
========================================================= */

export const TOTAL_LEVELS = 100;

export const MIN_GRID_SIZE = 5;

export const MAX_GRID_SIZE = 7;

export const STARTING_COINS = 100;

export const STARTING_FREE_HINTS = 3;

export const HINT_COST = 100;

/* =========================================================
   GRID / POSITION
========================================================= */

export type Position = {
  row: number;
  col: number;
};

/* =========================================================
   COLORS
========================================================= */

export type ColorId =
  | 'blue'
  | 'cyan'
  | 'purple'
  | 'pink'
  | 'green'
  | 'orange'
  | 'yellow'
  | 'red';

/* =========================================================
   COLOR INFORMATION
========================================================= */

export type ColorDefinition = {
  id: ColorId;
  name: string;

  /**
   * Used by the normal visual theme.
   */
  hex: string;

  /**
   * Used for accessibility / colorblind mode.
   */
  symbol:
    | 'circle'
    | 'triangle'
    | 'diamond'
    | 'square'
    | 'star'
    | 'hexagon'
    | 'cross'
    | 'ring';
};

/* =========================================================
   COLOR PAIRS
========================================================= */

export type Pair = {
  id: string;

  color: ColorId;

  start: Position;

  end: Position;
};

/* =========================================================
   LEVEL DIFFICULTY
========================================================= */

export type LevelDifficulty =
  | 'Very Easy'
  | 'Easy'
  | 'Easy/Medium'
  | 'Medium'
  | 'Moderate'
  | 'Hard'
  | 'Hard+'
  | 'Hard++'
  | 'Very Hard'
  | 'Very Hard+'
  | 'Very Hard++'
  | 'Expert'
  | 'Expert+'
  | 'Expert++'
  | 'Master'
  | 'Master+'
  | 'Master++'
  | 'Elite'
  | 'Elite+'
  | 'Elite++'
  | 'Legendary'
  | 'Legendary+'
  | 'Final Flow'
  | string;

/* =========================================================
   DIFFICULTY GROUP
========================================================= */

export type Difficulty =
  | 'EASY'
  | 'MEDIUM'
  | 'HARD'
  | 'VERY_HARD'
  | 'EXPERT'
  | 'MASTER'
  | 'ELITE'
  | 'LEGENDARY';

/* =========================================================
   LEVEL CHAPTERS
========================================================= */

export type ChapterId =
  | 'first_flow'
  | 'flow_beginnings'
  | 'tight_turns'
  | 'neon_paths'
  | 'complex_flow'
  | 'flow_master'
  | 'deep_flow'
  | 'perfect_path'
  | 'extreme_flow'
  | 'final_flow';

/* =========================================================
   LEVEL
========================================================= */

export type Level = {
  /**
   * Level number.
   * Valid range:
   * 1–100
   */
  id: number;

  /**
   * Board size.
   * Usually 5, 6 or 7.
   */
  size: number;

  /**
   * Matching color pairs.
   */
  pairs: Pair[];

  /**
   * Maximum allowed moves.
   *
   * Reaching this number without completing
   * the puzzle causes the attempt to fail.
   */
  moveLimit: number;

  /**
   * Intended efficient move target.
   *
   * Used for score and star calculation.
   */
  targetMoves: number;

  /**
   * Human-readable difficulty.
   */
  difficulty: LevelDifficulty;

  /**
   * Optional normalized difficulty group.
   */
  difficultyGroup?: Difficulty;

  /**
   * Optional chapter.
   */
  chapter?: ChapterId;

  /**
   * Optional chapter number.
   */
  chapterNumber?: number;

  /**
   * Optional ideal/par score.
   *
   * Kept for compatibility with older level data.
   */
  parMoves?: number;

  /**
   * Optional maximum moves.
   *
   * Kept for compatibility with older level data.
   */
  maxMoves?: number;

  /**
   * Optional known solution.
   *
   * Key = pair ID
   * Value = ordered grid positions
   */
  solution?: Record<string, Position[]>;

  /**
   * Optional obstacles.
   *
   * Some future/custom levels may use blocked cells.
   */
  obstacles?: Position[];

  /**
   * Optional flag for special levels.
   *
   * Example:
   * Level 100 = true
   */
  isSpecial?: boolean;

  /**
   * Optional flag for the final level.
   */
  isFinalLevel?: boolean;
};

/* =========================================================
   GAME SETTINGS
========================================================= */

export type GameSettings = {
  /**
   * Background / gameplay music.
   */
  music: boolean;

  /**
   * Gameplay/UI sounds.
   */
  sound: boolean;

  /**
   * Device vibration / haptics.
   */
  vibration: boolean;

  /**
   * Colorblind accessibility mode.
   */
  colorblind: boolean;

  /**
   * Reduce animations and motion.
   */
  reducedMotion: boolean;
};

/* =========================================================
   DAILY CHALLENGE
========================================================= */

export type DailyChallengeData = {
  /**
   * Date on which today's challenge was completed.
   */
  lastCompletedDate: string | null;

  /**
   * Best daily score.
   */
  bestScore: number;

  /**
   * Best daily move count.
   */
  bestMoves: number;

  /**
   * Best daily star rating.
   */
  stars: number;

  /**
   * Optional deterministic challenge ID.
   */
  challengeId?: string;
};

/* =========================================================
   STREAK
========================================================= */

export type StreakData = {
  /**
   * Last date on which the player completed
   * at least one valid puzzle/challenge.
   */
  lastPlayedDate: string | null;

  /**
   * Current consecutive-day streak.
   */
  currentStreak: number;

  /**
   * Highest streak ever achieved.
   */
  longestStreak: number;
};

/* =========================================================
   MILESTONES
========================================================= */

export type Milestone = {
  id: string;

  title: string;

  description: string;

  rewardCoins: number;
};

/* =========================================================
   GAME STATISTICS
========================================================= */

export type GameStats = {
  levelsCompleted: number;

  totalStars: number;

  bestScore: number;

  totalMoves: number;

  hintsUsed: number;
};

/* =========================================================
   ACTIVE PATH
========================================================= */

export type ActivePath = {
  /**
   * Pair currently being drawn.
   */
  pairId: string;

  /**
   * Color of the active path.
   */
  color: ColorId;

  /**
   * Ordered grid cells in the path.
   */
  points: Position[];
};

/* =========================================================
   COMPLETED PATHS
========================================================= */

export type CompletedPaths =
  Record<string, Position[]>;

/* =========================================================
   PATH HISTORY
========================================================= */

export type PathHistoryEntry = {
  /**
   * Snapshot of all completed paths.
   */
  completedPaths: CompletedPaths;

  /**
   * Move count at this point.
   */
  moves: number;
};

/* =========================================================
   HINT TYPES
========================================================= */

export type HintDirection =
  | 'UP'
  | 'DOWN'
  | 'LEFT'
  | 'RIGHT';

export type HintType =
  | 'endpoint'
  | 'direction'
  | 'path';

export type GameHint = {
  /**
   * Color involved in the hint.
   */
  color: ColorId;

  /**
   * Pair involved.
   */
  pairId: string;

  /**
   * Grid location to highlight.
   */
  position: Position;

  /**
   * Optional direction.
   */
  direction?: HintDirection;

  /**
   * Type of hint.
   */
  type: HintType;

  /**
   * Human-readable message.
   */
  message: string;

  /**
   * Optional short path preview.
   */
  previewPath?: Position[];
};

/* =========================================================
   GAME FLOW / SCREEN
========================================================= */

export type GameScreen =
  | 'home'
  | 'level_select'
  | 'gameplay'
  | 'how_to_play'
  | 'settings'
  | 'stats'
  | 'about';

/* =========================================================
   GAMEPLAY STATUS
========================================================= */

export type GameplayStatus =
  | 'idle'
  | 'playing'
  | 'paused'
  | 'completed'
  | 'failed';

/* =========================================================
   GAME RESULT
========================================================= */

export type GameResult = {
  levelId: number;

  movesUsed: number;

  moveLimit: number;

  targetMoves: number;

  score: number;

  stars: number;

  hintsUsed: number;

  isNewBestScore: boolean;

  isNewBestMoves: boolean;
};

/* =========================================================
   LEVEL RESULT
========================================================= */

export type LevelCompletionResult = {
  levelId: number;

  completed: boolean;

  score: number;

  stars: number;

  movesUsed: number;

  moveLimit: number;

  targetMoves: number;

  nextLevelId: number | null;

  isFinalLevel: boolean;

  isNewBestScore: boolean;

  isNewBestMoves: boolean;
};

/* =========================================================
   PLAYER PROGRESSION
========================================================= */

export type PlayerProgress = {
  /**
   * Highest level player is allowed to play.
   *
   * Example:
   * 30 means levels 1–30 are unlocked.
   */
  highestUnlockedLevel: number;

  /**
   * The exact level player should continue from.
   *
   * This is NOT necessarily the highest unlocked level.
   *
   * Example:
   * highestUnlockedLevel = 30
   * currentResumeLevel = 17
   */
  currentResumeLevel: number;

  /**
   * Completed level IDs.
   */
  completedLevels: number[];

  /**
   * Best stars for each level.
   */
  starsByLevel: Record<number, number>;

  /**
   * Best score for each level.
   */
  bestScoreByLevel: Record<number, number>;

  /**
   * Best moves for each level.
   */
  bestMovesByLevel: Record<number, number>;
};

/* =========================================================
   PLAYER ECONOMY
========================================================= */

export type PlayerEconomy = {
  coins: number;

  freeHints: number;
};

/* =========================================================
   PLAYER SESSION
========================================================= */

export type PlayerSession = {
  /**
   * Current temporary level.
   */
  currentLevelId: number;

  /**
   * Current temporary moves.
   */
  moves: number;

  /**
   * Current temporary score.
   */
  score: number;

  /**
   * Current paths.
   */
  completedPaths: CompletedPaths;

  /**
   * Currently drawn path.
   */
  activePath: ActivePath | null;

  /**
   * Whether an attempt has failed.
   */
  isFailed: boolean;

  /**
   * Whether level is complete.
   */
  isCompleted: boolean;

  /**
   * Current hint.
   */
  activeHint: GameHint | null;
};

/* =========================================================
   CHAPTER INFORMATION
========================================================= */

export type Chapter = {
  id: ChapterId;

  name: string;

  startLevel: number;

  endLevel: number;

  difficulty: Difficulty;

  description: string;

  rewardCoins: number;
};

/* =========================================================
   WEEKLY CHALLENGE
========================================================= */

export type WeeklyChallengeData = {
  year: number;

  weekNumber: number;

  completedIndices: number[];

  rewardClaimed: boolean;
};

/* =========================================================
   NAVIGATION SOURCE
========================================================= */

export type NavigationSource =
  | 'home'
  | 'level_select'
  | 'gameplay'
  | 'level_complete'
  | 'out_of_moves';

/* =========================================================
   LEVEL ACTIONS
========================================================= */

export type LevelAction =
  | 'start'
  | 'restart'
  | 'retry'
  | 'complete'
  | 'exit'
  | 'continue';

/* =========================================================
   GAME EVENTS
========================================================= */

export type GameEvent =
  | {
      type: 'game_started';
      levelId: number;
    }
  | {
      type: 'level_started';
      levelId: number;
    }
  | {
      type: 'level_completed';
      levelId: number;
      score: number;
      moves: number;
      stars: number;
    }
  | {
      type: 'level_failed';
      levelId: number;
      moves: number;
    }
  | {
      type: 'level_retried';
      levelId: number;
    }
  | {
      type: 'hint_used';
      levelId: number;
    }
  | {
      type: 'new_best';
      levelId: number;
      score?: number;
      moves?: number;
    }
  | {
      type: 'daily_completed';
      score: number;
      moves: number;
      stars: number;
    }
  | {
      type: 'streak_updated';
      streak: number;
    }
  | {
      type: 'chapter_completed';
      chapterId: ChapterId;
    }
  | {
      type: 'cosmetic_unlocked';
      themeId: string;
    };

/* =========================================================
   UTILITY TYPES
========================================================= */

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

/* =========================================================
   LEVEL VALIDATION
========================================================= */

export type LevelValidationResult = {
  valid: boolean;

  solvable: boolean;

  hasValidPairs: boolean;

  hasValidMoveLimit: boolean;

  minimumMoves?: number;

  errors: string[];
};

/* =========================================================
   GAME BOARD CELL
========================================================= */

export type BoardCell = {
  position: Position;

  /**
   * Whether cell is blocked.
   */
  blocked: boolean;

  /**
   * Pair ID if the cell contains an endpoint.
   */
  pairId?: string;

  /**
   * Endpoint color.
   */
  color?: ColorId;

  /**
   * Whether the cell belongs to a completed path.
   */
  pathColor?: ColorId;
};

/* =========================================================
   SCORE INFORMATION
========================================================= */

export type ScoreBreakdown = {
  baseScore: number;

  efficiencyBonus: number;

  noHintBonus: number;

  totalScore: number;
};

/* =========================================================
   STAR CALCULATION
========================================================= */

export type StarCalculation = {
  stars: number;

  movesUsed: number;

  targetMoves: number;

  moveLimit: number;

  efficiencyRatio: number;
};

/* =========================================================
   RETRY RESULT
========================================================= */

export type RetryResult = {
  levelId: number;

  movesReset: boolean;

  pathsReset: boolean;

  scoreReset: boolean;

  progressPreserved: boolean;
};

/* =========================================================
   SAVE STATE HELPERS
========================================================= */

/**
 * These fields describe values that are permanent
 * and should survive:
 *
 * - app close
 * - refresh
 * - navigation
 * - restart
 * - retry
 */
export type PersistentProgressFields = Pick<
  PlayerProgress,
  | 'highestUnlockedLevel'
  | 'currentResumeLevel'
  | 'completedLevels'
  | 'starsByLevel'
  | 'bestScoreByLevel'
  | 'bestMovesByLevel'
> &
  PlayerEconomy;

/* =========================================================
   GAME CONSTANTS
========================================================= */

export const DIFFICULTY_RANGES: {
  difficulty: Difficulty;
  startLevel: number;
  endLevel: number;
}[] = [
  {
    difficulty: 'EASY',
    startLevel: 1,
    endLevel: 10,
  },
  {
    difficulty: 'MEDIUM',
    startLevel: 11,
    endLevel: 15,
  },
  {
    difficulty: 'HARD',
    startLevel: 16,
    endLevel: 30,
  },
  {
    difficulty: 'VERY_HARD',
    startLevel: 31,
    endLevel: 45,
  },
  {
    difficulty: 'EXPERT',
    startLevel: 46,
    endLevel: 60,
  },
  {
    difficulty: 'MASTER',
    startLevel: 61,
    endLevel: 75,
  },
  {
    difficulty: 'ELITE',
    startLevel: 76,
    endLevel: 90,
  },
  {
    difficulty: 'LEGENDARY',
    startLevel: 91,
    endLevel: 100,
  },
];

/* =========================================================
   CHAPTER RANGES
========================================================= */

export const CHAPTER_RANGES: Chapter[] = [
  {
    id: 'first_flow',
    name: 'FIRST FLOW',
    startLevel: 1,
    endLevel: 10,
    difficulty: 'EASY',
    description: 'Learn the basics of connecting colors.',
    rewardCoins: 100,
  },
  {
    id: 'flow_beginnings',
    name: 'FLOW BEGINNINGS',
    startLevel: 11,
    endLevel: 20,
    difficulty: 'MEDIUM',
    description: 'Start planning every move.',
    rewardCoins: 150,
  },
  {
    id: 'tight_turns',
    name: 'TIGHT TURNS',
    startLevel: 21,
    endLevel: 30,
    difficulty: 'HARD',
    description: 'Paths become tighter and more challenging.',
    rewardCoins: 200,
  },
  {
    id: 'neon_paths',
    name: 'NEON PATHS',
    startLevel: 31,
    endLevel: 40,
    difficulty: 'VERY_HARD',
    description: 'Master increasingly complex routes.',
    rewardCoins: 250,
  },
  {
    id: 'complex_flow',
    name: 'COMPLEX FLOW',
    startLevel: 41,
    endLevel: 50,
    difficulty: 'VERY_HARD',
    description: 'Think ahead and avoid dead ends.',
    rewardCoins: 300,
  },
  {
    id: 'flow_master',
    name: 'FLOW MASTER',
    startLevel: 51,
    endLevel: 60,
    difficulty: 'EXPERT',
    description: 'Advanced path planning begins.',
    rewardCoins: 350,
  },
  {
    id: 'deep_flow',
    name: 'DEEP FLOW',
    startLevel: 61,
    endLevel: 70,
    difficulty: 'MASTER',
    description: 'Only efficient decisions will succeed.',
    rewardCoins: 400,
  },
  {
    id: 'perfect_path',
    name: 'PERFECT PATH',
    startLevel: 71,
    endLevel: 80,
    difficulty: 'MASTER',
    description: 'Precision and planning are essential.',
    rewardCoins: 500,
  },
  {
    id: 'extreme_flow',
    name: 'EXTREME FLOW',
    startLevel: 81,
    endLevel: 90,
    difficulty: 'ELITE',
    description: 'Only experienced players will master these.',
    rewardCoins: 600,
  },
  {
    id: 'final_flow',
    name: 'FINAL FLOW',
    startLevel: 91,
    endLevel: 100,
    difficulty: 'LEGENDARY',
    description: 'The ultimate Pixel Flow challenge.',
    rewardCoins: 1000,
  },
];

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

/**
 * Safely clamp a level ID to 1–100.
 */
export function clampLevelId(
  levelId: number
): number {
  if (!Number.isFinite(levelId)) {
    return 1;
  }

  return Math.min(
    TOTAL_LEVELS,
    Math.max(
      1,
      Math.floor(levelId)
    )
  );
}

/**
 * Determine whether a level is the final level.
 */
export function isFinalLevel(
  levelId: number
): boolean {
  return clampLevelId(levelId) === TOTAL_LEVELS;
}

/**
 * Get the next level.
 *
 * Level 100 has no next level.
 */
export function getNextLevelId(
  levelId: number
): number | null {
  const safeLevel =
    clampLevelId(levelId);

  if (safeLevel >= TOTAL_LEVELS) {
    return null;
  }

  return safeLevel + 1;
}

/**
 * Determine difficulty group from level number.
 */
export function getDifficultyForLevel(
  levelId: number
): Difficulty {
  const safeLevel =
    clampLevelId(levelId);

  const range =
    DIFFICULTY_RANGES.find(
      (item) =>
        safeLevel >= item.startLevel &&
        safeLevel <= item.endLevel
    );

  return range?.difficulty || 'EASY';
}

/**
 * Get chapter from level.
 */
export function getChapterForLevel(
  levelId: number
): Chapter | undefined {
  const safeLevel =
    clampLevelId(levelId);

  return CHAPTER_RANGES.find(
    (chapter) =>
      safeLevel >= chapter.startLevel &&
      safeLevel <= chapter.endLevel
  );
}

/**
 * Determine whether a level is unlocked.
 */
export function isLevelUnlocked(
  levelId: number,
  highestUnlockedLevel: number
): boolean {
  const safeLevel =
    clampLevelId(levelId);

  const safeUnlocked =
    clampLevelId(
      highestUnlockedLevel
    );

  return safeLevel <= safeUnlocked;
}

/**
 * Determine whether a level is completed.
 */
export function isLevelCompleted(
  levelId: number,
  completedLevels: number[]
): boolean {
  const safeLevel =
    clampLevelId(levelId);

  return completedLevels.includes(
    safeLevel
  );
}