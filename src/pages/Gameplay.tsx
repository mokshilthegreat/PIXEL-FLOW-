import React, { useState, useEffect, useCallback } from 'react';
import { Level, Position, CompletedPaths, GameSettings } from '../game/types';
import { TopHUD } from '../components/TopHUD';
import { GameBoard } from '../components/GameBoard';
import { BottomControls } from '../components/BottomControls';
import { PauseModal } from '../components/PauseModal';
import { LevelCompleteModal } from '../components/LevelCompleteModal';
import { OutOfMovesModal } from '../components/OutOfMovesModal';
import { SettingsModal } from '../components/SettingsModal';
import { HowToPlayModal } from '../components/HowToPlayModal';
import { StatsModal } from '../components/StatsModal';
import { isLevelCompleted } from '../game/gameEngine';
import { calculateScoreAndStars } from '../game/scoring';
import { COLOR_MAP } from '../game/colors';
import { GameStorage, PlayerSave } from '../utils/storage';
import { soundManager } from '../utils/audio';
import { getTodayKey } from '../game/dailyChallenge';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface GameplayProps {
  level: Level;
  totalLevels: number;
  settings: GameSettings;
  coins: number;
  freeHints: number;
  bestScoreForLevel: number;
  bestMovesForLevel?: number;
  isDaily?: boolean;
  onUpdateSettings: (s: GameSettings) => void;
  onResetProgress: () => void;
  onCoinsUpdated: (coins: number) => void;
  onFreeHintsUpdated: (hints: number) => void;
  onProgressUpdated?: (save: PlayerSave) => void;
  onBackToLevelSelect: () => void;
  onNextLevel: () => void;
  onGoHome: () => void;
}

export const Gameplay: React.FC<GameplayProps> = ({
  level,
  totalLevels,
  settings,
  coins,
  freeHints,
  bestScoreForLevel,
  bestMovesForLevel,
  isDaily = false,
  onUpdateSettings,
  onResetProgress,
  onCoinsUpdated,
  onFreeHintsUpdated,
  onProgressUpdated,
  onBackToLevelSelect,
  onNextLevel,
  onGoHome,
}) => {
  const [completedPaths, setCompletedPaths] = useState<CompletedPaths>({});
  const [history, setHistory] = useState<{ paths: CompletedPaths; moves: number }[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);
  const [activeHintPairId, setActiveHintPairId] = useState<string | null>(null);

  // Modals state
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isOutOfMoves, setIsOutOfMoves] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [levelCompleteData, setLevelCompleteData] = useState<{
    score: number;
    stars: number;
    coinsEarned: number;
    bestScore: number;
    isNewBestScore: boolean;
    isNewBestMoves: boolean;
    streakCount: number;
    newMilestones: string[];
  } | null>(null);

  // When level mounts or changes: ensure persistent resume level is saved immediately
  useEffect(() => {
    setCompletedPaths({});
    setHistory([]);
    setMoves(0);
    setHintsUsedCount(0);
    setActiveHintPairId(null);
    setLevelCompleteData(null);
    setIsPaused(false);
    setIsOutOfMoves(false);
    setShowSettings(false);
    setShowHowToPlay(false);
    setShowStats(false);

    if (!isDaily) {
      GameStorage.saveCurrentResumeLevel(level.id);
    }
  }, [level.id, isDaily]);

  // Restart CURRENT LEVEL immediately
  const handleRestart = useCallback(() => {
    setCompletedPaths({});
    setHistory([]);
    setMoves(0);
    setActiveHintPairId(null);
    setLevelCompleteData(null);
    setIsOutOfMoves(false);
    setIsPaused(false);
    setShowStats(false);
  }, []);

  // Path completed by player dragging
  const handlePathComplete = useCallback(
    (pairId: string, path: Position[]) => {
      // If already completed or out of moves, ignore
      if (levelCompleteData || isOutOfMoves) return;

      // Save snapshot in history for Undo
      setHistory((prev) => [...prev, { paths: completedPaths, moves }]);

      const updated = {
        ...completedPaths,
        [pairId]: path,
      };
      setCompletedPaths(updated);
      const currentMovesCount = moves + 1;
      setMoves(currentMovesCount);

      // If active hint was for this pair, clear it
      if (activeHintPairId === pairId) {
        setActiveHintPairId(null);
      }

      // Check level completion
      if (isLevelCompleted(level, updated)) {
        const { score, stars } = calculateScoreAndStars(level, currentMovesCount, hintsUsedCount);

        if (isDaily) {
          const todayKey = getTodayKey();
          const { coinsEarned, updatedProgress } = GameStorage.saveDailyChallengeCompletion(
            todayKey,
            stars,
            score,
            currentMovesCount
          );
          onCoinsUpdated(updatedProgress.coins);
          onProgressUpdated?.(updatedProgress);

          setTimeout(() => {
            setLevelCompleteData({
              score,
              stars,
              coinsEarned,
              bestScore: score,
              isNewBestScore: true,
              isNewBestMoves: true,
              streakCount: updatedProgress.streak.currentStreak,
              newMilestones: [],
            });
          }, 400);
        } else {
          const {
            coinsEarned,
            isNewBestScore,
            isNewBestMoves,
            newMilestones,
            updatedProgress,
          } = GameStorage.saveLevelCompletion(
            level.id,
            stars,
            score,
            currentMovesCount,
            hintsUsedCount > 0
          );
          onCoinsUpdated(updatedProgress.coins);
          onProgressUpdated?.(updatedProgress);

          setTimeout(() => {
            setLevelCompleteData({
              score,
              stars,
              coinsEarned,
              bestScore: updatedProgress.bestScoreByLevel[level.id] || Math.max(bestScoreForLevel, score),
              isNewBestScore,
              isNewBestMoves,
              streakCount: updatedProgress.streak.currentStreak,
              newMilestones,
            });
          }, 400);
        }
      } else if (currentMovesCount >= (level.moveLimit ?? level.maxMoves)) {
        // Reached move limit without completing puzzle
        soundManager.playInvalidMovement();
        setIsOutOfMoves(true);
      }
    },
    [
      completedPaths,
      level,
      moves,
      hintsUsedCount,
      activeHintPairId,
      bestScoreForLevel,
      isDaily,
      levelCompleteData,
      isOutOfMoves,
      onCoinsUpdated,
      onProgressUpdated,
    ]
  );

  // Path removed during redraw
  const handlePathRemoved = useCallback(
    (pairId: string) => {
      if (completedPaths[pairId]) {
        setHistory((prev) => [...prev, { paths: completedPaths, moves }]);
        const updated = { ...completedPaths };
        delete updated[pairId];
        setCompletedPaths(updated);
      }
    },
    [completedPaths, moves]
  );

  // Undo action
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setCompletedPaths(previous.paths);
    setMoves(previous.moves);
    if (isOutOfMoves) {
      setIsOutOfMoves(false);
    }
  }, [history, isOutOfMoves]);

  // Hint action
  const handleHint = useCallback(() => {
    if (activeHintPairId || isOutOfMoves || levelCompleteData) return;

    // Determine cost: Free hint or 100 coins
    if (freeHints > 0) {
      const newHints = freeHints - 1;
      onFreeHintsUpdated(newHints);
      GameStorage.updateFreeHints(newHints);
    } else if (coins >= 100) {
      const newCoins = coins - 100;
      onCoinsUpdated(newCoins);
      GameStorage.updateCoins(newCoins);
    } else {
      return; // Cannot afford
    }

    setHintsUsedCount((h) => h + 1);
    soundManager.playHint();

    // Find first uncompleted pair
    const uncompletedPair = level.pairs.find((p) => !completedPaths[p.id]);
    if (uncompletedPair) {
      setActiveHintPairId(uncompletedPair.id);

      // If the level has pre-solved path, connect it as a helpful bonus!
      if (level.solution && level.solution[uncompletedPair.id]) {
        const solvedPath = level.solution[uncompletedPair.id];
        setTimeout(() => {
          handlePathComplete(uncompletedPair.id, solvedPath);
        }, 900);
      }
    }
  }, [
    activeHintPairId,
    isOutOfMoves,
    levelCompleteData,
    freeHints,
    coins,
    onFreeHintsUpdated,
    onCoinsUpdated,
    level,
    completedPaths,
    handlePathComplete,
  ]);

  const connectedPairsCount = Object.keys(completedPaths).length;
  const totalPairsCount = level.pairs.length;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between relative z-10 select-none overflow-hidden">
      {/* Top HUD - Responsive Mobile 2-Row Header */}
      <TopHUD
        levelId={level.id}
        totalLevels={totalLevels}
        moves={moves}
        maxMoves={level.moveLimit ?? level.maxMoves}
        bestMoves={bestMovesForLevel}
        bestScore={bestScoreForLevel}
        coins={coins}
        onBack={onBackToLevelSelect}
        onPause={() => setIsPaused(true)}
      />

      {/* Main Play Area */}
      <div className="flex-1 w-full flex items-center justify-center min-h-0 overflow-hidden px-2 md:px-6 py-1 gap-6 max-w-7xl mx-auto">
        {/* Desktop Left Sidebar: Progression & Milestone */}
        <div className="hidden lg:flex flex-col gap-4 w-64 shrink-0 py-2">
          {/* Progression Overview */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold font-display">
                {isDaily ? 'DAILY PUZZLE' : 'PROGRESSION'}
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {isDaily ? 'SPECIAL' : `${level.id} / ${totalLevels}`}
              </span>
            </div>

            {!isDaily && (
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>TIER {Math.floor((level.id - 1) / 10) + 1}</span>
                  <span className="text-cyan-300 font-bold">{level.difficulty}</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: 10 }, (_, i) => {
                    const tierStart = Math.floor((level.id - 1) / 10) * 10 + 1;
                    const lvlNum = tierStart + i;
                    if (lvlNum > totalLevels) return null;
                    const isCurrent = lvlNum === level.id;
                    const isPast = lvlNum < level.id;
                    return (
                      <div
                        key={lvlNum}
                        className={`h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold border transition-all ${
                          isCurrent
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                            : isPast
                            ? 'bg-slate-800/80 border-slate-700 text-slate-400'
                            : 'bg-slate-900/40 border-slate-800/40 text-slate-600'
                        }`}
                      >
                        {lvlNum}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Objective Card */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-display font-bold">GRID OBJECTIVE</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Connect matching endpoints without crossing paths. Complete all {totalPairsCount} flows with {level.moveLimit ?? level.maxMoves} max moves.
            </p>
          </div>
        </div>

        {/* Center: Game Board Container */}
        <div className="w-full flex-1 max-w-[480px] h-full flex flex-col items-center justify-center px-2 py-0">
          <GameBoard
            level={level}
            completedPaths={completedPaths}
            colorblindMode={settings.colorblind}
            activeHintPairId={activeHintPairId}
            onPathComplete={handlePathComplete}
            onPathRemoved={handlePathRemoved}
            isLevelComplete={!!levelCompleteData || isOutOfMoves}
          />
        </div>

        {/* Desktop Right Sidebar: Flows Connected Status */}
        <div className="hidden lg:flex flex-col gap-4 w-64 shrink-0 py-2">
          <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-display font-bold text-slate-300">FLOWS STATUS</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {connectedPairsCount}/{totalPairsCount}
              </span>
            </div>

            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              {level.pairs.map((p) => {
                const isConnected = !!completedPaths[p.id];
                const colorConfig = COLOR_MAP[p.color];
                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                      isConnected
                        ? 'bg-slate-800/80 border-white/10 text-white'
                        : 'bg-slate-900/30 border-white/5 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{
                          backgroundColor: colorConfig.hex,
                          boxShadow: isConnected ? `0 0 8px ${colorConfig.hex}` : 'none',
                        }}
                      />
                      <span className="text-xs font-display capitalize font-medium">
                        {p.color} Flow
                      </span>
                    </div>

                    {isConnected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-[10px] font-mono text-slate-600">Pending</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <BottomControls
        canUndo={history.length > 0}
        freeHints={freeHints}
        coins={coins}
        onUndo={handleUndo}
        onRestart={handleRestart}
        onHint={handleHint}
      />

      {/* Sub-footer subtle dot bar */}
      <footer className="h-6 bg-slate-900/40 border-t border-slate-800/60 flex items-center justify-center px-4 md:px-8 w-full shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-pink-500/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
        </div>
      </footer>

      {/* Pause Modal */}
      {isPaused && (
        <PauseModal
          onResume={() => setIsPaused(false)}
          onRestart={handleRestart}
          onHowToPlay={() => {
            setIsPaused(false);
            setShowHowToPlay(true);
          }}
          onSettings={() => {
            setIsPaused(false);
            setShowSettings(true);
          }}
          onHome={onGoHome}
        />
      )}

      {/* Out of Moves Modal */}
      {isOutOfMoves && (
        <OutOfMovesModal
          levelId={level.id}
          moves={moves}
          maxMoves={level.moveLimit ?? level.maxMoves}
          connectedFlows={connectedPairsCount}
          totalFlows={totalPairsCount}
          onRetry={handleRestart}
          onLevelSelect={() => {
            setIsOutOfMoves(false);
            onBackToLevelSelect();
          }}
          onHome={() => {
            setIsOutOfMoves(false);
            onGoHome();
          }}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          onResetProgress={() => {
            onResetProgress();
            setShowSettings(false);
            onGoHome();
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* How To Play Modal */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {/* Stats Modal */}
      {showStats && (
        <StatsModal
          stats={GameStorage.getStats()}
          coins={coins}
          totalLevels={totalLevels}
          streak={GameStorage.loadSave().streak}
          unlockedMilestones={GameStorage.loadSave().unlockedMilestones}
          onClose={() => setShowStats(false)}
        />
      )}

      {/* Level Complete Celebration Modal */}
      {levelCompleteData && (
        <LevelCompleteModal
          levelId={level.id}
          totalLevels={totalLevels}
          moves={moves}
          score={levelCompleteData.score}
          bestScore={levelCompleteData.bestScore}
          stars={levelCompleteData.stars}
          coinsEarned={levelCompleteData.coinsEarned}
          isNewBestScore={levelCompleteData.isNewBestScore}
          isNewBestMoves={levelCompleteData.isNewBestMoves}
          streakCount={levelCompleteData.streakCount}
          newMilestones={levelCompleteData.newMilestones}
          isDaily={isDaily}
          onNextLevel={onNextLevel}
          onReplay={handleRestart}
          onHome={onGoHome}
          onLevelSelect={onBackToLevelSelect}
          onStats={() => setShowStats(true)}
        />
      )}
    </div>
  );
};
