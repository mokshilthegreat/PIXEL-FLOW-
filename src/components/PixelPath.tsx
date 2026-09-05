import React from 'react';
import { Position } from '../game/types';
import { ColorDefinition } from '../game/colors';

interface PixelPathProps {
  points: Position[];
  colorDef: ColorDefinition;
  cellSize: number;
  isActive?: boolean;
  isHint?: boolean;
  isGhost?: boolean;
}

export const PixelPath: React.FC<PixelPathProps> = ({
  points,
  colorDef,
  cellSize,
  isActive = false,
  isHint = false,
  isGhost = false,
}) => {
  if (!points || points.length === 0) return null;

  const strokeWidth = Math.round(cellSize * 0.52);

  // If path has only 1 point, draw a round cap
  if (points.length === 1) {
    const cx = (points[0].col + 0.5) * cellSize;
    const cy = (points[0].row + 0.5) * cellSize;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={strokeWidth / 2}
        fill={colorDef.hex}
        opacity={isGhost ? 0.35 : 0.85}
      />
    );
  }

  const d = points.reduce((acc, pt, index) => {
    const x = (pt.col + 0.5) * cellSize;
    const y = (pt.row + 0.5) * cellSize;
    if (index === 0) return `M ${x} ${y}`;
    return `${acc} L ${x} ${y}`;
  }, '');

  return (
    <g className="pointer-events-none select-none">
      {/* Outer soft neon bloom */}
      <path
        d={d}
        fill="none"
        stroke={colorDef.glowHex}
        strokeWidth={strokeWidth + 8}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={isGhost ? 0.2 : isActive ? 0.55 : 0.35}
        filter="blur(4px)"
      />

      {/* Main vibrant path */}
      <path
        d={d}
        fill="none"
        stroke={colorDef.hex}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={isGhost ? 0.45 : isHint ? 0.85 : 0.95}
        strokeDasharray={isHint ? '8 6' : undefined}
      />

      {/* Inner highlight core for glossy neon tube look */}
      <path
        d={d}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={Math.max(2, Math.round(strokeWidth * 0.25))}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={isGhost ? 0.2 : 0.75}
      />
    </g>
  );
};
