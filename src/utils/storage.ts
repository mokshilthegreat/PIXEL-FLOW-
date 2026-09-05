import {
  GameSettings,
  GameStats,
  StreakData,
  DailyChallengeData,
} from '../game/types';
import {
  WeeklyChallengeState,
  getCurrentWeekNumber,
} from '../game/weeklyChallenge';
import { DEFAULT_THEME_ID } from './themes';

/**
 * Pixel Flow save configuration
 *
 * v2 is used so the newer persistence format is clearly separated
 * from the previous save format.
 */
export const SAVE_KEY = 'pixel_flow_save_v2';
export const LEGACY_SAVE_KEY = 'pixel_flow_save_v1';
export const TOTAL_LEVELS = 100;

/* =========================================================
   TYPES
========================================================= */

export type StoredProgress = {
  highestUnlockedLevel: number;
  currentResumeLevel: number;

  completedLevels: number[];

  starsByLevel: Record<number, number>;
  bestScoreByLevel: Record<number, number>;
  bestMovesByLevel: Record<number, number>;

  totalScore: number;
  coins: number;
  freeHints: number;

  totalMoves: number;
  hintsUsed: number;

  settings: GameSettings;
  tutorialSeen: boolean;

  dailyChallenge: DailyChallengeData;
  streak: StreakData;

  unlockedMilestones: string[];

  equippedTheme: string;
  unlockedThemes: string[];

  weeklyChallenge: WeeklyChallengeState;

  chapterRewardsClaimed: number[];
};

export type PlayerSave = StoredProgress;

/* =========================================================
   MILESTONES
========================================================= */

export const MILESTONES = [
  {
    id: 'first_level',
    title: 'First Flow',
    description: 'Complete 1 level',
    rewardCoins: 50,
  },
  {
    id: 'levels_5',
    title: 'Circuit Apprentice',
    description: 'Complete 5 levels',
    rewardCoins: 100,
  },
  {
    id: 'levels_10',
    title: 'Flow Specialist',
    description: 'Complete 10 levels',
    rewardCoins: 150,
  },
  {
    id: 'levels_15',
    title: 'Voltage Pioneer',
    description: 'Complete 15 levels',
    rewardCoins: 200,
  },
  {
    id: 'levels_20',
    title: 'Grid Veteran',
    description: 'Complete 20 levels',
    rewardCoins: 250,
  },
  {
    id: 'levels_30',
    title: 'Hard Path Master',
    description: 'Complete 30 levels',
    rewardCoins: 300,
  },
  {
    id: 'levels_40',
    title: 'Very Hard Conqueror',
    description: 'Complete 40 levels',
    rewardCoins: 350,
  },
  {
    id: 'levels_50',
    title: 'Halfway Zenith',
    description: 'Complete 50 levels',
    rewardCoins: 400,
  },
  {
    id: 'levels_60',
    title: 'Expert Navigator',
    description: 'Complete 60 levels',
    rewardCoins: 450,
  },
  {
    id: 'levels_70',
    title: 'Master Tactician',
    description: 'Complete 70 levels',
    rewardCoins: 500,
  },
  {
    id: 'levels_80',
    title: 'Elite Strategist',
    description: 'Complete 80 levels',
    rewardCoins: 600,
  },
  {
    id: 'levels_90',
    title: 'Legendary Prodigy',
    description: 'Complete 90 levels',
    rewardCoins: 750,
  },
  {
    id: 'levels_100',
    title: 'Pixel Flow Master',
    description: 'Complete all 100 levels',
    rewardCoins: 1000,
  },
  {
    id: 'first_3star',
    title: 'Perfectionist',
    description: 'Earn 3 stars on any level',
    rewardCoins: 50,
  },
  {
    id: 'ten_3star',
    title: 'Constellation',
    description: 'Earn 3 stars on 10 levels',
    rewardCoins: 200,
  },
  {
    id: 'twentyfive_3star',
    title: 'Star Cluster',
    description: 'Earn 3 stars on 25 levels',
    rewardCoins: 350,
  },
  {
    id: 'fifty_3star',
    title: 'Galaxy of Stars',
    description: 'Earn 3 stars on 50 levels',
    rewardCoins: 500,
  },
  {
    id: 'hundred_3star',
    title: 'Cosmic Perfection',
    description: 'Earn 3 stars on 100 levels',
    rewardCoins: 1000,
  },
  {
    id: 'first_new_best',
    title: 'Personal Best',
    description: 'Set your first new personal best',
    rewardCoins: 50,
  },
  {
    id: 'score_1000',
    title: 'Score Chaser',
    description: 'Achieve 1,000+ single level score',
    rewardCoins: 100,
  },
  {
    id: 'complete_all_100',
    title: 'Grandmaster Finale',
    description: '100 Level Completion',
    rewardCoins: 1500,
  },
] as const;

/* =========================================================
   DEFAULT SETTINGS
========================================================= */

export const DEFAULT_SETTINGS: GameSettings = {
  music: true,
  sound: true,
  vibration: true,
  colorblind: false,
  reducedMotion: false,
};

/* =========================================================
   DEFAULT PROGRESS
========================================================= */

const initialWeek = getCurrentWeekNumber();

export const DEFAULT_PROGRESS: StoredProgress = {
  highestUnlockedLevel: 1,
  currentResumeLevel: 1,

  completedLevels: [],

  starsByLevel: {},
  bestScoreByLevel: {},
  bestMovesByLevel: {},

  totalScore: 0,
  coins: 100,
  freeHints: 3,

  totalMoves: 0,
  hintsUsed: 0,

  settings: { ...DEFAULT_SETTINGS },
  tutorialSeen: false,

  dailyChallenge: {
    lastCompletedDate: null,
    bestScore: 0,
    bestMoves: 0,
    stars: 0,
  },

  streak: {
    lastPlayedDate: null,
    currentStreak: 0,
    longestStreak: 0,
  },

  unlockedMilestones: [],

  equippedTheme: DEFAULT_THEME_ID,
  unlockedThemes: [DEFAULT_THEME_ID],

  weeklyChallenge: {
    year: initialWeek.year,
    weekNumber: initialWeek.weekNumber,
    completedIndices: [],
    rewardClaimed: false,
  },

  chapterRewardsClaimed: [],
};

/* =========================================================
   HELPERS
========================================================= */

/**
 * Always return a valid level number.
 */
function clampLevel(level: number): number {
  if (!Number.isFinite(level)) {
    return 1;
  }

  return Math.min(
    TOTAL_LEVELS,
    Math.max(1, Math.floor(level))
  );
}

/**
 * Safely clone default progress.
 * Prevents accidental shared object references.
 */
function createDefaultProgress(): StoredProgress {
  return {
    highestUnlockedLevel: DEFAULT_PROGRESS.highestUnlockedLevel,
    currentResumeLevel: DEFAULT_PROGRESS.currentResumeLevel,

    completedLevels: [...DEFAULT_PROGRESS.completedLevels],

    starsByLevel: { ...DEFAULT_PROGRESS.starsByLevel },
    bestScoreByLevel: { ...DEFAULT_PROGRESS.bestScoreByLevel },
    bestMovesByLevel: { ...DEFAULT_PROGRESS.bestMovesByLevel },

    totalScore: DEFAULT_PROGRESS.totalScore,
    coins: DEFAULT_PROGRESS.coins,
    freeHints: DEFAULT_PROGRESS.freeHints,

    totalMoves: DEFAULT_PROGRESS.totalMoves,
    hintsUsed: DEFAULT_PROGRESS.hintsUsed,

    settings: {
      ...DEFAULT_SETTINGS,
    },

    tutorialSeen: DEFAULT_PROGRESS.tutorialSeen,

    dailyChallenge: {
      ...DEFAULT_PROGRESS.dailyChallenge,
    },

    streak: {
      ...DEFAULT_PROGRESS.streak,
    },

    unlockedMilestones: [...DEFAULT_PROGRESS.unlockedMilestones],

    equippedTheme: DEFAULT_PROGRESS.equippedTheme,
    unlockedThemes: [...DEFAULT_PROGRESS.unlockedThemes],

    weeklyChallenge: {
      ...DEFAULT_PROGRESS.weeklyChallenge,
      completedIndices: [
        ...DEFAULT_PROGRESS.weeklyChallenge.completedIndices,
      ],
    },

    chapterRewardsClaimed: [
      ...DEFAULT_PROGRESS.chapterRewardsClaimed,
    ],
  };
}

/**
 * Date utility for streak tracking.
 */
function getTodayDateString(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Get yesterday's local date.
 */
function getYesterdayDateString(): string {
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Clean completed levels.
 */
function normalizeCompletedLevels(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .map((level) =>
          typeof level === 'number'
            ? clampLevel(level)
            : Number(level)
        )
        .filter((level) => Number.isFinite(level))
        .map((level) => clampLevel(level))
    )
  ).sort((a, b) => a - b);
}

/**
 * Safely normalize level record objects.
 */
function normalizeNumberRecord(
  value: unknown,
  minimum = 0
): Record<number, number> {
  if (!value || typeof value !== 'object') {
    return {};
  }

  const result: Record<number, number> = {};

  for (const [key, rawValue] of Object.entries(
    value as Record<string, unknown>
  )) {
    const level = Number(key);
    const numberValue = Number(rawValue);

    if (
      Number.isFinite(level) &&
      level >= 1 &&
      level <= TOTAL_LEVELS &&
      Number.isFinite(numberValue)
    ) {
      result[clampLevel(level)] = Math.max(
        minimum,
        numberValue
      );
    }
  }

  return result;
}

/**
 * Build a complete progress object from potentially incomplete data.
 */
function normalizeProgress(
  parsed: Partial<StoredProgress> | null | undefined
): StoredProgress {
  const base = createDefaultProgress();

  if (!parsed || typeof parsed !== 'object') {
    return base;
  }

  const completedLevels = normalizeCompletedLevels(
    parsed.completedLevels
  );

  const highestUnlockedLevel = clampLevel(
    Number(parsed.highestUnlockedLevel) || 1
  );

  let currentResumeLevel = clampLevel(
    Number(parsed.currentResumeLevel) || 1
  );

  /**
   * If a player has unlocked a higher level but has no valid
   * resume level, safely use their saved resume level.
   *
   * We intentionally DO NOT force currentResumeLevel to
   * highestUnlockedLevel.
   */
  if (currentResumeLevel < 1) {
    currentResumeLevel = 1;
  }

  const normalized: StoredProgress = {
    highestUnlockedLevel,
    currentResumeLevel,

    completedLevels,

    starsByLevel: normalizeNumberRecord(
      parsed.starsByLevel,
      0
    ),

    bestScoreByLevel: normalizeNumberRecord(
      parsed.bestScoreByLevel,
      0
    ),

    bestMovesByLevel: normalizeNumberRecord(
      parsed.bestMovesByLevel,
      0
    ),

    totalScore: Math.max(
      0,
      Number(parsed.totalScore) || 0
    ),

    coins: Math.max(
      0,
      Number.isFinite(parsed.coins)
        ? Number(parsed.coins)
        : base.coins
    ),

    freeHints: Math.max(
      0,
      Number.isFinite(parsed.freeHints)
        ? Number(parsed.freeHints)
        : base.freeHints
    ),

    totalMoves: Math.max(
      0,
      Number(parsed.totalMoves) || 0
    ),

    hintsUsed: Math.max(
      0,
      Number(parsed.hintsUsed) || 0
    ),

    settings: {
      ...DEFAULT_SETTINGS,
      ...(parsed.settings || {}),
    },

    tutorialSeen: Boolean(parsed.tutorialSeen),

    dailyChallenge: {
      lastCompletedDate:
        parsed.dailyChallenge?.lastCompletedDate || null,

      bestScore: Math.max(
        0,
        Number(parsed.dailyChallenge?.bestScore) || 0
      ),

      bestMoves: Math.max(
        0,
        Number(parsed.dailyChallenge?.bestMoves) || 0
      ),

      stars: Math.max(
        0,
        Math.min(
          3,
          Number(parsed.dailyChallenge?.stars) || 0
        )
      ),
    },

    streak: {
      lastPlayedDate:
        parsed.streak?.lastPlayedDate || null,

      currentStreak: Math.max(
        0,
        Number(parsed.streak?.currentStreak) || 0
      ),

      longestStreak: Math.max(
        0,
        Number(parsed.streak?.longestStreak) || 0
      ),
    },

    unlockedMilestones:
      Array.isArray(parsed.unlockedMilestones)
        ? parsed.unlockedMilestones
        : [],

    equippedTheme:
      typeof parsed.equippedTheme === 'string'
        ? parsed.equippedTheme
        : DEFAULT_THEME_ID,

    unlockedThemes:
      Array.isArray(parsed.unlockedThemes) &&
      parsed.unlockedThemes.length > 0
        ? parsed.unlockedThemes
        : [DEFAULT_THEME_ID],

    weeklyChallenge: {
      year:
        Number(parsed.weeklyChallenge?.year) ||
        initialWeek.year,

      weekNumber:
        Number(parsed.weeklyChallenge?.weekNumber) ||
        initialWeek.weekNumber,

      completedIndices:
        Array.isArray(
          parsed.weeklyChallenge?.completedIndices
        )
          ? parsed.weeklyChallenge.completedIndices
          : [],

      rewardClaimed:
        Boolean(
          parsed.weeklyChallenge?.rewardClaimed
        ),
    },

    chapterRewardsClaimed:
      Array.isArray(parsed.chapterRewardsClaimed)
        ? parsed.chapterRewardsClaimed
        : [],
  };

  return normalized;
}

/* =========================================================
   STORAGE CLASS
========================================================= */

export class GameStorage {
  /**
   * Migrate from the previous centralized v1 save.
   *
   * This is important because changing SAVE_KEY must NOT
   * delete the player's existing progress.
   */
  private static migrateV1Save(): StoredProgress | null {
    try {
      const rawV1 = localStorage.getItem(LEGACY_SAVE_KEY);

      if (!rawV1) {
        return null;
      }

      const parsed = JSON.parse(rawV1);

      if (!parsed || typeof parsed !== 'object') {
        return null;
      }

      const migrated = normalizeProgress(parsed);

      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(migrated)
      );

      return migrated;
    } catch {
      return null;
    }
  }

  /**
   * Migrate older individual Pixel Flow keys.
   */
  private static migrateLegacySave(): StoredProgress | null {
    try {
      const legacyUnlocked = localStorage.getItem(
        'pixelflow_unlocked_level'
      );

      const legacyCompleted = localStorage.getItem(
        'pixelflow_completed_levels'
      );

      const legacyStars = localStorage.getItem(
        'pixelflow_stars'
      );

      const legacyScores = localStorage.getItem(
        'pixelflow_scores'
      );

      const legacyCoins = localStorage.getItem(
        'pixelflow_coins'
      );

      const legacyHints = localStorage.getItem(
        'pixelflow_free_hints'
      );

      const legacyCurrentLevel = localStorage.getItem(
        'pixelflow_current_level'
      );

      const legacyTutorial = localStorage.getItem(
        'pixelflow_tutorial_seen'
      );

      const legacySettings = localStorage.getItem(
        'pixelflow_settings'
      );

      const legacyStats = localStorage.getItem(
        'pixelflow_stats'
      );

      /**
       * If none of the old keys exist,
       * there is nothing to migrate.
       */
      if (
        !legacyUnlocked &&
        !legacyCompleted &&
        !legacyStars &&
        !legacyScores &&
        !legacyCoins &&
        !legacyHints &&
        !legacyCurrentLevel &&
        !legacyTutorial &&
        !legacySettings &&
        !legacyStats
      ) {
        return null;
      }

      const unlockedLevel =
        parseInt(legacyUnlocked || '1', 10) || 1;

      const completedLevels = JSON.parse(
        legacyCompleted || '[]'
      );

      const stars = JSON.parse(
        legacyStars || '{}'
      );

      const levelScores = JSON.parse(
        legacyScores || '{}'
      );

      const coins =
        parseInt(legacyCoins || '100', 10) || 100;

      const freeHints =
        parseInt(legacyHints || '3', 10) || 3;

      const currentLevel =
        parseInt(legacyCurrentLevel || '1', 10) || 1;

      const tutorialSeen =
        legacyTutorial === 'true';

      const settings =
        JSON.parse(
          legacySettings || 'null'
        ) || DEFAULT_SETTINGS;

      const stats =
        JSON.parse(
          legacyStats || 'null'
        ) || {};

      const migrated: StoredProgress =
        normalizeProgress({
          ...createDefaultProgress(),

          highestUnlockedLevel:
            clampLevel(unlockedLevel),

          currentResumeLevel:
            clampLevel(currentLevel || unlockedLevel),

          completedLevels,

          starsByLevel: stars,

          bestScoreByLevel: levelScores,

          bestMovesByLevel:
            stats.bestMovesByLevel || {},

          coins,

          freeHints,

          tutorialSeen,

          settings: {
            ...DEFAULT_SETTINGS,
            ...settings,
          },

          totalMoves:
            Number(stats.totalMoves) || 0,

          hintsUsed:
            Number(stats.hintsUsed) || 0,

          totalScore:
            Number(stats.totalScore) || 0,
        });

      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(migrated)
      );

      return migrated;
    } catch {
      return null;
    }
  }

  /**
   * Centralized loader.
   *
   * Order:
   *
   * 1. v2 save
   * 2. migrate v1 save
   * 3. migrate older individual keys
   * 4. create new default save
   *
   * This prevents accidental reset to Level 1.
   */
  public static loadSave(): StoredProgress {
    try {
      const raw = localStorage.getItem(SAVE_KEY);

      if (raw) {
        const parsed = JSON.parse(raw);

        if (parsed && typeof parsed === 'object') {
          const normalized =
            normalizeProgress(parsed);

          /**
           * Save the normalized copy immediately.
           * This guarantees missing/new fields are added.
           */
          localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(normalized)
          );

          return normalized;
        }
      }

      /**
       * Try previous centralized save.
       */
      const migratedV1 =
        this.migrateV1Save();

      if (migratedV1) {
        return migratedV1;
      }

      /**
       * Try very old individual keys.
       */
      const migratedLegacy =
        this.migrateLegacySave();

      if (migratedLegacy) {
        return migratedLegacy;
      }

      /**
       * Brand new installation.
       */
      const fresh =
        createDefaultProgress();

      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(fresh)
      );

      return fresh;
    } catch {
      /**
       * Even if LocalStorage is unavailable,
       * return a safe in-memory state.
       */
      return createDefaultProgress();
    }
  }

  /**
   * Centralized saver.
   *
   * Immediately writes to LocalStorage.
   */
  public static saveSave(
    progress: StoredProgress
  ): void {
    try {
      const normalized =
        normalizeProgress(progress);

      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(normalized)
      );
    } catch {
      /**
       * Storage unavailable or quota exceeded.
       * Gameplay should continue in memory.
       */
    }
  }

  /**
   * Save current resume level.
   *
   * This is called whenever a player enters/starts
   * a level or exits gameplay.
   *
   * IMPORTANT:
   * Restart and Exit never clear this value.
   */
  public static saveCurrentResumeLevel(
    levelId: number
  ): void {
    try {
      const progress =
        this.loadSave();

      progress.currentResumeLevel =
        clampLevel(levelId);

      this.saveSave(progress);
    } catch {
      // Ignore storage failures.
    }
  }

  /**
   * Save level completion.
   *
   * This updates:
   * - completion
   * - stars
   * - best score
   * - best moves
   * - unlock progression
   * - resume level
   * - coins
   * - statistics
   * - streak
   * - milestones
   */
  public static saveLevelCompletion(
    levelId: number,
    starsEarned: number,
    scoreEarned: number,
    movesUsed: number,
    hintUsed: boolean
  ): {
    coinsEarned: number;
    newUnlocked: boolean;
    isNewBestScore: boolean;
    isNewBestMoves: boolean;
    newMilestones: string[];
    updatedProgress: StoredProgress;
  } {
    const progress =
      this.loadSave();

    const safeLevelId =
      clampLevel(levelId);

    const safeStars =
      Math.max(
        0,
        Math.min(3, Number(starsEarned) || 0)
      );

    const safeScore =
      Math.max(
        0,
        Number(scoreEarned) || 0
      );

    const safeMoves =
      Math.max(
        0,
        Number(movesUsed) || 0
      );

    /**
     * Previous records.
     */
    const previousScore =
      progress.bestScoreByLevel[safeLevelId] || 0;

    const previousMoves =
      progress.bestMovesByLevel[safeLevelId] || 0;

    const previousStars =
      progress.starsByLevel[safeLevelId] || 0;

    const isNewBestScore =
      previousScore === 0 ||
      safeScore > previousScore;

    const isNewBestMoves =
      previousMoves === 0 ||
      safeMoves < previousMoves;

    /**
     * Never downgrade.
     */
    progress.starsByLevel[safeLevelId] =
      Math.max(
        previousStars,
        safeStars
      );

    progress.bestScoreByLevel[safeLevelId] =
      Math.max(
        previousScore,
        safeScore
      );

    progress.bestMovesByLevel[safeLevelId] =
      previousMoves === 0
        ? safeMoves
        : Math.min(
            previousMoves,
            safeMoves
          );

    /**
     * Mark completed.
     */
    const wasAlreadyCompleted =
      progress.completedLevels.includes(
        safeLevelId
      );

    if (!wasAlreadyCompleted) {
      progress.completedLevels.push(
        safeLevelId
      );

      progress.completedLevels =
        Array.from(
          new Set(
            progress.completedLevels
          )
        ).sort(
          (a, b) => a - b
        );
    }

    /**
     * Sequential unlocking.
     *
     * Maximum is now 100.
     */
    let newUnlocked = false;

    if (
      safeLevelId >=
        progress.highestUnlockedLevel &&
      safeLevelId < TOTAL_LEVELS
    ) {
      const nextLevel =
        safeLevelId + 1;

      if (
        nextLevel >
        progress.highestUnlockedLevel
      ) {
        progress.highestUnlockedLevel =
          nextLevel;

        newUnlocked = true;
      }
    }

    /**
     * Resume:
     *
     * Level 1–99 completion:
     * continue at next level.
     *
     * Level 100 completion:
     * remain on Level 100 rather than
     * creating an invalid Level 101.
     */
    if (safeLevelId < TOTAL_LEVELS) {
      progress.currentResumeLevel =
        safeLevelId + 1;
    } else {
      progress.currentResumeLevel =
        TOTAL_LEVELS;
    }

    /**
     * Never allow resume level to exceed
     * current unlocked maximum.
     */
    progress.currentResumeLevel =
      Math.min(
        progress.currentResumeLevel,
        Math.max(
          1,
          progress.highestUnlockedLevel
        )
      );

    /**
     * Coin reward.
     */
    let coinsEarned = 50;

    if (
      safeStars === 3 &&
      previousStars < 3
    ) {
      coinsEarned += 25;
    }

    if (
      !wasAlreadyCompleted &&
      safeLevelId % 5 === 0
    ) {
      coinsEarned += 100;
    }

    progress.coins +=
      coinsEarned;

    /**
     * Stats.
     */
    progress.totalMoves +=
      safeMoves;

    if (hintUsed) {
      progress.hintsUsed += 1;
    }

    /**
     * Recalculate total score
     * from best scores.
     */
    progress.totalScore =
      Object.values(
        progress.bestScoreByLevel
      ).reduce(
        (acc, score) =>
          acc + score,
        0
      );

    /**
     * Streak.
     */
    const today =
      getTodayDateString();

    const yesterday =
      getYesterdayDateString();

    if (
      progress.streak.lastPlayedDate !==
      today
    ) {
      if (
        progress.streak.lastPlayedDate ===
        yesterday
      ) {
        progress.streak.currentStreak += 1;
      } else {
        progress.streak.currentStreak = 1;
      }

      progress.streak.longestStreak =
        Math.max(
          progress.streak.longestStreak,
          progress.streak.currentStreak
        );

      progress.streak.lastPlayedDate =
        today;
    }

    /**
     * Milestones.
     */
    const newMilestones: string[] = [];

    const checkMilestone = (
      id: string,
      condition: boolean
    ) => {
      if (
        condition &&
        !progress.unlockedMilestones.includes(
          id
        )
      ) {
        progress.unlockedMilestones.push(
          id
        );

        newMilestones.push(id);

        const milestoneDef =
          MILESTONES.find(
            (m) => m.id === id
          );

        if (milestoneDef) {
          progress.coins +=
            milestoneDef.rewardCoins;

          coinsEarned +=
            milestoneDef.rewardCoins;
        }
      }
    };

    const total3Stars =
      Object.values(
        progress.starsByLevel
      ).filter(
        (stars) => stars === 3
      ).length;

    /**
     * Level milestones.
     */
    checkMilestone(
      'first_level',
      progress.completedLevels.length >= 1
    );

    checkMilestone(
      'levels_5',
      progress.completedLevels.length >= 5
    );

    checkMilestone(
      'levels_10',
      progress.completedLevels.length >= 10
    );

    checkMilestone(
      'levels_15',
      progress.completedLevels.length >= 15
    );

    checkMilestone(
      'levels_20',
      progress.completedLevels.length >= 20
    );

    checkMilestone(
      'levels_30',
      progress.completedLevels.length >= 30
    );

    checkMilestone(
      'levels_40',
      progress.completedLevels.length >= 40
    );

    checkMilestone(
      'levels_50',
      progress.completedLevels.length >= 50
    );

    checkMilestone(
      'levels_60',
      progress.completedLevels.length >= 60
    );

    checkMilestone(
      'levels_70',
      progress.completedLevels.length >= 70
    );

    checkMilestone(
      'levels_80',
      progress.completedLevels.length >= 80
    );

    checkMilestone(
      'levels_90',
      progress.completedLevels.length >= 90
    );

    checkMilestone(
      'levels_100',
      progress.completedLevels.length >= 100
    );

    /**
     * Star milestones.
     */
    checkMilestone(
      'first_3star',
      total3Stars >= 1
    );

    checkMilestone(
      'ten_3star',
      total3Stars >= 10
    );

    checkMilestone(
      'twentyfive_3star',
      total3Stars >= 25
    );

    checkMilestone(
      'fifty_3star',
      total3Stars >= 50
    );

    checkMilestone(
      'hundred_3star',
      total3Stars >= 100
    );

    /**
     * Personal best.
     */
    checkMilestone(
      'first_new_best',
      isNewBestScore ||
        isNewBestMoves
    );

    /**
     * Score milestone.
     */
    checkMilestone(
      'score_1000',
      safeScore >= 1000
    );

    /**
     * Complete everything.
     */
    checkMilestone(
      'complete_all_100',
      progress.completedLevels.length >=
        TOTAL_LEVELS
    );

    /**
     * Save immediately.
     */
    this.saveSave(progress);

    return {
      coinsEarned,
      newUnlocked,
      isNewBestScore,
      isNewBestMoves,
      newMilestones,
      updatedProgress: progress,
    };
  }

  /**
   * Save Daily Challenge completion.
   */
  public static saveDailyChallengeCompletion(
    dateStr: string,
    starsEarned: number,
    scoreEarned: number,
    movesUsed: number
  ): {
    coinsEarned: number;
    updatedProgress: StoredProgress;
  } {
    const progress =
      this.loadSave();

    const previousChallenge =
      progress.dailyChallenge;

    const isNew =
      previousChallenge.lastCompletedDate !==
      dateStr;

    progress.dailyChallenge = {
      lastCompletedDate:
        dateStr,

      bestScore:
        Math.max(
          previousChallenge.bestScore,
          Number(scoreEarned) || 0
        ),

      bestMoves:
        previousChallenge.bestMoves === 0
          ? Math.max(
              0,
              Number(movesUsed) || 0
            )
          : Math.min(
              previousChallenge.bestMoves,
              Math.max(
                0,
                Number(movesUsed) || 0
              )
            ),

      stars:
        Math.max(
          previousChallenge.stars,
          Math.min(
            3,
            Number(starsEarned) || 0
          )
        ),
    };

    let coinsEarned =
      isNew ? 100 : 25;

    progress.coins +=
      coinsEarned;

    /**
     * Daily challenge also counts toward streak.
     */
    const today =
      getTodayDateString();

    const yesterday =
      getYesterdayDateString();

    if (
      progress.streak.lastPlayedDate !==
      today
    ) {
      if (
        progress.streak.lastPlayedDate ===
        yesterday
      ) {
        progress.streak.currentStreak += 1;
      } else {
        progress.streak.currentStreak = 1;
      }

      progress.streak.longestStreak =
        Math.max(
          progress.streak.longestStreak,
          progress.streak.currentStreak
        );

      progress.streak.lastPlayedDate =
        today;
    }

    this.saveSave(progress);

    return {
      coinsEarned,
      updatedProgress: progress,
    };
  }

  /**
   * Save settings.
   */
  public static saveSettings(
    settings: GameSettings
  ): void {
    const progress =
      this.loadSave();

    progress.settings = {
      ...DEFAULT_SETTINGS,
      ...settings,
    };

    this.saveSave(progress);
  }

  /**
   * Update coin balance.
   */
  public static updateCoins(
    coins: number
  ): void {
    const progress =
      this.loadSave();

    progress.coins =
      Math.max(
        0,
        Number(coins) || 0
      );

    this.saveSave(progress);
  }

  /**
   * Update free hints.
   */
  public static updateFreeHints(
    freeHints: number
  ): void {
    const progress =
      this.loadSave();

    progress.freeHints =
      Math.max(
        0,
        Math.floor(
          Number(freeHints) || 0
        )
      );

    this.saveSave(progress);
  }

  /**
   * Reset ALL progress.
   *
   * IMPORTANT:
   * This should only be called by:
   *
   * Settings
   * ->
   * Reset Progress
   * ->
   * Confirm Reset
   *
   * Normal Restart / Retry / Exit / Refresh
   * must NEVER call this method.
   */
  public static resetProgress(): StoredProgress {
    try {
      localStorage.removeItem(
        SAVE_KEY
      );

      localStorage.removeItem(
        LEGACY_SAVE_KEY
      );

      /**
       * Clean up old keys too.
       */
      localStorage.removeItem(
        'pixelflow_unlocked_level'
      );

      localStorage.removeItem(
        'pixelflow_completed_levels'
      );

      localStorage.removeItem(
        'pixelflow_stars'
      );

      localStorage.removeItem(
        'pixelflow_scores'
      );

      localStorage.removeItem(
        'pixelflow_coins'
      );

      localStorage.removeItem(
        'pixelflow_free_hints'
      );

      localStorage.removeItem(
        'pixelflow_current_level'
      );

      localStorage.removeItem(
        'pixelflow_tutorial_seen'
      );

      localStorage.removeItem(
        'pixelflow_stats'
      );

      localStorage.removeItem(
        'pixelflow_settings'
      );

      localStorage.removeItem(
        'pixelflow_overall_best_score'
      );
    } catch {
      // Ignore storage errors.
    }

    const resetState =
      createDefaultProgress();

    this.saveSave(
      resetState
    );

    return resetState;
  }

  /**
   * Get statistics.
   */
  public static getStats(
    progress?: StoredProgress
  ): GameStats {
    const p =
      progress ||
      this.loadSave();

    const totalStars =
      Object.values(
        p.starsByLevel
      ).reduce(
        (acc, stars) =>
          acc + stars,
        0
      );

    const scoreValues =
      Object.values(
        p.bestScoreByLevel
      );

    const bestScore =
      scoreValues.length > 0
        ? Math.max(...scoreValues)
        : 0;

    return {
      levelsCompleted:
        p.completedLevels.length,

      totalStars,

      bestScore,

      totalMoves:
        p.totalMoves,

      hintsUsed:
        p.hintsUsed,
    };
  }
}