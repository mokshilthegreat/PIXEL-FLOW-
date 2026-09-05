import React from 'react';
import { Undo2, Lightbulb, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface BottomControlsProps {
  canUndo: boolean;
  onUndo: () => void;
  onHint: () => void;
  onRestart: () => void;
  freeHints: number;
  coins: number;
  isHintActive: boolean;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  canUndo,
  onUndo,
  onHint,
  onRestart,
  freeHints,
  coins,
  isHintActive,
}) => {
  const hasHintResource = freeHints > 0 || coins >= 100;

  return (
    <div className="w-full max-w-md px-4 py-3 flex items-center justify-center gap-4 sm:gap-6 shrink-0">
      {/* UNDO */}
      <button
        id="btn-undo"
        type="button"
        disabled={!canUndo}
        onClick={() => {
          soundManager.playButtonClick();
          onUndo();
        }}
        className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex flex-col items-center justify-center gap-0.5 md:gap-1 transition-all duration-150 group border border-white/10 ${
          canUndo
            ? 'glass-panel hover:bg-slate-800/80 active:scale-95 cursor-pointer shadow-lg'
            : 'bg-slate-900/30 opacity-40 cursor-not-allowed'
        }`}
        aria-label="Undo move"
      >
        <Undo2 className="w-5 h-5 text-cyan-400 group-active:scale-90 transition-transform" />
        <span className="text-[9px] uppercase font-bold text-slate-400">UNDO</span>
      </button>

      {/* HINT */}
      <button
        id="btn-hint"
        type="button"
        disabled={!hasHintResource || isHintActive}
        onClick={() => {
          soundManager.playButtonClick();
          onHint();
        }}
        className={`px-6 md:px-8 h-14 md:h-16 rounded-2xl flex items-center gap-3 transition-all duration-150 active:scale-95 relative shadow-lg ${
          hasHintResource && !isHintActive
            ? 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.45)] text-white cursor-pointer'
            : 'bg-slate-900/40 text-slate-600 border border-slate-800/40 opacity-50 cursor-not-allowed'
        }`}
        aria-label="Get hint"
      >
        <Lightbulb className={`w-5 h-5 ${isHintActive ? 'text-amber-300 animate-pulse' : 'text-amber-300'}`} />
        <div className="text-left">
          <p className="text-xs md:text-sm font-bold uppercase leading-none font-display">HINT</p>
          <p className="text-[10px] text-indigo-200 mt-0.5">
            {freeHints > 0 ? `${freeHints} Free` : '100 🪙'}
          </p>
        </div>
      </button>

      {/* RESET */}
      <button
        id="btn-restart"
        type="button"
        onClick={() => {
          soundManager.playButtonClick();
          onRestart();
        }}
        className="w-14 h-14 md:w-16 md:h-16 rounded-2xl glass-panel flex flex-col items-center justify-center gap-0.5 md:gap-1 hover:bg-slate-800/80 transition-all duration-150 group border border-white/10 active:scale-95 cursor-pointer shadow-lg"
        aria-label="Restart level"
      >
        <RotateCcw className="w-5 h-5 text-pink-400 group-active:rotate-180 transition-transform duration-500" />
        <span className="text-[9px] uppercase font-bold text-slate-400">RESET</span>
      </button>
    </div>
  );
};
