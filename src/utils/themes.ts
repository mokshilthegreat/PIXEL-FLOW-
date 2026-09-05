export interface ThemeDefinition {
  id: string;
  name: string;
  tagline: string;
  glowHex: string;
  accentHex: string;
  boardBg: string;
  particleColors: string[];
  unlockLevel: number;
  cost: number;
  previewGradient: string;
}

export const COSMETIC_THEMES: Record<string, ThemeDefinition> = {
  cyan: {
    id: 'cyan',
    name: 'Electric Cyan',
    tagline: 'The iconic Pixel Flow aesthetic',
    glowHex: '#06B6D4',
    accentHex: '#22D3EE',
    boardBg: '#0B132B',
    particleColors: ['#06B6D4', '#3B82F6', '#60A5FA'],
    unlockLevel: 1,
    cost: 0,
    previewGradient: 'from-cyan-500 to-blue-600',
  },
  violet: {
    id: 'violet',
    name: 'Neon Violet',
    tagline: 'Unlocked at Chapter 2',
    glowHex: '#A855F7',
    accentHex: '#C084FC',
    boardBg: '#120E2E',
    particleColors: ['#A855F7', '#C084FC', '#E879F9'],
    unlockLevel: 11,
    cost: 150,
    previewGradient: 'from-purple-500 to-indigo-600',
  },
  sunset: {
    id: 'sunset',
    name: 'Solar Sunset',
    tagline: 'Warm dusk energy',
    glowHex: '#F43F5E',
    accentHex: '#FB7185',
    boardBg: '#1C0D1E',
    particleColors: ['#F43F5E', '#FB923C', '#FBBF24'],
    unlockLevel: 31,
    cost: 250,
    previewGradient: 'from-rose-500 to-amber-500',
  },
  aurora: {
    id: 'aurora',
    name: 'Emerald Aurora',
    tagline: 'Boreal forest glow',
    glowHex: '#10B981',
    accentHex: '#34D399',
    boardBg: '#091A18',
    particleColors: ['#10B981', '#06B6D4', '#6EE7B7'],
    unlockLevel: 51,
    cost: 400,
    previewGradient: 'from-emerald-500 to-teal-500',
  },
  plasma: {
    id: 'plasma',
    name: 'Deep Plasma',
    tagline: 'High voltage resonance',
    glowHex: '#EC4899',
    accentHex: '#F472B6',
    boardBg: '#1B0D28',
    particleColors: ['#EC4899', '#8B5CF6', '#38BDF8'],
    unlockLevel: 71,
    cost: 600,
    previewGradient: 'from-pink-500 to-purple-600',
  },
  golden: {
    id: 'golden',
    name: 'Master Gold',
    tagline: 'The mark of a true Flow Master',
    glowHex: '#EAB308',
    accentHex: '#FDE047',
    boardBg: '#1C190D',
    particleColors: ['#EAB308', '#F59E0B', '#FEF08A'],
    unlockLevel: 91,
    cost: 1000,
    previewGradient: 'from-amber-400 to-yellow-500',
  },
};

export const DEFAULT_THEME_ID = 'cyan';

export function getTheme(id?: string): ThemeDefinition {
  if (id && COSMETIC_THEMES[id]) {
    return COSMETIC_THEMES[id];
  }
  return COSMETIC_THEMES[DEFAULT_THEME_ID];
}
