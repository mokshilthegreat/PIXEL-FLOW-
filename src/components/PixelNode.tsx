import React from 'react';
import { ColorDefinition } from '../game/colors';
import { motion } from 'motion/react';

interface PixelNodeProps {
  colorDef: ColorDefinition;
  isConnected: boolean;
  isActive: boolean;
  isHinted?: boolean;
  colorblindMode: boolean;
  cellSize: number;
}

export const PixelNode: React.FC<PixelNodeProps> = ({
  colorDef,
  isConnected,
  isActive,
  isHinted,
  colorblindMode,
  cellSize,
}) => {
  const nodeDiameter = Math.round(cellSize * 0.72);
  const coreDiameter = Math.round(nodeDiameter * 0.58);

  return (
    <div
      className="relative flex items-center justify-center select-none pointer-events-none"
      style={{
        width: `${nodeDiameter}px`,
        height: `${nodeDiameter}px`,
      }}
    >
      {/* Outer ambient glow halo */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: `${nodeDiameter + 8}px`,
          height: `${nodeDiameter + 8}px`,
          backgroundColor: colorDef.hex,
          filter: `blur(8px)`,
          opacity: isConnected ? 0.65 : isActive || isHinted ? 0.85 : 0.35,
        }}
        animate={
          isHinted || isActive
            ? { scale: [1, 1.25, 1], opacity: [0.4, 0.9, 0.4] }
            : { scale: 1 }
        }
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main node body */}
      <motion.div
        className="relative rounded-full flex items-center justify-center border shadow-lg"
        style={{
          width: `${nodeDiameter}px`,
          height: `${nodeDiameter}px`,
          backgroundColor: colorDef.hex,
          borderColor: '#FFFFFF',
          boxShadow: `0 0 16px ${colorDef.glowHex}, 0 2px 8px rgba(0,0,0,0.5)`,
        }}
        animate={
          isConnected
            ? { scale: [1, 1.15, 1], transition: { duration: 0.3 } }
            : {}
        }
      >
        {/* Inner bright core */}
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: `${coreDiameter}px`,
            height: `${coreDiameter}px`,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            boxShadow: '0 0 6px #FFFFFF inset',
          }}
        >
          {colorblindMode ? (
            <span
              className="text-xs font-black select-none leading-none"
              style={{ color: '#090D16' }}
            >
              {colorDef.symbol}
            </span>
          ) : (
            <div
              className="rounded-full"
              style={{
                width: `${Math.round(coreDiameter * 0.45)}px`,
                height: `${Math.round(coreDiameter * 0.45)}px`,
                backgroundColor: colorDef.hex,
              }}
            />
          )}
        </div>

        {/* Ring indicator if connected */}
        {isConnected && (
          <div
            className="absolute inset-0 rounded-full border-2 border-white/60 animate-pulse pointer-events-none"
          />
        )}
      </motion.div>
    </div>
  );
};
