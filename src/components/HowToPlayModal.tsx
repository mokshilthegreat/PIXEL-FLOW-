import React from 'react';
import { X, CheckCircle2, XCircle, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl glass-panel p-6 border border-white/10 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <h2 className="font-display font-black text-xl tracking-wider neon-text-pixel">
              HOW TO PLAY
            </h2>
          </div>
          <button
            id="howto-btn-close"
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

        {/* Goal Card */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col gap-1 shadow-sm">
          <span className="font-display font-bold text-xs uppercase tracking-wider text-cyan-300">
            OBJECTIVE
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Connect each pair of matching colored nodes to create glowing neon pathways. Connect every pair to clear the level!
          </p>
        </div>

        {/* Rules Checklist */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl glass-panel border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white">Orthogonal Movement:</span> Drag <span className="text-cyan-300 font-bold">UP</span>, <span className="text-cyan-300 font-bold">DOWN</span>, <span className="text-cyan-300 font-bold">LEFT</span>, or <span className="text-cyan-300 font-bold">RIGHT</span>.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl glass-panel border border-white/10">
            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white">No Diagonals:</span> Diagonal moves and jumping cells are strictly blocked.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl glass-panel border border-white/10">
            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white">No Crossing:</span> Paths cannot overlap or cut through other completed paths or different colored dots.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl glass-panel border border-white/10">
            <RefreshCw className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white">Backtracking:</span> Drag back along your active path to retract and try a different route.
            </div>
          </div>
        </div>

        {/* Visual Tip */}
        <div className="p-3 rounded-2xl glass-panel border border-white/10 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          </div>
          <span className="text-[11px] font-mono font-bold text-amber-300">3 STARS FOR PAR!</span>
        </div>

        {/* Close Button */}
        <button
          id="howto-btn-gotit"
          type="button"
          onClick={() => {
            soundManager.playButtonClick();
            onClose();
          }}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-black text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(79,70,229,0.5)] active:scale-95 transition-all mt-1 cursor-pointer"
        >
          GOT IT, LET&apos;S PLAY!
        </button>
      </div>
    </div>
  );
};
