"use client";

import React, { useEffect, useState } from "react";
import { Direction } from "./SnakeGame/types";
import { getRandomApple, getNextDirection } from "./SnakeGame/snakeLogic";
import { SnakeBoard } from "./SnakeGame/SnakeBoard";
import {
  getAliveCells,
  nextLifeGrid,
  placeGliderColored,
  placeLWSSColored,
  createRandomPatternGrid,
} from "./SnakeGame/gameOfLife";
import {
  getHighContrastColor,
  getRandomPatternColor,
} from "./SnakeGame/colorUtils";
import { SnakeControls } from "./SnakeGame/SnakeControls";
import { useSnakeGame } from "./SnakeGame/useSnakeGame";
import {
  createHandleCellClick,
  createHandleGridPointerDown,
  createHandleGridPointerUp,
} from "./SnakeGame/SnakeHandlers";

const BACKGROUND_COLOR = "#f3f4f6";

export function SnakeGame() {
  const {
    gridSize,
    cellSize,
    snakes,
    setSnakes,
    appleGrid,
    setAppleGrid,
    apples,
    autoplay,
    setAutoplay,
    manualDir,
    setManualDir,
    spawnMode,
    setSpawnMode,
    fadingSnakes,
    setFadingSnakes,
    showCountdown,
    setShowCountdown,
    countdown,
    setCountdown,
    intervalRef,
    lastTouchRef,
    applesEatenRef,
    snakesRef,
    sliderValue,
  } = useSnakeGame();

  const [longestSnakeLength, setLongestSnakeLength] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  // On mount, load from localStorage
  useEffect(() => {
    setHasMounted(true);
    try {
      const stored = localStorage.getItem("longestSnakeLength");
      if (stored) setLongestSnakeLength(Number(stored));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Reset handler
  const handleReset = () => {
    setSnakes([
      (() => {
        const bodyColor = getHighContrastColor([BACKGROUND_COLOR], 120);
        const headColor = getHighContrastColor(
          [BACKGROUND_COLOR, bodyColor],
          120
        );
        return {
          body: Array.from(
            { length: 5 },
            (_, j) =>
              [Math.floor(gridSize / 2) - j, Math.floor(gridSize / 2)] as [
                number,
                number
              ]
          ),
          dir: [1, 0] as Direction,
          alive: true,
          bodyColor,
          headColor,
        };
      })(),
    ]);
    setAppleGrid(() => createRandomPatternGrid(gridSize, 7, 3, 2, 2, 1));
  };

  // Countdown effect
  useEffect(() => {
    if (!showCountdown) return;
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c > 1) return c - 1;
        clearInterval(timer);
        setTimeout(() => setShowCountdown(false), 700);
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [setCountdown, setShowCountdown, showCountdown]);

  // Main game loop (now also updates Game of Life)
  useEffect(() => {
    if (showCountdown) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSnakes((prevSnakes) => {
        let newSnakes = [...prevSnakes];
        let changed = false;
        const eaten: [number, number][] = [];
        for (let sIdx = 0; sIdx < newSnakes.length; sIdx++) {
          const snake = newSnakes[sIdx];
          if (!snake.alive) continue;
          const head = snake.body[0];
          let nearestApple = apples[0];
          let minDist =
            Math.abs(head[0] - nearestApple[0]) +
            Math.abs(head[1] - nearestApple[1]);
          for (const a of apples) {
            const dist = Math.abs(head[0] - a[0]) + Math.abs(head[1] - a[1]);
            if (dist < minDist) {
              minDist = dist;
              nearestApple = a;
            }
          }
          const nearestAppleXY: [number, number] = [
            nearestApple[0],
            nearestApple[1],
          ];
          let nextDir = snake.dir;
          if (autoplay) {
            nextDir = getNextDirection(
              snake.body,
              nearestAppleXY,
              snake.dir,
              newSnakes.map((s) => s.body),
              [],
              gridSize
            );
          } else {
            const [dx, dy] = manualDir;
            const [cdx, cdy] = snake.dir;
            if (dx !== -cdx || dy !== -cdy) {
              nextDir = manualDir;
            }
          }
          const [dx, dy] = nextDir;
          const [x, y] = [head[0] + dx, head[1] + dy];
          if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
            newSnakes[sIdx] = { ...snake, alive: false };
            changed = true;
            continue;
          }
          const bodyCollision = newSnakes.some((other, idx) =>
            other.body.some(
              ([sx, sy], i) => (idx !== sIdx || i !== 0) && sx === x && sy === y
            )
          );
          if (bodyCollision) {
            newSnakes[sIdx] = { ...snake, alive: false };
            changed = true;
            continue;
          }
          // Apple eating: only eat the cell the snake moves onto
          let grew = false;
          if (appleGrid[x] && appleGrid[x][y]) {
            grew = true;
            eaten.push([x, y]);
          }
          let newBody = [[x, y], ...snake.body] as [number, number][];
          if (!grew) newBody = newBody.slice(0, -1) as [number, number][];
          newSnakes[sIdx] = { ...snake, body: newBody, dir: nextDir };
        }
        applesEatenRef.current = eaten;
        if (changed) {
          newSnakes = newSnakes.filter((s) => s.alive);
          newSnakes.push(
            (() => {
              const bodyColor = getHighContrastColor([BACKGROUND_COLOR], 120);
              const headColor = getHighContrastColor(
                [BACKGROUND_COLOR, bodyColor],
                120
              );
              return {
                body: Array.from(
                  { length: 5 },
                  (_, j) =>
                    [
                      Math.floor(gridSize / 2) - j,
                      Math.floor(gridSize / 2),
                    ] as [number, number]
                ),
                dir: [1, 0] as Direction,
                alive: true,
                bodyColor,
                headColor,
              };
            })()
          );
        }
        // --- Game of Life update for apples ---
        setAppleGrid((prevGrid) => {
          // Remove apples eaten by the snake this tick
          const nextGrid: (string | null)[][] = prevGrid.map((row) => [...row]);
          for (const [ex, ey] of applesEatenRef.current) {
            if (nextGrid[ex] && nextGrid[ex][ey]) {
              nextGrid[ex][ey] = null;
            }
          }
          applesEatenRef.current = [];
          const forbidden = new Set(
            newSnakes.flatMap((s) => s.body.map(([x, y]) => `${x},${y}`))
          );
          const updated = nextLifeGrid(nextGrid, forbidden);
          if (getAliveCells(updated).length === 0) {
            return createRandomPatternGrid(gridSize, 7, 3, 2, 2, 1);
          }
          return updated;
        });
        // --- Longest snake logic ---
        const maxLength = Math.max(...newSnakes.map((s) => s.body.length), 0);
        if (maxLength > longestSnakeLength) {
          setLongestSnakeLength(maxLength);
          try {
            localStorage.setItem("longestSnakeLength", String(maxLength));
          } catch (e) {
            console.error(e);
          }
        }
        return newSnakes;
      });
    }, 550 - sliderValue);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    autoplay,
    setAppleGrid,
    manualDir,
    showCountdown,
    apples,
    sliderValue,
    longestSnakeLength,
    appleGrid,
    intervalRef,
    applesEatenRef,
    gridSize,
    setSnakes,
  ]);

  useEffect(() => {
    snakesRef.current = snakes;
  }, [snakesRef, snakes]);

  const handleCellClick = createHandleCellClick({
    snakes,
    setSnakes,
    spawnMode,
    gridSize,
    getRandomApple,
    getHighContrastColor,
    BACKGROUND_COLOR,
  });
  const handleGridPointerDown = createHandleGridPointerDown({
    autoplay,
    showCountdown,
    lastTouchRef,
  });
  const handleGridPointerUp = createHandleGridPointerUp({
    autoplay,
    showCountdown,
    lastTouchRef,
    setManualDir,
  });

  // When a snake dies, add its index to fadingSnakes
  useEffect(() => {
    setFadingSnakes((prev) => {
      const dead = snakes
        .map((snake, idx) => (!snake.alive && !prev.includes(idx) ? idx : null))
        .filter((idx) => idx !== null) as number[];
      if (dead.length === 0) return prev;
      return [...prev, ...dead];
    });
  }, [snakes, setFadingSnakes]);

  // Remove faded snakes after animation
  useEffect(() => {
    if (fadingSnakes.length === 0) return;
    const timeout = setTimeout(() => {
      setSnakes((prev) => prev.filter((_, idx) => !fadingSnakes.includes(idx)));
      setFadingSnakes([]);
    }, 700); // match fade duration
    return () => clearTimeout(timeout);
  }, [setSnakes, setFadingSnakes, fadingSnakes]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAppleGrid((prevGrid) => {
        // Randomly choose to spawn a glider or spaceship
        const size = prevGrid.length;
        const newGrid: (string | null)[][] = prevGrid.map((row) => [...row]);
        const usedColors: string[] = [];
        for (let x = 0; x < size; x++)
          for (let y = 0; y < size; y++)
            if (newGrid[x][y]) usedColors.push(newGrid[x][y] as string);
        const spawnType = Math.random() < 0.5 ? "glider" : "lwss";
        if (spawnType === "glider") {
          const gliderSize = 3;
          for (let attempt = 0; attempt < 100; attempt++) {
            const x = Math.floor(Math.random() * (size - gliderSize + 1));
            const y = Math.floor(Math.random() * (size - gliderSize + 1));
            let overlap = false;
            for (let dx = 0; dx < gliderSize; dx++) {
              for (let dy = 0; dy < gliderSize; dy++) {
                if (newGrid[x + dx][y + dy]) {
                  overlap = true;
                  break;
                }
              }
              if (overlap) break;
            }
            if (!overlap) {
              const color = getRandomPatternColor(usedColors);
              placeGliderColored(newGrid, x, y, color);
              return newGrid;
            }
          }
        } else {
          const lwssSize = [4, 5];
          for (let attempt = 0; attempt < 100; attempt++) {
            const x = Math.floor(Math.random() * (size - lwssSize[0] + 1));
            const y = Math.floor(Math.random() * (size - lwssSize[1] + 1));
            let overlap = false;
            for (let dx = 0; dx < lwssSize[0]; dx++) {
              for (let dy = 0; dy < lwssSize[1]; dy++) {
                if (newGrid[x + dx][y + dy]) {
                  overlap = true;
                  break;
                }
              }
              if (overlap) break;
            }
            if (!overlap) {
              const color = getRandomPatternColor(usedColors);
              placeLWSSColored(newGrid, x, y, color);
              return newGrid;
            }
          }
        }
        return newGrid;
      });
    }, 2000); // every 7 seconds (adjust as desired)
    return () => clearInterval(interval);
  }, [setAppleGrid]);

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col items-center w-full">
      <SnakeControls
        autoplay={autoplay}
        setAutoplay={setAutoplay}
        spawnMode={spawnMode}
        setSpawnMode={setSpawnMode}
        onReset={handleReset}
      />
      <div className="mb-2 text-sm text-gray-600">
        Longest Snake: {longestSnakeLength}
      </div>
      <div className="relative w-full">
        <SnakeBoard
          snakes={snakes}
          apples={apples}
          cellSize={cellSize}
          gridSize={gridSize}
          fadingSnakes={fadingSnakes}
          onCellClick={handleCellClick}
          onPointerDown={handleGridPointerDown}
          onPointerUp={handleGridPointerUp}
        />
        {showCountdown && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div
              className="text-7xl md:text-8xl font-extrabold text-primary-foreground bg-black/60 rounded-2xl px-12 py-8 animate-fade-scale"
              style={{
                transition: "opacity 0.3s, transform 0.3s",
                opacity: 1,
                transform: "scale(1)",
              }}
            >
              {countdown > 0 ? countdown : "Go!"}
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes fade-scale {
          0% {
            opacity: 0;
            transform: scale(0.7);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-scale {
          animation: fade-scale 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .snake-fade-out {
          opacity: 0 !important;
          transition: opacity 0.7s;
        }
      `}</style>
    </div>
  );
}
