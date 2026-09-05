import React, { useEffect, useState } from 'react';
import { Star, Play, RotateCcw, Home, Sparkles, Flame, Trophy, Grid, BarChart3, Crown } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { hapticsManager } from '../utils/haptics';
import { motion } from 'motion/react';
import { MILESTONES } from '../utils/storage';

interface LevelCompleteModalProps {
  levelId: number;
  totalLevels: number;
  moves: number;
  score: number;
  bestScore: number;
  stars: number;
  coinsEarned: number;
  isNewBestScore?: boolean;
  isNewBestMoves?: boolean;
  streakCount?: number;
  newMilestones?: string[];
  isDaily?: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onHome: () => void;
  onLevelSelect?: () => void;
  onStats?: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelId,
  totalLevels,
  moves,
  score,
  bestScore,
  stars,
  coinsEarned,
  isNewBestScore = false,
  isNewBestMoves = false,
  streakCount,
  newMilestones = [],
  isDaily = false,
  onNextLevel,
  onReplay,
  onHome,
  onLevelSelect,
  onStats,
}) => {
  const [displayedStars, setDisplayedStars] = useState<number>(0);
  const isFinalMasterLevel = !isDaily && levelId >= totalLevels;

  useEffect(() => {
    soundManager.playLevelCompletion();
    hapticsManager.success();

    // Sequence star reveals
    const timers: number[] = [];
    for (let i = 1; i <= stars; i++) {
      const timer = window.setTimeout(() => {
        setDisplayedStars(i);
        soundManager.playStarReveal(i - 1);
        hapticsManager.light();
      }, 400 + i * 350);
      timers.push(timer);
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [stars]);

  const hasNextLevel = !isDaily && levelId < totalLevels;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="w-full max-w-sm rounded-3xl glass-panel p-6 border border-white/10 shadow-2xl flex flex-col items-center gap-4 relative overflow-hidden"
      >
        {/* Glow backdrop behind stars */}
        <div
          className={`absolute -top-24 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
            isFinalMasterLevel ? 'bg-amber-400/30' : 'bg-cyan-500/20'
          }`}
        />

        {/* Title Section */}
        <div className="text-center z-10 flex flex-col items-center w-full">
          {isFinalMasterLevel ? (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-[11px] font-bold mb-1 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>100 / 100 COMPLETED</span>
              </div>

              <h2 className="font-display font-black text-2xl sm:text-3xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]">
                PIXEL FLOW MASTER!
              </h2>

              <p className="text-xs font-display font-bold text-cyan-300 mt-1 tracking-wider uppercase">
                YOU COMPLETED THE ENTIRE FLOW.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-300 font-mono text-[10px] mb-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                {isDaily ? 'DAILY CHALLENGE CLEARED' : `LEVEL ${levelId} / ${totalLevels} CLEARED`}
              </div>

              <h2 className="font-display font-black text-2xl tracking-wider flex items-center justify-center gap-2">
                <span className="neon-text-pixel">LEVEL</span>
                <span className="neon-text-flow">COMPLETE!</span>
              </h2>
            </>
          )}

          {/* New Record Banner */}
          {(isNewBestScore || isNewBestMoves) && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.06, 1], opacity: 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono text-[10px] font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>NEW PERSONAL BEST!</span>
            </motion.div>
          )}

          {/* Streak notification */}
          {streakCount !== undefined && streakCount > 0 && (
            <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-display font-bold text-orange-400">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              <span>{streakCount} DAY STREAK!</span>
            </div>
          )}
        </div>

        {/* Animated Stars */}
        <div className="flex items-center justify-center gap-3 my-0.5 z-10">
          {[1, 2, 3].map((starNum) => {
            const isEarned = starNum <= displayedStars;
            return (
              <motion.div
                key={starNum}
                animate={
                  isEarned
                    ? { scale: [0.5, 1.35, 1], rotate: [0, -15, 0] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.35 }}
                className="relative"
              >
                <Star
                  className={`w-12 h-12 transition-all duration-300 ${
                    isEarned
                      ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                      : 'text-slate-800 fill-slate-900 border border-transparent'
                  }`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Newly Unlocked Milestone Banner */}
        {newMilestones.length > 0 && (
          <div className="w-full glass-panel rounded-xl p-2.5 border border-purple-500/30 bg-purple-950/20 flex items-center gap-2 z-10">
            <Trophy className="w-5 h-5 text-purple-400 shrink-0" />
            <div className="text-left flex-1 min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-purple-300 font-bold">MILESTONE UNLOCKED!</p>
              <p className="text-xs font-display font-bold text-white truncate">
                {MILESTONES.find((m) => m.id === newMilestones[0])?.title || 'Achievement Unlocked'}
              </p>
            </div>
          </div>
        )}

        {/* Stats breakdown card */}
        <div className="w-full glass-panel rounded-2xl p-4 border border-white/10 flex flex-col gap-2.5 z-10 shadow-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Moves</span>
            <span className="font-mono font-bold text-cyan-300">{moves}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Score</span>
            <span className="font-mono font-bold text-amber-300 text-sm">+{score}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Coins Earned</span>
            <span className="font-mono font-bold text-yellow-400">+{coinsEarned} 🪙</span>
          </div>

          <div className="h-px bg-white/10 my-0.5" />

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Best Score</span>
            <span className="font-mono font-bold text-white">{bestScore}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 z-10 mt-1">
          {/* If there's a next level */}
          {hasNextLevel ? (
            <button
              id="complete-btn-next"
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                onNextLevel();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.5)] active:scale-95 transition-all cursor-pointer"
            >
              <span>NEXT LEVEL</span>
              <Play className="w-4 h-4 fill-white" />
            </button>
          ) : isFinalMasterLevel ? (
            /* Level 100 Celebration Action Buttons */
            <div className="flex flex-col gap-2 w-full">
              <button
                id="complete-btn-replay-100"
                type="button"
                onClick={() => {
                  soundManager.playButtonClick();
                  onReplay();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-display font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.5)] active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>REPLAY LEVEL 100</span>
              </button>

              <div className="grid grid-cols-3 gap-2">
                {onLevelSelect && (
                  <button
                    id="complete-btn-levelselect"
                    type="button"
                    onClick={() => {
                      soundManager.playButtonClick();
                      onLevelSelect();
                    }}
                    className="py-2.5 px-2 rounded-xl glass-panel hover:bg-slate-800 text-slate-200 font-display font-bold text-[11px] tracking-wider flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition-all cursor-pointer shadow-sm"
                  >
                    <Grid className="w-3.5 h-3.5 text-indigo-400" />
                    <span>LEVELS</span>
                  </button>
                )}

                <button
                  id="complete-btn-home"
                  type="button"
                  onClick={() => {
                    soundManager.playButtonClick();
                    onHome();
                  }}
                  className="py-2.5 px-2 rounded-xl glass-panel hover:bg-slate-800 text-slate-200 font-display font-bold text-[11px] tracking-wider flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  <Home className="w-3.5 h-3.5 text-cyan-400" />
                  <span>HOME</span>
                </button>

                {onStats && (
                  <button
                    id="complete-btn-stats"
                    type="button"
                    onClick={() => {
                      soundManager.playButtonClick();
                      onStats();
                    }}
                    className="py-2.5 px-2 rounded-xl glass-panel hover:bg-slate-800 text-slate-200 font-display font-bold text-[11px] tracking-wider flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition-all cursor-pointer shadow-sm"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>STATS</span>
                  </button>
                )}
              </div>
            </div>
          ) : null}

          {/* Normal level bottom row: Replay & Home */}
          {!isFinalMasterLevel && (
            <div className="flex items-center gap-2.5">
              {/* REPLAY */}
              <button
                id="complete-btn-replay"
                type="button"
                onClick={() => {
                  soundManager.playButtonClick();
                  onReplay();
                }}
                className="flex-1 py-3 px-3 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-200 font-display font-bold text-xs tracking-wider flex items-center justify-center gap-2 border border-white/10 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-pink-400" />
                <span>REPLAY</span>
              </button>

              {/* HOME */}
              <button
                id="complete-btn-home"
                type="button"
                onClick={() => {
                  soundManager.playButtonClick();
                  onHome();
                }}
                className="flex-1 py-3 px-3 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-200 font-display font-bold text-xs tracking-wider flex items-center justify-center gap-2 border border-white/10 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <Home className="w-3.5 h-3.5 text-cyan-400" />
                <span>HOME</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
