import React from 'react';
import { ArrowLeft, Pause } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface TopHUDProps {
  levelId: number;
  totalLevels: number;
  moves: number;
  maxMoves: number;
  bestMoves?: number;
  bestScore?: number;
  coins?: number;
  onBack: () => void;
  onPause: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  levelId,
  totalLevels,
  moves,
  maxMoves,
  bestMoves,
  bestScore,
  coins,
  onBack,
  onPause,
}) => {
  // Best display priority: bestMoves > bestScore > '—'
  const bestDisplay =
    bestMoves && bestMoves > 0
      ? `${bestMoves}`
      : bestScore && bestScore > 0
      ? `${bestScore}`
      : '—';

  const isNearLimit = moves >= maxMoves - 1;
  const isAtLimit = moves >= maxMoves;

  return (
    <header className="w-full glass-panel z-10 border-b border-white/10 shrink-0 px-3 py-2 sm:px-4 sm:py-2.5 md:px-8 md:py-3 flex flex-col gap-1.5 sm:gap-2">
      {/* Row 1: Back | PIXEL FLOW! | Pause */}
      <div className="w-full flex items-center justify-between">
        {/* Left: Back Button */}
        <button
          id="hud-btn-back"
          type="button"
          onClick={() => {
            soundManager.playButtonClick();
            onBack();
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800/90 flex items-center justify-center cursor-pointer border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700 active:scale-95 transition-all shadow"
          aria-label="Back to level select"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Center: PIXEL FLOW! Title */}
        <div className="flex items-center justify-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-wider flex items-center gap-1 font-display">
            <span className="neon-text-pixel">PIXEL</span>
            <span className="neon-text-flow">FLOW!</span>
          </h1>
        </div>

        {/* Right: Pause Button */}
        <button
          id="hud-btn-pause"
          type="button"
          onClick={() => {
            soundManager.playButtonClick();
            onPause();
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800/90 flex items-center justify-center cursor-pointer border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700 active:scale-95 transition-all shadow"
          aria-label="Pause game"
        >
          <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Row 2: Level 27/30 | Moves 0/8 | Best 6 | Coins */}
      <div className="w-full flex items-center justify-between gap-1 sm:gap-2 px-1 text-xs">
        {/* Stat 1: Level */}
        <div className="flex items-center gap-1 font-mono font-bold whitespace-nowrap">
          <span className="text-[10px] sm:text-xs text-slate-400 font-sans font-semibold">Level</span>
          <span className="text-white text-xs sm:text-sm">
            {levelId}/{totalLevels}
          </span>
        </div>

        {/* Subtle Divider */}
        <div className="w-px h-3.5 bg-white/10 shrink-0" />

        {/* Stat 2: Moves current / maxMoves */}
        <div className="flex items-center gap-1 font-mono font-bold whitespace-nowrap">
          <span className="text-[10px] sm:text-xs text-slate-400 font-sans font-semibold">Moves</span>
          <span
            className={`text-xs sm:text-sm font-bold ${
              isAtLimit
                ? 'text-rose-400 font-black animate-pulse'
                : isNearLimit
                ? 'text-amber-400'
                : 'text-cyan-400'
            }`}
          >
            {moves}/{maxMoves}
          </span>
        </div>

        {/* Subtle Divider */}
        <div className="w-px h-3.5 bg-white/10 shrink-0" />

        {/* Stat 3: Best */}
        <div className="flex items-center gap-1 font-mono font-bold whitespace-nowrap">
          <span className="text-[10px] sm:text-xs text-slate-400 font-sans font-semibold">Best</span>
          <span className="text-yellow-400 text-xs sm:text-sm">{bestDisplay}</span>
        </div>

        {/* Subtle Divider */}
        <div className="w-px h-3.5 bg-white/10 shrink-0" />

        {/* Stat 4: Coins */}
        <div className="flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-700/80 shadow-sm whitespace-nowrap shrink-0">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-400 rounded-full shadow-[0_0_6px_#EAB308]" />
          <span className="font-mono font-bold text-[11px] sm:text-xs text-yellow-300">
            {coins ?? 0}
          </span>
        </div>
      </div>
    </header>
  );
};
