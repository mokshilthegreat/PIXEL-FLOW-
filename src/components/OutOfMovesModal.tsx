import React from 'react';
import { RotateCcw, AlertTriangle, Home, LayoutGrid } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface OutOfMovesModalProps {
  levelId: number;
  moves: number;
  maxMoves: number;
  connectedFlows: number;
  totalFlows: number;
  onRetry: () => void;
  onLevelSelect: () => void;
  onHome: () => void;
}

export const OutOfMovesModal: React.FC<OutOfMovesModalProps> = ({
  levelId,
  moves,
  maxMoves,
  connectedFlows,
  totalFlows,
  onRetry,
  onLevelSelect,
  onHome,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div
        id="modal-out-of-moves"
        className="glass-panel w-full max-w-sm rounded-3xl p-6 md:p-8 flex flex-col items-center text-center relative border border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.25)]"
      >
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-4 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-bounce-subtle">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-black tracking-wider text-rose-400 font-display mb-1">
          OUT OF MOVES
        </h2>
        <p className="text-xs text-slate-300 mb-6">
          Level {levelId} move limit reached ({maxMoves} max moves).
        </p>

        {/* Stats Card */}
        <div className="w-full bg-slate-900/80 rounded-2xl p-4 border border-white/10 flex items-center justify-around mb-6">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Moves Used
            </span>
            <span className="text-xl font-mono font-bold text-rose-400">
              {moves} / {maxMoves}
            </span>
          </div>

          <div className="w-px h-8 bg-white/10" />

          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Flows Linked
            </span>
            <span className="text-xl font-mono font-bold text-emerald-400">
              {connectedFlows} / {totalFlows}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          {/* Primary Action: RETRY LEVEL */}
          <button
            id="btn-retry-level"
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              onRetry();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-display font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(244,63,94,0.4)] active:scale-98 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RETRY LEVEL</span>
          </button>

          {/* Secondary Actions: Level Select & Home */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="btn-out-of-moves-levels"
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                onLevelSelect();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-display font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Levels</span>
            </button>

            <button
              id="btn-out-of-moves-home"
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                onHome();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-display font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
