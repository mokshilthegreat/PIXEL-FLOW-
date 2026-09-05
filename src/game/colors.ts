import { ColorId } from './types';

export type ColorDefinition = {
  id: ColorId;
  name: string;
  hex: string;
  glowHex: string;
  trailHex: string;
  symbol: string; // Colorblind icon symbol
  symbolShape: 'circle' | 'diamond' | 'square' | 'triangle' | 'star' | 'cross' | 'plus' | 'hexagon';
  glowClass: string;
};

export const COLOR_MAP: Record<ColorId, ColorDefinition> = {
  blue: {
    id: 'blue',
    name: 'Cobalt Blue',
    hex: '#3B82F6',
    glowHex: '#60A5FA',
    trailHex: 'rgba(59, 130, 246, 0.45)',
    symbol: '●',
    symbolShape: 'circle',
    glowClass: 'neon-glow-blue',
  },
  cyan: {
    id: 'cyan',
    name: 'Electric Cyan',
    hex: '#06B6D4',
    glowHex: '#22D3EE',
    trailHex: 'rgba(6, 182, 212, 0.45)',
    symbol: '◆',
    symbolShape: 'diamond',
    glowClass: 'neon-glow-cyan',
  },
  purple: {
    id: 'purple',
    name: 'Neon Violet',
    hex: '#A855F7',
    glowHex: '#C084FC',
    trailHex: 'rgba(168, 85, 247, 0.45)',
    symbol: '▲',
    symbolShape: 'triangle',
    glowClass: 'neon-glow-purple',
  },
  pink: {
    id: 'pink',
    name: 'Hot Pink',
    hex: '#EC4899',
    glowHex: '#F472B6',
    trailHex: 'rgba(236, 72, 153, 0.45)',
    symbol: '★',
    symbolShape: 'star',
    glowClass: 'neon-glow-pink',
  },
  green: {
    id: 'green',
    name: 'Cyber Emerald',
    hex: '#10B981',
    glowHex: '#34D399',
    trailHex: 'rgba(16, 185, 129, 0.45)',
    symbol: '■',
    symbolShape: 'square',
    glowClass: 'neon-glow-green',
  },
  orange: {
    id: 'orange',
    name: 'Solar Orange',
    hex: '#F97316',
    glowHex: '#FB923C',
    trailHex: 'rgba(249, 115, 22, 0.45)',
    symbol: '⬟',
    symbolShape: 'hexagon',
    glowClass: 'neon-glow-orange',
  },
  yellow: {
    id: 'yellow',
    name: 'Laser Yellow',
    hex: '#EAB308',
    glowHex: '#FACC15',
    trailHex: 'rgba(234, 179, 8, 0.45)',
    symbol: '✚',
    symbolShape: 'plus',
    glowClass: 'neon-glow-yellow',
  },
  red: {
    id: 'red',
    name: 'Crimson Glow',
    hex: '#EF4444',
    glowHex: '#F87171',
    trailHex: 'rgba(239, 68, 68, 0.45)',
    symbol: '✖',
    symbolShape: 'cross',
    glowClass: 'neon-glow-red',
  },
};
