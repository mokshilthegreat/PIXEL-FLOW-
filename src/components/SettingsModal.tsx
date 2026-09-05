import React, { useState } from 'react';
import { X, Music, Volume2, Smartphone, Eye, RotateCcw, Info } from 'lucide-react';
import { GameSettings } from '../game/types';
import { soundManager } from '../utils/audio';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const toggle = (key: keyof GameSettings) => {
    const updated = {
      ...settings,
      [key]: !settings[key],
    };
    soundManager.playButtonClick();
    onUpdateSettings(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl glass-panel p-6 border border-white/10 shadow-2xl flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-display font-black text-xl tracking-wider neon-text-pixel">
            SETTINGS
          </h2>
          <button
            id="settings-btn-close"
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

        {/* Toggle options */}
        <div className="flex flex-col gap-2.5">
          {/* Music */}
          <div className="flex items-center justify-between p-3 rounded-2xl glass-panel border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Music className="w-4 h-4" />
              </div>
              <span className="font-display font-medium text-sm text-slate-200">Ambient Music</span>
            </div>
            <button
              id="toggle-music"
              type="button"
              onClick={() => toggle('music')}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
                settings.music ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  settings.music ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between p-3 rounded-2xl glass-panel border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Volume2 className="w-4 h-4" />
              </div>
              <span className="font-display font-medium text-sm text-slate-200">Sound Effects</span>
            </div>
            <button
              id="toggle-sound"
              type="button"
              onClick={() => toggle('sound')}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
                settings.sound ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  settings.sound ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Vibration */}
          <div className="flex items-center justify-between p-3 rounded-2xl glass-panel border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="font-display font-medium text-sm text-slate-200">Haptics</span>
            </div>
            <button
              id="toggle-vibration"
              type="button"
              onClick={() => toggle('vibration')}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
                settings.vibration ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  settings.vibration ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Colorblind Mode */}
          <div className="flex items-center justify-between p-3 rounded-2xl glass-panel border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Eye className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-medium text-sm text-slate-200">Colorblind Mode</span>
                <span className="text-[10px] text-slate-400">Adds shape symbols inside nodes</span>
              </div>
            </div>
            <button
              id="toggle-colorblind"
              type="button"
              onClick={() => toggle('colorblind')}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
                settings.colorblind ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  settings.colorblind ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reset Progress Section */}
        <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex flex-col gap-2.5">
          {!showConfirmReset ? (
            <button
              id="btn-trigger-reset"
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-display font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Reset Game Progress</span>
            </button>
          ) : (
            <div className="flex flex-col gap-3 p-1">
              <div className="text-center flex flex-col gap-1">
                <span className="text-sm text-rose-300 font-display font-black tracking-wider">
                  RESET ALL PROGRESS?
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed text-left px-2">
                  This will erase:
                  <br />• levels
                  <br />• stars
                  <br />• best scores
                  <br />• coins
                  <br />• hints
                  <br />• statistics
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  id="btn-cancel-reset"
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-display font-bold text-xs active:scale-95 transition-all cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  id="btn-confirm-reset"
                  type="button"
                  onClick={() => {
                    onResetProgress();
                    setShowConfirmReset(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-display font-bold text-xs shadow-[0_0_15px_rgba(225,29,72,0.4)] active:scale-95 transition-all cursor-pointer"
                >
                  RESET
                </button>
              </div>
            </div>
          )}
        </div>

        {/* About App */}
        <div className="text-center flex flex-col items-center gap-1 text-[11px] text-slate-500 pt-1 border-t border-white/[0.04]">
          <div className="flex items-center gap-1 text-slate-400 font-display">
            <Info className="w-3 h-3 text-cyan-400" />
            <span className="font-bold">PIXEL FLOW!</span> v1.0.0
          </div>
          <div>Connect • Solve • Relax</div>
        </div>
      </div>
    </div>
  );
};
