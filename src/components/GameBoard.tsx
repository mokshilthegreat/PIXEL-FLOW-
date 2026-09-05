import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Level, Position, ActivePath, CompletedPaths } from '../game/types';
import { COLOR_MAP } from '../game/colors';
import { PixelNode } from './PixelNode';
import { PixelPath } from './PixelPath';
import {
  canStepTo,
  findEndpointAt,
  isSamePos,
  isWithinBoard,
} from '../game/gameEngine';
import { soundManager } from '../utils/audio';
import { hapticsManager } from '../utils/haptics';

interface GameBoardProps {
  level: Level;
  completedPaths: CompletedPaths;
  colorblindMode: boolean;
  activeHintPairId: string | null;
  onPathComplete: (pairId: string, path: Position[]) => void;
  onPathRemoved: (pairId: string) => void;
  isLevelComplete: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  level,
  completedPaths,
  colorblindMode,
  activeHintPairId,
  onPathComplete,
  onPathRemoved,
  isLevelComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const [boardPixelSize, setBoardPixelSize] = useState<number>(320);
  const [activePath, setActivePath] = useState<ActivePath | null>(null);
  const [hasErrorShake, setHasErrorShake] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);

  // Measure container and maintain responsive square board
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      // Leave safety padding
      const maxAvailable = Math.min(clientWidth - 36, clientHeight - 36);
      const targetSize = Math.max(250, Math.min(480, maxAvailable));
      setBoardPixelSize(targetSize);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const cellSize = boardPixelSize / level.size;

  // Convert pointer coordinates to grid row & col
  const getGridPos = useCallback(
    (clientX: number, clientY: number): Position | null => {
      if (!boardRef.current) return null;
      const rect = boardRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (x < 0 || x >= rect.width || y < 0 || y >= rect.height) {
        return null;
      }

      const col = Math.floor((x / rect.width) * level.size);
      const row = Math.floor((y / rect.height) * level.size);

      if (!isWithinBoard({ row, col }, level.size)) return null;
      return { row, col };
    },
    [level.size]
  );

  // Pointer Down Handler
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isLevelComplete) return;

    const pos = getGridPos(e.clientX, e.clientY);
    if (!pos) return;

    // Check if user clicked on an endpoint
    const endpoint = findEndpointAt(pos, level.pairs);
    if (endpoint) {
      isDraggingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);

      // If this pair already has a completed path, remove it so player can redraw
      if (completedPaths[endpoint.pair.id]) {
        onPathRemoved(endpoint.pair.id);
      }

      const newPath: ActivePath = {
        pairId: endpoint.pair.id,
        color: endpoint.pair.color,
        points: [pos],
      };
      setActivePath(newPath);
      soundManager.playButtonClick();
      hapticsManager.light();
      return;
    }

    // Check if clicked an existing completed path to redraw from clicked point or start endpoint
    for (const [pairId, rawPath] of Object.entries(completedPaths)) {
      const path = rawPath as Position[];
      const idx = path.findIndex((p) => isSamePos(p, pos));
      if (idx !== -1) {
        const pair = level.pairs.find((p) => p.id === pairId);
        if (pair) {
          isDraggingRef.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          onPathRemoved(pairId);

          const newPath: ActivePath = {
            pairId,
            color: pair.color,
            points: path.slice(0, idx + 1),
          };
          setActivePath(newPath);
          soundManager.playButtonClick();
          hapticsManager.light();
          return;
        }
      }
    }
  };

  // Pointer Move Handler
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !activePath || isLevelComplete) return;

    const pos = getGridPos(e.clientX, e.clientY);
    if (!pos) return;

    const currentTip = activePath.points[activePath.points.length - 1];
    if (isSamePos(currentTip, pos)) return; // Still in same cell

    const stepCheck = canStepTo(pos, activePath, level, completedPaths);

    if (stepCheck.canMove) {
      if (stepCheck.isBacktrack) {
        // Backtracking: truncate path up to this cell
        const existingIdx = activePath.points.findIndex((p) => isSamePos(p, pos));
        if (existingIdx !== -1) {
          const updatedPoints = activePath.points.slice(0, existingIdx + 1);
          setActivePath({
            ...activePath,
            points: updatedPoints,
          });
          hapticsManager.light();
        }
      } else {
        // Stepping to next valid cell
        const updatedPoints = [...activePath.points, pos];
        setActivePath({
          ...activePath,
          points: updatedPoints,
        });

        if (stepCheck.isCompletion) {
          // Reached the matching endpoint!
          soundManager.playValidConnection(level.pairs.findIndex((p) => p.id === activePath.pairId));
          hapticsManager.light();
        } else {
          hapticsManager.light();
        }
      }
    }
  };

  // Pointer Up / Release Handler
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !activePath) return;

    isDraggingRef.current = false;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignored
    }

    const pair = level.pairs.find((p) => p.id === activePath.pairId);
    if (!pair) {
      setActivePath(null);
      return;
    }

    const start = activePath.points[0];
    const end = activePath.points[activePath.points.length - 1];

    const isConnected =
      (isSamePos(start, pair.start) && isSamePos(end, pair.end)) ||
      (isSamePos(start, pair.end) && isSamePos(end, pair.start));

    if (isConnected) {
      // Valid complete path!
      onPathComplete(activePath.pairId, activePath.points);
      setActivePath(null);
    } else {
      // Invalid / incomplete: clear path & show subtle error feedback
      soundManager.playInvalidMovement();
      hapticsManager.error();
      setHasErrorShake(true);
      setTimeout(() => setHasErrorShake(false), 300);
      setActivePath(null);
    }
  };

  // Render grid cells
  const gridCells = [];
  for (let r = 0; r < level.size; r++) {
    for (let c = 0; c < level.size; c++) {
      gridCells.push({ row: r, col: c });
    }
  }

  // Hint path calculation if active
  const hintPath =
    activeHintPairId && level.solution && level.solution[activeHintPairId]
      ? level.solution[activeHintPairId]
      : null;
  const hintPair = activeHintPairId
    ? level.pairs.find((p) => p.id === activeHintPairId)
    : null;

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center p-2"
    >
      {/* Outer Sophisticated Dark Glass Frame */}
      <div className="relative glass-panel p-3 sm:p-4 rounded-[28px] sm:rounded-[32px] shadow-2xl border border-white/10 flex items-center justify-center">
        <div
          id="pixel-game-board"
          ref={boardRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative rounded-xl sm:rounded-2xl bg-[#0F172A] select-none overflow-hidden touch-none transition-transform duration-150 ${
            hasErrorShake ? 'scale-[0.985] ring-2 ring-red-500/40' : ''
          }`}
          style={{
            width: `${boardPixelSize}px`,
            height: `${boardPixelSize}px`,
            touchAction: 'none',
          }}
        >
          {/* Grid background lines */}
          <div
            className="absolute inset-0 grid pointer-events-none"
            style={{
              gridTemplateColumns: `repeat(${level.size}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${level.size}, minmax(0, 1fr))`,
            }}
          >
            {gridCells.map((cell) => (
              <div
                key={`${cell.row}-${cell.col}`}
                className="board-cell flex items-center justify-center"
              >
                {/* Center subtle dot marker */}
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700/40" />
              </div>
            ))}
          </div>

          {/* SVG layer for paths */}
          <svg
            className="absolute inset-0 pointer-events-none w-full h-full"
            style={{
              width: `${boardPixelSize}px`,
              height: `${boardPixelSize}px`,
            }}
            viewBox={`0 0 ${boardPixelSize} ${boardPixelSize}`}
          >
            {/* Render Hint Guide Path if active */}
            {hintPath && hintPair && (
              <PixelPath
                points={hintPath}
                colorDef={COLOR_MAP[hintPair.color]}
                cellSize={boardPixelSize / level.size}
                isHint={true}
              />
            )}

            {/* Render Completed Paths */}
            {Object.entries(completedPaths).map(([pairId, points]) => {
              const pair = level.pairs.find((p) => p.id === pairId);
              if (!pair) return null;
              return (
                <PixelPath
                  key={pairId}
                  points={points}
                  colorDef={COLOR_MAP[pair.color]}
                  cellSize={boardPixelSize / level.size}
                  isActive={false}
                />
              );
            })}

            {/* Render Active Drawing Path */}
            {activePath && (
              <PixelPath
                points={activePath.points}
                colorDef={COLOR_MAP[activePath.color]}
                cellSize={boardPixelSize / level.size}
                isActive={true}
              />
            )}
          </svg>

          {/* Colored Endpoint Nodes Layer */}
          <div
            className="absolute inset-0 grid pointer-events-none"
            style={{
              gridTemplateColumns: `repeat(${level.size}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${level.size}, minmax(0, 1fr))`,
            }}
          >
            {level.pairs.map((pair) => {
              const isCompleted = !!completedPaths[pair.id];
              const isPairActive = activePath?.pairId === pair.id;
              const isHinted = activeHintPairId === pair.id;
              const colorDef = COLOR_MAP[pair.color];
              const innerCellSize = boardPixelSize / level.size;

              return (
                <React.Fragment key={pair.id}>
                  {/* Start Endpoint */}
                  <div
                    className="flex items-center justify-center"
                    style={{
                      gridRowStart: pair.start.row + 1,
                      gridColumnStart: pair.start.col + 1,
                    }}
                  >
                    <PixelNode
                      colorDef={colorDef}
                      isConnected={isCompleted}
                      isActive={isPairActive}
                      isHinted={isHinted}
                      colorblindMode={colorblindMode}
                      cellSize={innerCellSize}
                    />
                  </div>

                  {/* End Endpoint */}
                  <div
                    className="flex items-center justify-center"
                    style={{
                      gridRowStart: pair.end.row + 1,
                      gridColumnStart: pair.end.col + 1,
                    }}
                  >
                    <PixelNode
                      colorDef={colorDef}
                      isConnected={isCompleted}
                      isActive={isPairActive}
                      isHinted={isHinted}
                      colorblindMode={colorblindMode}
                      cellSize={innerCellSize}
                    />
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
