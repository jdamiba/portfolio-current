import { useRef, useState } from "react";
import { Snake, Direction } from "./types";
import { getAliveCells, createRandomPatternGrid } from "./gameOfLife";
import { getHighContrastColor } from "./colorUtils";

const BACKGROUND_COLOR = "#f3f4f6";

export function useSnakeGame(gridSize = 36, containerPx = 500) {
  const cellSize = Math.floor(containerPx / gridSize);
  const [sliderValue] = useState(500);
  const [snakes, setSnakes] = useState<Snake[]>(() => [
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
  const [appleGrid, setAppleGrid] = useState<(string | null)[][]>(() =>
    createRandomPatternGrid(gridSize, 7, 3, 2, 2, 1)
  );
  const apples: [number, number, string][] = getAliveCells(appleGrid);
  const [autoplay, setAutoplay] = useState(true);
  const [manualDir, setManualDir] = useState<[number, number]>([1, 0]);
  const [spawnMode, setSpawnMode] = useState<"snake" | "apple">("snake");
  const [fadingSnakes, setFadingSnakes] = useState<number[]>([]);
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const applesEatenRef = useRef<[number, number][]>([]);
  const snakesRef = useRef(snakes);

  // ... (all effects and handlers from SnakeGame, except rendering)

  // Return all state and handlers needed for rendering and controls
  return {
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
  };
}
