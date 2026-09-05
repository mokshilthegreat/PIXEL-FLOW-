import React from 'react';
import { X, Trophy, Star, Footprints, Lightbulb, Coins, Flame, Award, CheckCircle2, Lock } from 'lucide-react';
import { GameStats, StreakData } from '../game/types';
import { soundManager } from '../utils/audio';
import { MILESTONES } from '../utils/storage';

interface StatsModalProps {
  stats: GameStats;
  coins: number;
  totalLevels: number;
  streak?: StreakData;
  unlockedMilestones?: string[];
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  stats,
  coins,
  totalLevels,
  streak,
  unlockedMilestones = [],
  onClose,
}) => {
  const maxStars = totalLevels * 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md max-h-[90vh] rounded-3xl glass-panel p-5 sm:p-6 border border-white/10 shadow-2xl flex flex-col gap-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="font-display font-black text-xl tracking-wider neon-text-pixel">
              CAREER STATS
            </h2>
          </div>
          <button
            id="stats-btn-close"
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-slate-400 hover:text-white border border-white/10 active:scale-90 transition-transform cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Daily Streak Highlight */}
        {streak && (
          <div className="p-3.5 rounded-2xl glass-panel border border-orange-500/20 bg-orange-950/10 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Flame className="w-6 h-6 fill-orange-400 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-orange-300">Play Streak</p>
                <p className="text-base font-display font-black text-white">
                  {streak.currentStreak} {streak.currentStreak === 1 ? 'Day' : 'Days'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">Best Streak</p>
              <p className="text-sm font-mono font-bold text-amber-400">{streak.longestStreak} Days</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 shrink-0">
          {/* Levels Completed */}
          <div className="p-3 rounded-2xl glass-panel border border-white/10 flex flex-col gap-0.5 shadow-sm">
            <span className="text-[9px] uppercase font-bold text-slate-400">Levels Cleared</span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-bold text-lg text-cyan-300">{stats.levelsCompleted}</span>
              <span className="text-xs text-slate-500 font-mono">/ {totalLevels}</span>
            </div>
          </div>

          {/* Total Stars */}
          <div className="p-3 rounded-2xl glass-panel border border-white/10 flex flex-col gap-0.5 shadow-sm">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="text-[9px] uppercase font-bold text-slate-400">Total Stars</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-bold text-lg text-amber-300">{stats.totalStars}</span>
              <span className="text-xs text-slate-500 font-mono">/ {maxStars}</span>
            </div>
          </div>

          {/* Highest Score */}
          <div className="p-3 rounded-2xl glass-panel border border-white/10 flex flex-col gap-0.5 shadow-sm">
            <span className="text-[9px] uppercase font-bold text-slate-400">Best Score</span>
            <span className="font-mono font-bold text-lg text-emerald-300">{stats.bestScore}</span>
          </div>

          {/* Coins Balance */}
          <div className="p-3 rounded-2xl glass-panel border border-white/10 flex flex-col gap-0.5 shadow-sm">
            <div className="flex items-center gap-1 text-yellow-400">
              <Coins className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-bold text-slate-400">Coins</span>
            </div>
            <span className="font-mono font-bold text-lg text-yellow-300">{coins}</span>
          </div>

          {/* Total Moves */}
          <div className="p-3 rounded-2xl glass-panel border border-white/10 flex flex-col gap-0.5 shadow-sm">
            <div className="flex items-center gap-1 text-indigo-400">
              <Footprints className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-bold text-slate-400">Total Moves</span>
            </div>
            <span className="font-mono font-bold text-base text-slate-200">{stats.totalMoves}</span>
          </div>

          {/* Hints Used */}
          <div className="p-3 rounded-2xl glass-panel border border-white/10 flex flex-col gap-0.5 shadow-sm">
            <div className="flex items-center gap-1 text-amber-400">
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-bold text-slate-400">Hints Used</span>
            </div>
            <span className="font-mono font-bold text-base text-slate-200">{stats.hintsUsed}</span>
          </div>
        </div>

        {/* Milestones Section */}
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-display font-bold text-purple-300">
              <Award className="w-4 h-4 text-purple-400" />
              <span>MILESTONES</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              {unlockedMilestones.length} / {MILESTONES.length} Unlocked
            </span>
          </div>

          <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
            {MILESTONES.map((m) => {
              const isUnlocked = unlockedMilestones.includes(m.id);
              return (
                <div
                  key={m.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    isUnlocked
                      ? 'glass-panel border-purple-500/30 bg-purple-950/20'
                      : 'bg-slate-900/30 border-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <div className="text-left">
                      <p className="text-xs font-display font-bold text-white leading-tight">{m.title}</p>
                      <p className="text-[10px] text-slate-400">{m.description}</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono font-bold text-yellow-400 shrink-0">
                    +{m.rewardCoins} 🪙
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Close Button */}
        <button
          id="stats-btn-back"
          type="button"
          onClick={() => {
            soundManager.playButtonClick();
            onClose();
          }}
          className="w-full py-3 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-100 font-display font-bold text-xs tracking-wider border border-white/10 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};
