import React, { useState, useMemo } from 'react';
import { ArrowLeft, Star, Coins, ChevronLeft, ChevronRight } from 'lucide-react';
import { Level } from '../game/types';
import { LevelCard } from '../components/LevelCard';
import { soundManager } from '../utils/audio';

interface LevelSelectProps {
  levels: Level[];
  unlockedLevel: number;
  currentLevel: number;
  stars: Record<number, number>;
  totalStars: number;
  maxStars: number;
  coins: number;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

interface TierDefinition {
  index: number;
  label: string;
  name: string;
  rangeText: string;
  startId: number;
  endId: number;
}

const TIERS: TierDefinition[] = [
  { index: 0, label: '1–10', name: 'Beginner', rangeText: 'Levels 1–10', startId: 1, endId: 10 },
  { index: 1, label: '11–20', name: 'Easy / Hard', rangeText: 'Levels 11–20', startId: 11, endId: 20 },
  { index: 2, label: '21–30', name: 'Hard+', rangeText: 'Levels 21–30', startId: 21, endId: 30 },
  { index: 3, label: '31–40', name: 'Very Hard', rangeText: 'Levels 31–40', startId: 31, endId: 40 },
  { index: 4, label: '41–50', name: 'Expert', rangeText: 'Levels 41–50', startId: 41, endId: 50 },
  { index: 5, label: '51–60', name: 'Expert++', rangeText: 'Levels 51–60', startId: 51, endId: 60 },
  { index: 6, label: '61–70', name: 'Master', rangeText: 'Levels 61–70', startId: 61, endId: 70 },
  { index: 7, label: '71–80', name: 'Master++', rangeText: 'Levels 71–80', startId: 71, endId: 80 },
  { index: 8, label: '81–90', name: 'Elite', rangeText: 'Levels 81–90', startId: 81, endId: 90 },
  { index: 9, label: '91–100', name: 'Legendary', rangeText: 'Levels 91–100', startId: 91, endId: 100 },
];

export const LevelSelect: React.FC<LevelSelectProps> = ({
  levels,
  unlockedLevel,
  currentLevel,
  stars,
  totalStars,
  maxStars,
  coins,
  onSelectLevel,
  onBack,
}) => {
  // Auto-focus the tier containing player's current or unlocked level
  const defaultTierIndex = useMemo(() => {
    const focusLevel = currentLevel > 0 ? currentLevel : unlockedLevel > 0 ? unlockedLevel : 1;
    return Math.max(0, Math.min(9, Math.floor((focusLevel - 1) / 10)));
  }, [currentLevel, unlockedLevel]);

  const [selectedTierIndex, setSelectedTierIndex] = useState<number | 'all'>(defaultTierIndex);

  const activeTier = typeof selectedTierIndex === 'number' ? TIERS[selectedTierIndex] : null;

  const filteredLevels = useMemo(() => {
    if (selectedTierIndex === 'all') {
      return levels;
    }
    const tier = TIERS[selectedTierIndex];
    return levels.filter((lvl) => lvl.id >= tier.startId && lvl.id <= tier.endId);
  }, [levels, selectedTierIndex]);

  // Calculate completion for active tier
  const tierStats = useMemo(() => {
    if (!activeTier) return null;
    const tierLevels = levels.filter((l) => l.id >= activeTier.startId && l.id <= activeTier.endId);
    const completedCount = tierLevels.filter((l) => (stars[l.id] || 0) > 0).length;
    const tierStars = tierLevels.reduce((sum, l) => sum + (stars[l.id] || 0), 0);
    return {
      completedCount,
      totalCount: tierLevels.length,
      stars: tierStars,
      maxStars: tierLevels.length * 3,
    };
  }, [activeTier, levels, stars]);

  const handlePrevTier = () => {
    if (typeof selectedTierIndex === 'number' && selectedTierIndex > 0) {
      soundManager.playButtonClick();
      setSelectedTierIndex(selectedTierIndex - 1);
    }
  };

  const handleNextTier = () => {
    if (typeof selectedTierIndex === 'number' && selectedTierIndex < TIERS.length - 1) {
      soundManager.playButtonClick();
      setSelectedTierIndex(selectedTierIndex + 1);
    }
  };

  return (
    <div className="w-full h-full flex flex-col max-w-lg mx-auto relative z-10 select-none">
      {/* Top Header */}
      <header className="w-full px-4 py-3 flex items-center justify-between border-b border-white/10 glass-panel shrink-0">
        <button
          id="btn-levelselect-back"
          type="button"
          onClick={() => {
            soundManager.playButtonClick();
            onBack();
          }}
          className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all shadow"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="font-display font-black text-xl tracking-wider flex items-center gap-1">
          <span className="neon-text-pixel">SELECT</span>
          <span className="neon-text-flow">LEVEL</span>
        </h1>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs">
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-mono font-bold text-xs text-yellow-300">{coins}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-mono font-bold text-xs text-amber-300">
              {totalStars}/{maxStars}
            </span>
          </div>
        </div>
      </header>

      {/* Tier Selector Horizontal Scroll Bar */}
      <div className="w-full overflow-x-auto py-2 px-3 flex items-center gap-1.5 bg-slate-900/50 border-b border-white/5 no-scrollbar shrink-0">
        {TIERS.map((tier) => {
          const isSelected = selectedTierIndex === tier.index;
          const isTierUnlocked = tier.startId <= unlockedLevel;
          return (
            <button
              key={tier.index}
              id={`tier-tab-${tier.index}`}
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setSelectedTierIndex(tier.index);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-display font-bold uppercase transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_12px_rgba(79,70,229,0.5)] scale-105'
                  : isTierUnlocked
                  ? 'bg-slate-800/70 text-slate-300 border-white/10 hover:bg-slate-800 hover:text-white'
                  : 'bg-slate-900/40 text-slate-500 border-transparent hover:text-slate-400'
              }`}
            >
              {tier.label}
            </button>
          );
        })}

        {/* All Levels Option */}
        <button
          id="tier-tab-all"
          type="button"
          onClick={() => {
            soundManager.playButtonClick();
            setSelectedTierIndex('all');
          }}
          className={`px-3 py-1 rounded-xl text-xs font-display font-bold uppercase transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
            selectedTierIndex === 'all'
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_12px_rgba(79,70,229,0.5)] scale-105'
              : 'bg-slate-800/70 text-slate-300 border-white/10 hover:bg-slate-800 hover:text-white'
          }`}
        >
          All (100)
        </button>
      </div>

      {/* Tier Status & Fast Pagination Header */}
      {activeTier && tierStats && (
        <div className="w-full px-4 py-2 flex items-center justify-between bg-slate-950/40 border-b border-white/5 shrink-0">
          <button
            id="btn-prev-tier"
            type="button"
            disabled={selectedTierIndex === 0}
            onClick={handlePrevTier}
            className={`p-1.5 rounded-lg border transition-all ${
              selectedTierIndex === 0
                ? 'opacity-30 border-transparent text-slate-600 cursor-not-allowed'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white active:scale-95 cursor-pointer'
            }`}
            aria-label="Previous tier"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center">
            <span className="font-display font-black text-sm text-cyan-300 tracking-wider uppercase">
              {activeTier.rangeText} • {activeTier.name}
            </span>
            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
              <span>{tierStats.completedCount}/{tierStats.totalCount} Cleared</span>
              <span>•</span>
              <span className="text-amber-300">{tierStats.stars}/{tierStats.maxStars} ★</span>
            </div>
          </div>

          <button
            id="btn-next-tier"
            type="button"
            disabled={selectedTierIndex === TIERS.length - 1}
            onClick={handleNextTier}
            className={`p-1.5 rounded-lg border transition-all ${
              selectedTierIndex === TIERS.length - 1
                ? 'opacity-30 border-transparent text-slate-600 cursor-not-allowed'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white active:scale-95 cursor-pointer'
            }`}
            aria-label="Next tier"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid of Level Cards */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pb-8">
          {filteredLevels.map((lvl) => {
            const isUnlocked = lvl.id <= unlockedLevel;
            const isCurrent = lvl.id === currentLevel;
            const levelStars = stars[lvl.id] || 0;

            return (
              <LevelCard
                key={lvl.id}
                levelId={lvl.id}
                size={lvl.size}
                difficulty={lvl.difficulty}
                isUnlocked={isUnlocked}
                isCurrent={isCurrent}
                stars={levelStars}
                onSelect={onSelectLevel}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
