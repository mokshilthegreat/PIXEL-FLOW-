import React, { useState, useEffect } from 'react';
import { GameScreen, GameSettings } from './game/types';
import { LEVELS } from './game/levels';
import { GameStorage, PlayerSave } from './utils/storage';
import { soundManager } from './utils/audio';
import { hapticsManager } from './utils/haptics';
import { getDailyChallengeLevel, getTodayKey } from './game/dailyChallenge';
import { BackgroundParticles } from './components/BackgroundParticles';
import { Home } from './pages/Home';
import { LevelSelect } from './pages/LevelSelect';
import { Gameplay } from './pages/Gameplay';
import { HowToPlayModal } from './components/HowToPlayModal';
import { StatsModal } from './components/StatsModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [save, setSave] = useState<PlayerSave>(() => GameStorage.loadSave());
  const [screen, setScreen] = useState<GameScreen>('home');
  const [activeLevelId, setActiveLevelId] = useState<number>(() => save.currentResumeLevel || 1);
  const [isDaily, setIsDaily] = useState<boolean>(false);

  // Global modals
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Sync sound & haptics settings
  useEffect(() => {
    soundManager.setSoundEnabled(save.settings.sound);
    soundManager.setMusicEnabled(save.settings.music);
    hapticsManager.setEnabled(save.settings.vibration);
  }, [save.settings]);

  // Total stars calculated
  const totalStars = Object.values(save.starsByLevel).reduce((sum: number, s: number) => sum + s, 0);
  const maxStars = LEVELS.length * 3;

  // Handle settings update
  const handleUpdateSettings = (newSettings: GameSettings) => {
    GameStorage.saveSettings(newSettings);
    setSave((prev) => ({
      ...prev,
      settings: newSettings,
    }));
  };

  // Handle progress reset
  const handleResetProgress = () => {
    const fresh = GameStorage.resetProgress();
    setSave(fresh);
    setActiveLevelId(1);
    setIsDaily(false);
    setScreen('home');
  };

  // Handle level selection
  const handleSelectLevel = (levelId: number) => {
    setActiveLevelId(levelId);
    GameStorage.saveCurrentResumeLevel(levelId);
    setIsDaily(false);
    setScreen('gameplay');
  };

  // Play / Continue button on Home
  const handleContinueFromHome = () => {
    const resumeLevel = save.currentResumeLevel || 1;
    handleSelectLevel(resumeLevel);
  };

  // Play Daily Challenge
  const handlePlayDailyChallenge = () => {
    setIsDaily(true);
    setScreen('gameplay');
  };

  // Next level handler
  const handleNextLevel = () => {
    if (activeLevelId < LEVELS.length) {
      handleSelectLevel(activeLevelId + 1);
    } else {
      setScreen('level_select');
    }
  };

  // Progress updated by game engine
  const handleProgressUpdated = (updatedSave: PlayerSave) => {
    setSave(updatedSave);
  };

  const currentLevelData = LEVELS.find((l) => l.id === activeLevelId) || LEVELS[0];
  const dailyLevelData = getDailyChallengeLevel();
  const todayKey = getTodayKey();
  const isDailyCompleted = save.dailyChallenge.lastCompletedDate === todayKey;

  const scoreValues = Object.values(save.bestScoreByLevel) as number[];
  const bestScore = scoreValues.length > 0 ? Math.max(...scoreValues) : 0;

  const hasSavedProgress =
    save.completedLevels.length > 0 ||
    save.currentResumeLevel > 1 ||
    save.highestUnlockedLevel > 1 ||
    Object.keys(save.starsByLevel).length > 0;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A0E1A] text-slate-100 flex flex-col items-center justify-center font-sans select-none pixel-grid">
      {/* Dynamic Background Neon Particles Canvas */}
      <BackgroundParticles />

      {/* Screen Router */}
      <main className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
        {screen === 'home' && (
          <Home
            currentResumeLevel={save.currentResumeLevel || 1}
            highestUnlockedLevel={save.highestUnlockedLevel || 1}
            totalLevels={LEVELS.length}
            hasSavedProgress={hasSavedProgress}
            totalStars={totalStars}
            maxStars={maxStars}
            bestScore={bestScore}
            coins={save.coins}
            streakCount={save.streak.currentStreak}
            isDailyCompleted={isDailyCompleted}
            onContinue={handleContinueFromHome}
            onLevelSelect={() => setScreen('level_select')}
            onDailyChallenge={handlePlayDailyChallenge}
            onHowToPlay={() => setShowHowToPlay(true)}
            onStats={() => setShowStats(true)}
            onSettings={() => setShowSettings(true)}
          />
        )}

        {screen === 'level_select' && (
          <LevelSelect
            levels={LEVELS}
            unlockedLevel={save.highestUnlockedLevel}
            currentLevel={save.currentResumeLevel}
            stars={save.starsByLevel}
            totalStars={totalStars}
            maxStars={maxStars}
            coins={save.coins}
            onSelectLevel={handleSelectLevel}
            onBack={() => setScreen('home')}
          />
        )}

        {screen === 'gameplay' && (
          <Gameplay
            key={isDaily ? 'daily-level' : currentLevelData.id}
            level={isDaily ? dailyLevelData : currentLevelData}
            totalLevels={LEVELS.length}
            settings={save.settings}
            coins={save.coins}
            freeHints={save.freeHints}
            bestScoreForLevel={save.bestScoreByLevel[isDaily ? 1000 : currentLevelData.id] || 0}
            bestMovesForLevel={save.bestMovesByLevel[isDaily ? 1000 : currentLevelData.id]}
            isDaily={isDaily}
            onUpdateSettings={handleUpdateSettings}
            onResetProgress={handleResetProgress}
            onCoinsUpdated={(newCoins) => {
              setSave((prev) => ({ ...prev, coins: newCoins }));
            }}
            onFreeHintsUpdated={(newHints) => {
              setSave((prev) => ({ ...prev, freeHints: newHints }));
            }}
            onProgressUpdated={handleProgressUpdated}
            onBackToLevelSelect={() => {
              setIsDaily(false);
              GameStorage.saveCurrentResumeLevel(activeLevelId);
              setSave((prev) => ({ ...prev, currentResumeLevel: activeLevelId }));
              setScreen('level_select');
            }}
            onNextLevel={handleNextLevel}
            onGoHome={() => {
              setIsDaily(false);
              GameStorage.saveCurrentResumeLevel(activeLevelId);
              setSave((prev) => ({ ...prev, currentResumeLevel: activeLevelId }));
              setScreen('home');
            }}
          />
        )}
      </main>

      {/* Global Modals */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {showStats && (
        <StatsModal
          stats={GameStorage.getStats()}
          coins={save.coins}
          totalLevels={LEVELS.length}
          streak={save.streak}
          unlockedMilestones={save.unlockedMilestones}
          onClose={() => setShowStats(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={save.settings}
          onUpdateSettings={handleUpdateSettings}
          onResetProgress={handleResetProgress}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
