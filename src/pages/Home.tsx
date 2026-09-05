import React from 'react';
import {
  Play,
  Grid3X3,
  HelpCircle,
  Trophy,
  Settings,
  Star,
  Coins,
  CalendarDays,
  Flame,
  ChevronRight,
  BarChart3,
  Plus,
} from 'lucide-react';
import { motion } from 'motion/react';
import { soundManager } from '../utils/audio';
import { getTodayDisplayDate } from '../game/dailyChallenge';

interface HomeProps {
  currentResumeLevel: number;
  highestUnlockedLevel: number;
  totalLevels?: number;
  hasSavedProgress: boolean;
  totalStars: number;
  maxStars: number;
  bestScore: number;
  coins: number;
  streakCount: number;
  isDailyCompleted: boolean;
  onContinue: () => void;
  onLevelSelect: () => void;
  onDailyChallenge: () => void;
  onHowToPlay: () => void;
  onStats: () => void;
  onSettings: () => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const Home: React.FC<HomeProps> = ({
  currentResumeLevel,
  highestUnlockedLevel,
  totalLevels = 100,
  hasSavedProgress,
  totalStars,
  maxStars,
  bestScore,
  coins,
  streakCount,
  isDailyCompleted,
  onContinue,
  onLevelSelect,
  onDailyChallenge,
  onHowToPlay,
  onStats,
  onSettings,
}) => {
  const safeLevel = clamp(Math.floor(currentResumeLevel || 1), 1, totalLevels);
  const completedLevels = clamp(
    Math.max(0, Math.min(totalLevels, highestUnlockedLevel - 1)),
    0,
    totalLevels
  );
  const progress = clamp((completedLevels / totalLevels) * 100, 2, 100);

  const click = () => {
    try {
      soundManager.playButtonClick();
    } catch {
      // Keep UI interaction working even when audio is unavailable.
    }
  };

  const particles = Array.from({ length: 26 });

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-[#020813] text-white select-none">
      <style>{`
        @keyframes pfFloat {
          0%, 100% { transform: translate3d(0,0,0); opacity:.10; }
          50% { transform: translate3d(4px,-10px,0); opacity:.42; }
        }
        @keyframes pfSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pfSpinReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes pfPulse {
          0%,100% { transform: scale(.96); opacity:.72; }
          50% { transform: scale(1.05); opacity:1; }
        }
        @keyframes pfBeam {
          0% { transform: translateX(-120%) rotate(-10deg); opacity:0; }
          10% { opacity:.30; }
          50% { opacity:.12; }
          100% { transform: translateX(520%) rotate(-10deg); opacity:0; }
        }
        @keyframes pfFlow {
          to { stroke-dashoffset: -120; }
        }
        @keyframes pfFlowReverse {
          to { stroke-dashoffset: 120; }
        }
        @keyframes pfButtonGlow {
          0%,100% { box-shadow: 0 0 22px rgba(34,211,238,.12), inset 0 1px 0 rgba(255,255,255,.08); }
          50% { box-shadow: 0 0 34px rgba(34,211,238,.23), inset 0 1px 0 rgba(255,255,255,.10); }
        }
        @keyframes pfCardGlow {
          0%,100% { box-shadow: inset 0 1px 0 rgba(255,255,255,.05), 0 0 0 rgba(0,0,0,0); }
          50% { box-shadow: inset 0 1px 0 rgba(255,255,255,.07), 0 0 18px rgba(56,189,248,.04); }
        }
        @keyframes pfStarShimmer {
          0%,100% { transform: scale(1) rotate(0deg); opacity:.88; }
          50% { transform: scale(1.08) rotate(4deg); opacity:1; }
        }

        .pf-particle { animation: pfFloat linear infinite; }
        .pf-orbit { animation: pfSpin 28s linear infinite; transform-origin: center; }
        .pf-orbit-reverse { animation: pfSpinReverse 22s linear infinite; transform-origin: center; }
        .pf-core-pulse { animation: pfPulse 4.4s ease-in-out infinite; transform-origin: center; }
        .pf-path { animation: pfFlow 3.6s linear infinite; }
        .pf-path-reverse { animation: pfFlowReverse 4.2s linear infinite; }
        .pf-continue { animation: pfButtonGlow 3.4s ease-in-out infinite; }
        .pf-card { animation: pfCardGlow 4s ease-in-out infinite; }
        .pf-star { animation: pfStarShimmer 2.6s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .pf-particle,
          .pf-orbit,
          .pf-orbit-reverse,
          .pf-core-pulse,
          .pf-path,
          .pf-path-reverse,
          .pf-continue,
          .pf-card,
          .pf-star {
            animation: none !important;
          }
        }
      `}</style>

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_21%,rgba(36,211,238,.12),transparent_26%),radial-gradient(circle_at_12%_74%,rgba(99,102,241,.09),transparent_24%),radial-gradient(circle_at_88%_70%,rgba(217,70,239,.08),transparent_26%),linear-gradient(180deg,#020711_0%,#04101d_52%,#020711_100%)]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.34) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.34) 1px, transparent 1px)',
            backgroundSize: '38px 38px',
          }}
        />

        <div className="absolute left-[-10%] top-[18%] h-48 w-[80%] rotate-[23deg] rounded-full bg-cyan-400/[0.07] blur-3xl" />
        <div className="absolute right-[-18%] top-[49%] h-48 w-[70%] -rotate-[24deg] rounded-full bg-fuchsia-500/[0.06] blur-3xl" />

        {particles.map((_, index) => (
          <span
            key={index}
            className="pf-particle absolute rounded-[2px] bg-sky-200"
            style={{
              width: index % 6 === 0 ? 3 : index % 3 === 0 ? 2 : 1,
              height: index % 6 === 0 ? 3 : index % 3 === 0 ? 2 : 1,
              left: `${4 + ((index * 29) % 92)}%`,
              top: `${4 + ((index * 41) % 92)}%`,
              animationDelay: `${index * 0.17}s`,
              animationDuration: `${4.2 + (index % 5) * 0.65}s`,
            }}
          />
        ))}
      </div>

      {/* MAIN */}
      <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-[430px] flex-col overflow-hidden px-4 pt-2 pb-2 sm:px-5">

        {/* TOP RESOURCE PILLS */}
        <motion.div
          className="flex shrink-0 items-center justify-between gap-2"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {/* Coins */}
          <div className="flex min-w-0 items-center gap-2 rounded-full border border-cyan-300/15 bg-[#071321]/90 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-xl">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-yellow-400 to-orange-500 shadow-[0_0_12px_rgba(250,204,21,.4)]">
              <Coins className="h-3.5 w-3.5 text-[#412500]" />
            </div>
            <span className="font-mono text-[12px] font-black text-yellow-200">
              {coins}
            </span>
            <Plus className="h-3.5 w-3.5 rounded-full bg-slate-700/60 p-[2px] text-slate-200" />
          </div>

          {/* Streak */}
          <motion.div
            className="flex shrink-0 items-center gap-2 rounded-full border border-orange-300/20 bg-[#1a1209]/70 px-4 py-1.5 backdrop-blur-xl"
            animate={{
              boxShadow: [
                '0 0 0 rgba(249,115,22,0)',
                '0 0 20px rgba(249,115,22,.12)',
                '0 0 0 rgba(249,115,22,0)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Flame className="h-4 w-4 fill-orange-400 text-orange-400" />
            <span className="font-mono text-[12px] font-black text-orange-100">
              {streakCount}d
            </span>
          </motion.div>

          {/* Stars */}
          <div className="flex min-w-0 items-center gap-2 rounded-full border border-blue-300/15 bg-[#071321]/90 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-xl">
            <motion.div className="pf-star">
              <Star className="h-5 w-5 fill-yellow-300 text-yellow-300 drop-shadow-[0_0_9px_rgba(250,204,21,.45)]" />
            </motion.div>
            <span className="font-mono text-[12px] font-black text-yellow-100">
              {totalStars}/{maxStars}
            </span>
            <Plus className="h-3.5 w-3.5 rounded-full bg-slate-700/60 p-[2px] text-slate-200" />
          </div>
        </motion.div>

        {/* HERO */}
        <div className="flex shrink-0 flex-col items-center">

          {/* PIXEL CORE */}
          <motion.div
            className="relative mt-3 h-[205px] w-[300px] shrink-0 sm:h-[215px]"
            initial={{ opacity: 0, scale: 0.86, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* large glow */}
            <div className="absolute left-1/2 top-1/2 h-[175px] w-[175px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.07] blur-[42px]" />
            <div className="absolute left-1/2 top-[48%] h-24 w-48 -translate-x-1/2 rounded-full bg-blue-500/[0.07] blur-3xl" />

            {/* orbit rings */}
            <svg
              viewBox="0 0 300 235"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="orbitCyan" x1="0" x2="1">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity="0" />
                  <stop offset="40%" stopColor="#22D3EE" stopOpacity=".95" />
                  <stop offset="70%" stopColor="#818CF8" stopOpacity=".9" />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="orbitPink" x1="0" x2="1">
                  <stop offset="0%" stopColor="#F472B6" stopOpacity="0" />
                  <stop offset="45%" stopColor="#F472B6" stopOpacity=".9" />
                  <stop offset="75%" stopColor="#C084FC" stopOpacity=".8" />
                  <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
                </linearGradient>
                <filter id="glowOrbit">
                  <feGaussianBlur stdDeviation="2.4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g className="pf-orbit" style={{ transformOrigin: '150px 112px' }}>
                <ellipse
                  cx="150"
                  cy="112"
                  rx="118"
                  ry="51"
                  transform="rotate(8 150 112)"
                  fill="none"
                  stroke="url(#orbitCyan)"
                  strokeWidth="2"
                  filter="url(#glowOrbit)"
                />
                <circle cx="266" cy="127" r="5.7" fill="#67E8F9" />
                <circle cx="58" cy="93" r="4" fill="#38BDF8" />
              </g>

              <g className="pf-orbit-reverse" style={{ transformOrigin: '150px 112px' }}>
                <ellipse
                  cx="150"
                  cy="112"
                  rx="111"
                  ry="45"
                  transform="rotate(-21 150 112)"
                  fill="none"
                  stroke="url(#orbitPink)"
                  strokeWidth="2"
                  filter="url(#glowOrbit)"
                />
                <circle cx="246" cy="96" r="5.5" fill="#F9A8D4" />
                <circle cx="57" cy="133" r="5" fill="#C084FC" />
              </g>
            </svg>

            {/* CORE CUBE */}
            <motion.div
              className="pf-core-pulse absolute left-1/2 top-[27px] h-[128px] w-[128px] -translate-x-1/2"
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* back depth */}
              <div className="absolute left-[10px] top-[11px] h-[112px] w-[112px] rounded-[34px] bg-[#020914] shadow-[0_24px_45px_rgba(0,0,0,.65)]" />

              {/* glass plate */}
              <div
                className="absolute left-[4px] top-[5px] h-[112px] w-[112px] overflow-hidden rounded-[34px] border border-cyan-200/10"
                style={{
                  background:
                    'linear-gradient(145deg,rgba(13,31,49,.98),rgba(4,12,23,.99))',
                  boxShadow:
                    'inset 0 1px 1px rgba(255,255,255,.08),0 20px 42px rgba(0,0,0,.38),0 0 34px rgba(34,211,238,.10)',
                }}
              >
                <div className="absolute left-4 top-3 h-7 w-20 rounded-full bg-white/[0.045] blur-lg" />

                <svg viewBox="0 0 160 160" className="absolute inset-0 h-full w-full">
                  <defs>
                    <linearGradient id="cubeBlue" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#9CF9FF" />
                      <stop offset="32%" stopColor="#29D9FF" />
                      <stop offset="66%" stopColor="#4387FF" />
                      <stop offset="100%" stopColor="#7A4DFF" />
                    </linearGradient>

                    <linearGradient id="cubePink" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#C68CFF" />
                      <stop offset="50%" stopColor="#F95BC8" />
                      <stop offset="100%" stopColor="#FF5B93" />
                    </linearGradient>

                    <linearGradient id="cubeGold" x1="0" y1="1" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FFD84D" />
                      <stop offset="50%" stopColor="#FF9F43" />
                      <stop offset="100%" stopColor="#F16FD0" />
                    </linearGradient>

                    <filter id="cubeGlow">
                      <feGaussianBlur stdDeviation="2.7" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* blue/cyan voxel */}
                  <motion.path
                    d="M24 45C23 31 32 22 45 22H71L96 46 73 69H52L42 59H31C27 59 24 53 24 45Z"
                    fill="url(#cubeBlue)"
                    stroke="#A7FBFF"
                    strokeWidth="2"
                    filter="url(#cubeGlow)"
                    animate={{ opacity: [0.9, 1, 0.9] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  {/* violet voxel */}
                  <motion.path
                    d="M77 46 103 21 131 48 107 73 92 73 70 52Z"
                    fill="url(#cubeBlue)"
                    stroke="#9F9BFF"
                    strokeWidth="2"
                    filter="url(#cubeGlow)"
                    animate={{ opacity: [0.83, 1, 0.83] }}
                    transition={{ duration: 3.25, repeat: Infinity }}
                  />

                  {/* pink voxel */}
                  <motion.path
                    d="M107 70 132 48 145 61C151 67 151 78 144 84L119 109C111 117 100 117 92 109L75 94 96 74 106 85 120 71Z"
                    fill="url(#cubePink)"
                    stroke="#FF82D5"
                    strokeWidth="2"
                    filter="url(#cubeGlow)"
                    animate={{ opacity: [0.82, 1, 0.82] }}
                    transition={{ duration: 3.15, repeat: Infinity }}
                  />

                  {/* gold voxel */}
                  <motion.path
                    d="M75 93 98 114 74 139C68 145 58 145 50 138L35 122 57 99Z"
                    fill="url(#cubeGold)"
                    stroke="#FFE17D"
                    strokeWidth="2"
                    filter="url(#cubeGlow)"
                    animate={{ opacity: [0.82, 1, 0.82] }}
                    transition={{ duration: 2.8, repeat: Infinity }}
                  />

                  {/* center cutout */}
                  <path
                    d="M57 57 78 37 101 60 80 81Z"
                    fill="#03101E"
                    opacity=".97"
                  />

                  {/* top mini cube */}
                  <motion.g
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <path
                      d="M69 8 84 16 84 32 69 40 54 32 54 16Z"
                      fill="#31DFFF"
                      fillOpacity=".23"
                      stroke="#85F8FF"
                      strokeWidth="2"
                    />
                    <path
                      d="M69 8 84 16 69 24 54 16Z"
                      fill="#E7FDFF"
                      fillOpacity=".24"
                    />
                  </motion.g>

                  {/* accent diamonds */}
                  <motion.rect
                    x="124"
                    y="91"
                    width="13"
                    height="13"
                    rx="2"
                    transform="rotate(45 130.5 97.5)"
                    fill="#FF63BF"
                    fillOpacity=".25"
                    stroke="#FF9BDD"
                    strokeWidth="1.4"
                    animate={{ y: [91, 86, 91], opacity: [.3, .8, .3] }}
                    transition={{ duration: 2.9, repeat: Infinity }}
                  />

                  <motion.rect
                    x="24"
                    y="96"
                    width="12"
                    height="12"
                    rx="2"
                    transform="rotate(45 30 102)"
                    fill="#FFD54D"
                    fillOpacity=".25"
                    stroke="#FFE88A"
                    strokeWidth="1.4"
                    animate={{ y: [96, 100, 96], opacity: [.25, .7, .25] }}
                    transition={{ duration: 2.7, repeat: Infinity }}
                  />

                  {/* moving paths through the core */}
                  <path
                    d="M31 86C51 69 64 68 83 71"
                    fill="none"
                    stroke="#67E8F9"
                    strokeWidth="2"
                    strokeDasharray="5 7"
                    className="pf-path"
                    opacity=".72"
                  />
                  <path
                    d="M82 72C98 79 109 93 128 101"
                    fill="none"
                    stroke="#F472B6"
                    strokeWidth="2"
                    strokeDasharray="5 7"
                    className="pf-path-reverse"
                    opacity=".7"
                  />
                </svg>

                {/* internal gleam */}
                <motion.div
                  className="absolute left-[-30%] top-[-20%] h-[160%] w-[18%] rotate-[28deg] bg-white/[0.06] blur-[3px]"
                  animate={{ x: ['0%', '820%'] }}
                  transition={{
                    duration: 4.8,
                    repeat: Infinity,
                    repeatDelay: 2.2,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>

            {/* large orbiting dots */}
            <motion.span
              className="absolute left-[25px] top-[93px] h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_16px_rgba(103,232,249,.9)]"
              animate={{ y: [0, -5, 0], opacity: [.65, 1, .65] }}
              transition={{ duration: 2.8, repeat: Infinity }}
            />
            <motion.span
              className="absolute right-[28px] top-[110px] h-3.5 w-3.5 rounded-full bg-pink-300 shadow-[0_0_16px_rgba(244,114,182,.8)]"
              animate={{ y: [0, 5, 0], opacity: [.6, 1, .6] }}
              transition={{ duration: 3.3, repeat: Infinity }}
            />

            {/* tiny pixels */}
            <span className="absolute left-[68px] top-[54px] h-2 w-2 rotate-45 bg-cyan-300/60" />
            <span className="absolute right-[60px] top-[73px] h-2 w-2 rotate-45 bg-pink-300/55" />
            <span className="absolute left-[48px] bottom-[39px] h-1.5 w-1.5 rotate-45 bg-violet-300/55" />
            <span className="absolute right-[49px] bottom-[31px] h-2 w-2 rotate-45 bg-fuchsia-300/50" />
          </motion.div>

          {/* BRAND */}
          <motion.div
            className="mt-[-4px] flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.45 }}
          >
            <div
              className="font-mono text-[25px] font-black tracking-[0.20em] leading-none"
              style={{
                color: '#3DA0FF',
                textShadow:
                  '0 0 7px rgba(59,130,246,.45), 0 0 18px rgba(34,211,238,.18)',
              }}
            >
              PIXEL
            </div>

            <div
              className="font-mono text-[39px] font-black tracking-[0.045em] leading-[0.86]"
              style={{
                background: 'linear-gradient(90deg,#FF3E9D 0%,#F45DBA 48%,#FF4D82 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 0 18px rgba(244,114,182,.16)',
              }}
            >
              FLOW!
            </div>

            <div className="mt-1.5 flex items-center gap-2 text-[7px] font-mono font-bold tracking-[0.20em] text-slate-500">
              <span className="text-cyan-300">✦</span>
              CONNECT
              <span>•</span>
              SOLVE
              <span>•</span>
              RELAX
              <span className="text-pink-300">✦</span>
            </div>
          </motion.div>

          {/* JOURNEY */}
          <motion.div
            className="mt-1.5 w-full max-w-[350px]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.45 }}
          >
            <div className="mb-1 flex items-center justify-between px-1">
              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-500">
                Your Journey
              </span>

              <span className="font-mono text-[10px] font-black text-slate-300">
                {completedLevels} / {totalLevels}
              </span>
            </div>

            <div className="relative h-[11px] overflow-hidden rounded-full border border-blue-300/20 bg-[#0a1730]/90 shadow-[inset_0_1px_4px_rgba(0,0,0,.55)]">
              <motion.div
                className="relative h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shadow-[0_0_16px_rgba(34,211,238,.55)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ delay: 0.55, duration: 0.9, ease: 'easeOut' }}
              >
                <div className="absolute inset-y-0 right-0 w-12 bg-white/20 blur-[2px]" />
              </motion.div>
            </div>

            <div className="mt-0 flex items-center justify-end">
              <span className="font-mono text-[10px] font-black text-cyan-300">
                {Math.round(progress)}%
              </span>
            </div>
          </motion.div>
        </div>

        {/* ACTIONS */}
        <motion.div
          className="shrink-0 pt-0"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.5 }}
        >
          {/* CONTINUE */}
          <motion.button
            id="btn-home-continue"
            type="button"
            whileTap={{ scale: 0.975 }}
            onClick={() => {
              click();
              onContinue();
            }}
            className="pf-continue group relative w-full overflow-hidden rounded-[24px] border border-cyan-300/30 bg-gradient-to-r from-[#0C7CF7]/65 via-[#208DFF]/55 to-[#A634E7]/65] px-5 py-3.5"
            style={{
              boxShadow:
                '0 0 28px rgba(34,211,238,.14), 0 14px 34px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.12)',
            }}
          >
            <motion.div
              className="absolute left-[-25%] top-0 h-full w-[18%] -skew-x-12 bg-white/[0.12] blur-[2px]"
              animate={{ x: ['0%', '700%'] }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                repeatDelay: 2.4,
                ease: 'easeInOut',
              }}
            />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,.22)]">
                  <Play className="h-6 w-6 fill-white text-white drop-shadow-[0_0_7px_rgba(255,255,255,.35)]" />
                </div>

                <div className="text-left">
                  <div className="font-mono text-[15px] font-black tracking-[0.12em] text-white">
                    CONTINUE
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] font-bold tracking-[0.20em] text-white/80">
                    LEVEL {hasSavedProgress ? safeLevel : 1}
                  </div>
                </div>
              </div>

              <ChevronRight className="h-7 w-7 text-white drop-shadow-[0_0_8px_rgba(255,255,255,.3)] transition-transform group-hover:translate-x-1" />
            </div>
          </motion.button>

          {/* DAILY + STATS */}
          <div className="mt-2 grid grid-cols-2 gap-2">

            {/* Daily Flow */}
            <motion.button
              id="btn-home-daily-challenge"
              type="button"
              whileTap={{ scale: 0.985 }}
              onClick={() => {
                click();
                onDailyChallenge();
              }}
              className="pf-card group rounded-[22px] border border-fuchsia-300/30 bg-gradient-to-br from-fuchsia-500/[0.13] to-[#071324]/90 px-3 py-2 text-left backdrop-blur-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-500/15">
                  <CalendarDays className="h-5 w-5 text-fuchsia-300" />
                </div>

                <span
                  className={
                    isDailyCompleted
                      ? 'rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 py-1 text-[7px] font-black tracking-widest text-emerald-300'
                      : 'rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-2 py-1 text-[7px] font-black tracking-widest text-fuchsia-200'
                  }
                >
                  {isDailyCompleted ? 'DONE' : 'NEW'}
                </span>
              </div>

              <div className="mt-2 text-[11px] font-black tracking-[0.08em] text-white">
                DAILY FLOW
              </div>

              <div className="mt-0.5 text-[8px] text-slate-400">
                Today&apos;s Challenge
              </div>

              <div className="mt-1.5 flex items-center justify-between">
                <span className="font-mono text-[11px] font-black text-cyan-300">
                  {getTodayDisplayDate()}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.button>

            {/* Stats */}
            <motion.button
              id="btn-home-stats"
              type="button"
              whileTap={{ scale: 0.985 }}
              onClick={() => {
                click();
                onStats();
              }}
              className="pf-card group rounded-[22px] border border-cyan-300/25 bg-gradient-to-br from-cyan-500/[0.10] to-[#071324]/90 px-3 py-2 text-left backdrop-blur-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15">
                  <BarChart3 className="h-5 w-5 text-cyan-300" />
                </div>

                <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" />
              </div>

              <div className="mt-2 text-[11px] font-black tracking-[0.08em] text-white">
                STATS
              </div>

              <div className="mt-0.5 text-[8px] text-slate-400">
                Track Progress
              </div>

              <div className="mt-2 font-mono text-[11px] font-black text-cyan-300">
                {Math.round(progress)}% Complete
              </div>
            </motion.button>
          </div>

          {/* BOTTOM NAV */}
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            <button
              id="btn-home-level-select"
              type="button"
              onClick={() => {
                click();
                onLevelSelect();
              }}
              className="group rounded-[18px] border border-blue-400/35 bg-[#061121]/85 py-2 text-center backdrop-blur-xl transition-all active:scale-95"
            >
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                <Grid3X3 className="h-5 w-5 text-cyan-300 transition-transform group-hover:scale-110" />
              </div>
              <span className="mt-1 block text-[7px] font-black tracking-[0.13em] text-slate-200">
                LEVELS
              </span>
            </button>

            <button
              id="btn-home-achievements"
              type="button"
              onClick={() => {
                click();
                onStats();
              }}
              className="group rounded-[18px] border border-amber-400/35 bg-[#11100a]/80 py-2 text-center backdrop-blur-xl transition-all active:scale-95"
            >
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
                <Trophy className="h-5 w-5 text-amber-300 transition-transform group-hover:scale-110" />
              </div>
              <span className="mt-1 block text-[7px] font-black tracking-[0.10em] text-slate-200">
                ACHIEVEMENTS
              </span>
            </button>

            <button
              id="btn-home-howto"
              type="button"
              onClick={() => {
                click();
                onHowToPlay();
              }}
              className="group rounded-[18px] border border-violet-400/35 bg-[#0d0a17]/80 py-2 text-center backdrop-blur-xl transition-all active:scale-95"
            >
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
                <HelpCircle className="h-5 w-5 text-violet-300 transition-transform group-hover:scale-110" />
              </div>
              <span className="mt-1 block text-[7px] font-black tracking-[0.10em] text-slate-200">
                HOW TO PLAY
              </span>
            </button>

            <button
              id="btn-home-settings"
              type="button"
              onClick={() => {
                click();
                onSettings();
              }}
              className="group rounded-[18px] border border-slate-400/30 bg-[#09101a]/85 py-2 text-center backdrop-blur-xl transition-all active:scale-95"
            >
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-slate-500/10">
                <Settings className="h-5 w-5 text-slate-200 transition-transform group-hover:rotate-12" />
              </div>
              <span className="mt-1 block text-[7px] font-black tracking-[0.10em] text-slate-200">
                SETTINGS
              </span>
            </button>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-center gap-3 pt-1 text-[7px] font-mono font-bold tracking-[0.25em] text-slate-700">
            <span>SMALL PUZZLES</span>
            <span className="text-cyan-400/50">•</span>
            <span>BIG MOMENTS</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
