import React from 'react';
import { Play, RotateCcw, HelpCircle, Settings, Home } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onHowToPlay: () => void;
  onSettings: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHowToPlay,
  onSettings,
  onHome,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl glass-panel p-6 border border-white/10 shadow-2xl flex flex-col items-center gap-5">
        <h2 className="font-display font-black text-2xl tracking-widest neon-text-pixel">
          PAUSED
        </h2>

        <div className="w-full flex flex-col gap-3">
          {/* RESUME */}
          <button
            id="pause-btn-resume"
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              onResume();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.45)] active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>RESUME</span>
          </button>

          {/* RESTART */}
          <button
            id="pause-btn-restart"
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              onRestart();
            }}
            className="w-full py-3 px-4 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-100 font-display font-bold text-sm tracking-wider flex items-center justify-center gap-2 border border-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-pink-400" />
            <span>RESTART LEVEL</span>
          </button>

          {/* HOW TO PLAY */}
          <button
            id="pause-btn-howto"
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              onHowToPlay();
            }}
            className="w-full py-3 px-4 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-200 font-display font-bold text-sm tracking-wider flex items-center justify-center gap-2 border border-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>HOW TO PLAY</span>
          </button>

          {/* SETTINGS */}
          <button
            id="pause-btn-settings"
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              onSettings();
            }}
            className="w-full py-3 px-4 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-200 font-display font-bold text-sm tracking-wider flex items-center justify-center gap-2 border border-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-purple-400" />
            <span>SETTINGS</span>
          </button>

          {/* HOME */}
          <button
            id="pause-btn-home"
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              onHome();
            }}
            className="w-full py-3 px-4 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 font-display font-bold text-sm tracking-wider flex items-center justify-center gap-2 border border-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>EXIT TO HOME</span>
          </button>
        </div>
      </div>
    </div>
  );
};
