import React from 'react';
import { Lock, Star } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface LevelCardProps {
  levelId: number;
  isUnlocked: boolean;
  isCurrent: boolean;
  stars: number;
  size: number;
  difficulty?: string;
  onSelect: (levelId: number) => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({
  levelId,
  isUnlocked,
  isCurrent,
  stars,
  size,
  difficulty,
  onSelect,
}) => {
  return (
    <button
      id={`level-card-${levelId}`}
      type="button"
      disabled={!isUnlocked}
      onClick={() => {
        if (isUnlocked) {
          soundManager.playButtonClick();
          onSelect(levelId);
        }
      }}
      className={`relative rounded-2xl flex flex-col items-center justify-between p-2.5 border transition-all duration-200 aspect-square select-none ${
        isUnlocked
          ? isCurrent
            ? 'bg-gradient-to-b from-indigo-950/80 to-slate-900 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)] active:scale-95'
            : 'glass-panel hover:bg-slate-800/80 border-white/10 hover:border-indigo-500/40 active:scale-95 cursor-pointer'
          : 'bg-slate-950/60 border-white/[0.04] opacity-35 cursor-not-allowed'
      }`}
    >
      {/* Top row: Grid Size badge & Difficulty */}
      <div className="w-full flex items-center justify-between">
        <span className="text-[9px] font-mono text-slate-500 font-semibold tracking-tighter">
          {size}x{size}
        </span>
        {difficulty && isUnlocked && (
          <span className="text-[8px] font-display uppercase tracking-wider text-cyan-400/80 font-bold truncate max-w-[50px]">
            {difficulty.replace('+', '⁺')}
          </span>
        )}
      </div>

      {/* Level Number or Lock Icon */}
      <div className="flex items-center justify-center my-auto">
        {isUnlocked ? (
          <span
            className={`font-display font-black text-xl ${
              isCurrent ? 'neon-text-pixel text-2xl scale-105' : 'text-white'
            }`}
          >
            {levelId}
          </span>
        ) : (
          <Lock className="w-4 h-4 text-slate-600" />
        )}
      </div>

      {/* Stars display */}
      <div className="flex items-center gap-0.5">
        {isUnlocked ? (
          [1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-3 h-3 ${
                s <= stars
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]'
                  : 'text-slate-700 fill-slate-800'
              }`}
            />
          ))
        ) : (
          <div className="h-3" />
        )}
      </div>
    </button>
  );
};
